import json
import time
from sqlalchemy.orm import Session
from db.database import SessionLocal
import database.crud as crud
from services.similarity_service import SimilarityService
from services.llm_provider import LLMProvider, BaseLLMProvider, LLMProviderException
from db.models import Pattern, Claim, ReasoningRun, Assumption
import datetime
from core.config import settings
from .prompts import PromptRegistry
from services.telemetry_service import TelemetryService

class UniversalReasoningEngine:
    def __init__(self, db: Session = None, llm_provider: BaseLLMProvider = None):
        self.db = db or SessionLocal()
        self.llm_provider = llm_provider or LLMProvider()
        
    def _close_db(self):
        if self.db:
            self.db.close()

    def evaluate_decision(self, decision_id: int, execution_topology: str = "deliberative", run_record_id: int = None):
        """
        execution_topology options: "single", "parallel", "deliberative"
        """
        decision = crud.get_decision(self.db, decision_id)
        if not decision:
            raise ValueError(f"Decision {decision_id} not found.")
            
        domain_pack = crud.get_domain_pack(self.db, decision.domain_pack_id)
        if not domain_pack:
            raise ValueError(f"Domain pack {decision.domain_pack_id} not found.")
            
        agents = crud.get_reasoning_agents(self.db, domain_pack.id)
        if not agents:
            raise ValueError(f"No agents configured for domain pack {domain_pack.id}.")
            
        subject = decision.subject
        
        # ACTIVE MEMORY INJECTION
        similar_decisions = SimilarityService.get_similar_decisions(self.db, decision.id)
        patterns = self.db.query(Pattern).filter(Pattern.domain_pack_id == domain_pack.id).all()
        pattern_statements = [p.statement for p in patterns]
        
        memory_context = {
            "similar_historical_decisions": similar_decisions,
            "known_blind_spots": pattern_statements
        }
        
        if run_record_id:
            run = self.db.query(ReasoningRun).filter_by(id=run_record_id).first()
        else:
            run = ReasoningRun(
                decision_id=decision.id,
                execution_mode=settings.APEX_LLM_MODE,
                provider=settings.APEX_REASONING_PROVIDER,
                model=settings.APEX_REASONING_MODEL,
                prompt_version=PromptRegistry.VERSION,
                reasoning_config_json=json.dumps({"topology": execution_topology}),
                status="Running"
            )
            self.db.add(run)
            self.db.commit()
            
        # Initialize trackers from existing run if resuming
        latency_tracker = json.loads(run.latency_ms_json) if run.latency_ms_json else {}
        token_tracker = json.loads(run.token_usage_json) if run.token_usage_json else {"input": 0, "output": 0}
        intermediate_state = json.loads(run.intermediate_state_json) if run.intermediate_state_json else {}
        
        def _save_cost_and_tokens(tokens_dict, stage):
            token_tracker["input"] += tokens_dict["input"]
            token_tracker["output"] += tokens_dict["output"]
            
            # Simple mock cost calculation. In production, use provider-specific logic.
            # $0.005 per 1k input, $0.015 per 1k output as baseline for gemini-1.5-pro-latest
            cost = (tokens_dict["input"] / 1000.0 * 0.005) + (tokens_dict["output"] / 1000.0 * 0.015)
            run.accumulated_cost = (run.accumulated_cost or 0.0) + cost
            run.token_usage_json = json.dumps(token_tracker)
            self.db.commit()
        
        try:
            # Check cost before continuing
            if run.accumulated_cost and run.accumulated_cost >= settings.MAX_COST_PER_CASE:
                raise ValueError(f"Max cost per case exceeded: {run.accumulated_cost}")

            # Gather Evidence
            claims = self.db.query(Claim).filter(Claim.decision_id == decision.id).all()
            assumptions = self.db.query(Assumption).filter(Assumption.decision_id == decision.id).all()
            
            # Select agents based on topology
            if execution_topology == "single":
                agents = agents[:1]
                
            # --- ROUND 1: INDEPENDENT PERSPECTIVES ---
            agent_perspectives = intermediate_state.get("round_1", [])
            if run.stage_status in ["EXTRACTION_COMPLETE", "STARTED"]:
                t0 = time.time()
                for agent in agents:
                    perspective, tokens = self._run_agent_perspective(agent, decision, subject, claims, assumptions, memory_context)
                    agent_perspectives.append(perspective)
                    _save_cost_and_tokens(tokens, "round_1")
                    TelemetryService.log_telemetry(self.db, run.evaluation_run_id, decision.id, f"ROUND_1_AGENT_{agent.id}", settings.APEX_REASONING_PROVIDER, settings.APEX_REASONING_MODEL, tokens)
                latency_tracker["r1"] = int((time.time() - t0) * 1000)
                
                intermediate_state["round_1"] = agent_perspectives
                run.intermediate_state_json = json.dumps(intermediate_state)
                run.stage_status = "ROUND_1_COMPLETE"
                run.latency_ms_json = json.dumps(latency_tracker)
                self.db.commit()
            
            # --- ROUND 2: STRUCTURED CHALLENGE ---
            challenged_perspectives = intermediate_state.get("round_2", [])
            final_agent_input = agent_perspectives
            
            if execution_topology == "deliberative" and len(agents) > 1:
                if run.stage_status == "ROUND_1_COMPLETE":
                    t1 = time.time()
                    for i, agent in enumerate(agents):
                        # Pick the most conflicting perspective (for now, simply the next agent's output as proxy)
                        conflicting_index = (i + 1) % len(agents)
                        conflict = agent_perspectives[conflicting_index]
                        
                        challenge_result, tokens = self._run_agent_challenge(
                            agent, 
                            original_perspective=agent_perspectives[i], 
                            conflicting_perspective=conflict
                        )
                        challenged_perspectives.append({
                            "agent_name": agent.name,
                            "original": agent_perspectives[i],
                            "challenge_response": challenge_result
                        })
                        _save_cost_and_tokens(tokens, "round_2")
                        TelemetryService.log_telemetry(self.db, run.evaluation_run_id, decision.id, f"ROUND_2_AGENT_{agent.id}", settings.APEX_REASONING_PROVIDER, settings.APEX_REASONING_MODEL, tokens)
                    latency_tracker["r2"] = int((time.time() - t1) * 1000)
                    final_agent_input = challenged_perspectives
                    
                    intermediate_state["round_2"] = final_agent_input
                    run.intermediate_state_json = json.dumps(intermediate_state)
                    run.stage_status = "ROUND_2_COMPLETE"
                    run.latency_ms_json = json.dumps(latency_tracker)
                    self.db.commit()
                else:
                    final_agent_input = challenged_perspectives
            else:
                latency_tracker["r2"] = 0
                run.stage_status = "ROUND_2_COMPLETE"
                self.db.commit()
                
            # --- FINAL SYNTHESIS ---
            synthesis = intermediate_state.get("synthesis", None)
            if run.stage_status == "ROUND_2_COMPLETE":
                t2 = time.time()
                synthesis, tokens = self._synthesize_debate(domain_pack, decision, subject, final_agent_input, memory_context)
                _save_cost_and_tokens(tokens, "synthesis")
                TelemetryService.log_telemetry(self.db, run.evaluation_run_id, decision.id, "SYNTHESIS", settings.APEX_REASONING_PROVIDER, settings.APEX_SYNTHESIS_MODEL, tokens)
                latency_tracker["synthesis"] = int((time.time() - t2) * 1000)
                
                intermediate_state["synthesis"] = synthesis
                run.intermediate_state_json = json.dumps(intermediate_state)
                run.stage_status = "SYNTHESIS_COMPLETE"
                run.latency_ms_json = json.dumps(latency_tracker)
                self.db.commit()
            
            # Output payload
            output = {
                "decision_id": decision.id,
                "domain_pack": domain_pack.name,
                "execution_mode": settings.APEX_LLM_MODE,
                "topology": execution_topology,
                "agent_perspectives": final_agent_input,
                "synthesis": synthesis
            }
            
            run.status = "Completed"
            run.output_json = json.dumps(output)
            run.end_time = datetime.datetime.utcnow()
            self.db.commit()
            
            return output
        except LLMProviderException as e:
            run.status = "Failed"
            run.errors_json = json.dumps({"error": str(e)})
            run.end_time = datetime.datetime.utcnow()
            self.db.commit()
            raise ValueError(f"Reasoning engine failed: {str(e)}")
            
    def _run_agent_perspective(self, agent, decision, subject, claims, assumptions, memory_context):
        claims_text = "\\n".join([f"- [ID: {c.id}] {c.statement} (Provenance: {c.provenance_type})" for c in claims])
        assumptions_text = "\\n".join([f"- [ID: {a.id}] {a.statement}" for a in assumptions])
        
        system_prompt = PromptRegistry.get_agent_perspective_prompt(
            agent_name=agent.name,
            agent_system_prompt=agent.system_prompt,
            blind_spots=memory_context['known_blind_spots']
        )
        
        user_prompt = f"""
        Decision: {decision.title}
        Subject: {subject.name}
        
        Extracted Claims:
        {claims_text}
        
        Assumptions:
        {assumptions_text}
        """
        
        schema = {
            "type": "object",
            "properties": {
                "position": {"type": "string"},
                "confidence": {"type": "integer"},
                "supporting_claim_ids": {"type": "array", "items": {"type": "integer"}},
                "contradicting_claim_ids": {"type": "array", "items": {"type": "integer"}},
                "assumption_ids": {"type": "array", "items": {"type": "integer"}},
                "key_risks": {"type": "array", "items": {"type": "string"}},
                "missing_information": {"type": "array", "items": {"type": "string"}},
                "questions_to_resolve": {"type": "array", "items": {"type": "string"}},
                "conditions_that_would_change_position": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["position", "confidence", "supporting_claim_ids", "key_risks", "conditions_that_would_change_position"]
        }
        
        # Note: In real live mode, LLMProvider will be modified to return token counts.
        # For now, we simulate returning a token object alongside the response.
        response, tokens = self.llm_provider.generate_structured(system_prompt, user_prompt, schema)
        response["agent_name"] = agent.name
        return response, tokens

    def _run_agent_challenge(self, agent, original_perspective, conflicting_perspective):
        system_prompt = PromptRegistry.get_agent_challenge_prompt(
            agent_name=agent.name,
            original_perspective=json.dumps(original_perspective),
            conflicting_perspective=json.dumps(conflicting_perspective)
        )
        
        schema = {
            "type": "object",
            "properties": {
                "identified_disagreement": {"type": "string"},
                "challenge_to_unsupported_claims": {"type": "string"},
                "revised_position": {"type": "string"},
                "confidence_before": {"type": "integer"},
                "confidence_after": {"type": "integer"},
                "evidence_required_to_resolve": {"type": "string"}
            },
            "required": ["identified_disagreement", "revised_position", "confidence_before", "confidence_after", "evidence_required_to_resolve"]
        }
        
        response, tokens = self.llm_provider.generate_structured(system_prompt, "Review the conflict and respond.", schema)
        return response, tokens
        
    def _synthesize_debate(self, domain_pack, decision, subject, final_agent_input, memory_context):
        system_prompt = PromptRegistry.get_synthesis_prompt(len(memory_context['similar_historical_decisions']))
        
        user_prompt = f"""
        Decision: {decision.title}
        Subject: {subject.name}
        
        Final Agent Perspectives/Challenges:
        {json.dumps(final_agent_input)}
        """
        
        schema = {
            "type": "object",
            "properties": {
                "recommendation": {"type": "string"},
                "recommendation_type": {"type": "string", "enum": ["Investigate", "Hold", "Advance", "Reject", "Restructure"]},
                "model_confidence": {"type": "integer"},
                "supporting_claim_ids": {"type": "array", "items": {"type": "integer"}},
                "contradicting_claim_ids": {"type": "array", "items": {"type": "integer"}},
                "assumption_ids": {"type": "array", "items": {"type": "integer"}},
                "key_risks": {"type": "array", "items": {"type": "string"}},
                "missing_information": {"type": "array", "items": {"type": "string"}},
                "unresolved_disagreements": {"type": "array", "items": {"type": "string"}},
                "conditions_for_reversal": {"type": "array", "items": {"type": "string"}},
                "next_best_action": {"type": "string"},
                "memory_objects_used": {"type": "array", "items": {"type": "integer"}}
            },
            "required": [
                "recommendation", "recommendation_type", "model_confidence", 
                "supporting_claim_ids", "key_risks", "unresolved_disagreements"
            ]
        }
        
        response, tokens = self.llm_provider.generate_structured(system_prompt, user_prompt, schema, model_name=settings.APEX_SYNTHESIS_MODEL)
        return response, tokens
