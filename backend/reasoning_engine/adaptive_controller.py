import json
import time
import datetime
from sqlalchemy.orm import Session
import database.crud as crud
from core.config import settings
from db.models import ReasoningRun, EvidenceConflict, Claim, Assumption, ChallengeTask, EscalationSignal
from reasoning_engine.engine import UniversalReasoningEngine
from reasoning_engine.challenge_engine import TargetedChallengeEngine
from services.escalation_policy_service import EscalationPolicyService
from services.llm_provider import LLMProvider, BaseLLMProvider
from services.telemetry_service import TelemetryService
from reasoning_engine.prompts import PromptRegistry
from services.graph_service import GraphService
from db.models import ChallengeFinding, Recommendation

class SynthesisSchemaValidator:
    @staticmethod
    def validate(synthesis_dict: dict):
        required_fields = ["recommendation", "unresolved_conflicts", "challenge_findings"]
        for f in required_fields:
            if f not in synthesis_dict:
                raise ValueError(f"SYNTHESIS_SCHEMA_FAILURE: Missing required field '{f}'")
                
        # Confidence bound check
        if "recommendation_confidence" in synthesis_dict:
            conf = synthesis_dict["recommendation_confidence"]
            if not isinstance(conf, int) or conf < 0 or conf > 100:
                raise ValueError("SYNTHESIS_SCHEMA_FAILURE: Invalid confidence value.")


class AdaptiveReasoningController:
    def __init__(self, db: Session, llm_provider: BaseLLMProvider = None):
        self.db = db
        import os
        if os.environ.get("MOCK_LLM_PROVIDER") == "1":
            from services.llm_provider import DeterministicTestProvider
            self.llm_provider = DeterministicTestProvider()
        else:
            self.llm_provider = llm_provider or LLMProvider()
        self.engine = UniversalReasoningEngine(db, llm_provider=self.llm_provider)

    def evaluate_decision_adaptive(self, decision_id: int):
        decision = crud.get_decision(self.db, decision_id)
        domain_pack = crud.get_domain_pack(self.db, decision.domain_pack_id)
        subject = decision.subject

        # Create or fetch run
        run = ReasoningRun(
            decision_id=decision.id,
            execution_mode=settings.APEX_LLM_MODE,
            provider=settings.APEX_REASONING_PROVIDER,
            model=settings.APEX_REASONING_MODEL,
            execution_topology="adaptive",
            status="Running"
        )
        self.db.add(run)
        self.db.commit()

        run_id = run.evaluation_run_id or f"run_{run.id}"
        run.evaluation_run_id = run_id
        
        latency_tracker = {}
        token_tracker = {"input": 0, "output": 0}
        intermediate_state = {}

        def _track_cost(tokens, stage):
            token_tracker["input"] += tokens["input"]
            token_tracker["output"] += tokens["output"]
            run.token_usage_json = json.dumps(token_tracker)
            decision.input_tokens = token_tracker["input"]
            decision.output_tokens = token_tracker["output"]
            if stage == "single":
                decision.base_analysis_calls += 1
            elif stage == "challenge":
                decision.challenge_calls += 1
            elif stage == "synthesis":
                decision.synthesis_calls += 1
            self.db.commit()

        # 1. Base Analysis (Single Pass)
        claims = self.db.query(Claim).filter_by(decision_id=decision.id).all()
        assumptions = self.db.query(Assumption).filter_by(decision_id=decision.id).all()
        conflicts = self.db.query(EvidenceConflict).filter_by(decision_id=decision.id).all()
        
        agents = crud.get_reasoning_agents(self.db, domain_pack.id)
        base_agent = agents[0] if agents else None

        t0 = time.time()
        # Mock memory context
        memory_context = {"similar_historical_decisions": [], "known_blind_spots": []}
        
        perspective, tokens = self.engine._run_agent_perspective(base_agent, decision, subject, claims, assumptions, memory_context)
        _track_cost(tokens, "single")
        latency_tracker["single"] = int((time.time() - t0) * 1000)
        
        intermediate_state["base_perspective"] = perspective

        GraphService.ensure_decision_graph_objects(self.db, decision.id)

        # 2. Escalation Signal Detection
        escalation_level = EscalationPolicyService.evaluate_decision_state(
            self.db, decision.id, run_id, perspective, conflicts
        )
        decision.escalation_reason = escalation_level
        self.db.commit()

        # 3. Targeted Challenge
        challenge_findings_list = []
        if escalation_level in ["TARGETED_CHALLENGE", "TARGETED_CHALLENGE_AND_HUMAN_REVIEW"]:
            signals = self.db.query(EscalationSignal).filter_by(evaluation_run_id=run_id).all()
            for sig in signals:
                if sig.recommended_challenge_type == "HUMAN_REVIEW_REQUIRED":
                    continue
                # Create task
                task = ChallengeTask(
                    decision_id=decision.id,
                    evaluation_run_id=run_id,
                    target_type=sig.signal_type,
                    target_id=str(sig.id),
                    challenge_question=f"Evaluate this signal: {sig.reason}",
                    why_material="Material because it triggered an escalation rule.",
                    challenge_mode=sig.recommended_challenge_type
                )
                self.db.add(task)
                self.db.flush()
                
                GraphService.link_escalation_to_challenge(self.db, decision.id, sig, task)
                
                t_chal = time.time()
                relevant_context = {"conflicts": [c.id for c in conflicts]} # Stub
                findings, c_tokens = TargetedChallengeEngine.execute_challenge(self.db, task, perspective, relevant_context, llm_provider=self.llm_provider)
                _track_cost(c_tokens, "challenge")
                
                finding_obj = ChallengeFinding(
                    decision_id=decision.id,
                    challenge_task_id=task.id,
                    position_changed=findings.get("position_changed", False) == True,
                    position_before=findings.get("position_before"),
                    position_after=findings.get("position_after"),
                    confidence_before=findings.get("confidence_before"),
                    confidence_after=findings.get("confidence_after"),
                    new_evidence_relationships_json=json.dumps(findings.get("new_evidence_relationships", [])),
                    unresolved_questions=json.dumps(findings.get("unresolved_questions", [])),
                    conditions_for_reversal=json.dumps(findings.get("conditions_for_reversal", [])),
                    recommendation_impact=findings.get("recommendation_impact")
                )
                self.db.add(finding_obj)
                self.db.flush()
                
                GraphService.persist_challenge_finding_chain(self.db, decision.id, task, finding_obj)
                
                parsed_rels = []
                for rel_str in findings.get("new_evidence_relationships", []):
                    parts = rel_str.split(" ")
                    if len(parts) == 3:
                        source_prefix = parts[0].split("_")[0].lower() if "_" in parts[0] else parts[0].lower()
                        source_id_val = parts[0].split("_")[1] if "_" in parts[0] else ""
                        target_prefix = parts[2].split("_")[0].lower() if "_" in parts[2] else parts[2].lower()
                        target_id_val = parts[2].split("_")[1] if "_" in parts[2] else ""
                        
                        if source_id_val and target_id_val:
                            parsed_rels.append({
                                "source_node": f"{source_prefix}:{source_id_val}",
                                "type": parts[1],
                                "target_node": f"{target_prefix}:{target_id_val}"
                            })
                
                GraphService.persist_validated_relationships(self.db, decision.id, parsed_rels)
                self.db.commit()
                
                latency_tracker.setdefault("challenge", 0)
                latency_tracker["challenge"] += int((time.time() - t_chal) * 1000)
                findings["signal_id"] = sig.id
                findings["task_id"] = task.id
                findings["finding_id"] = finding_obj.id
                challenge_findings_list.append(findings)


        intermediate_state["challenge_findings"] = challenge_findings_list

        # 4. Lossless Synthesis
        t_syn = time.time()
        synthesis, s_tokens = self._lossless_synthesis(decision, perspective, challenge_findings_list)
        
        # 5. Synthesis Schema Validator
        try:
            SynthesisSchemaValidator.validate(synthesis)
        except ValueError as e:
            run.status = "Failed"
            run.errors_json = json.dumps({"error": str(e)})
            run.intermediate_state_json = json.dumps(intermediate_state)
            self.db.commit()
            raise e
            
        _track_cost(s_tokens, "synthesis")
        latency_tracker["synthesis"] = int((time.time() - t_syn) * 1000)
        
        # New recommendations start as DRAFT
        rec_obj = Recommendation(
            decision_id=decision.id,
            reasoning_run_id=run.id,
            recommendation_value=synthesis.get("recommendation", ""),
            recommendation_type=synthesis.get("recommendation_type", "Unknown"),
            model_confidence=synthesis.get("recommendation_confidence", 0),
            key_risks_json=json.dumps(synthesis.get("critical_assumptions", [])),
            missing_information_json=json.dumps(synthesis.get("missing_critical_information", [])),
            status="DRAFT"
        )
        self.db.add(rec_obj)
        self.db.flush()
        
        # Upsert recommendation node
        rec_node_id = GraphService.upsert_node(self.db, decision.id, "Recommendation", rec_obj.id, rec_obj.recommendation_value)
        
        for cid in synthesis.get("supporting_claim_ids", []):
            GraphService.add_validated_edge(self.db, decision.id, f"claim:{cid}", rec_node_id, "CLAIM_SUPPORTS_RECOMMENDATION")
            
        for cid in synthesis.get("contradicting_claim_ids", []):
            GraphService.add_validated_edge(self.db, decision.id, f"claim:{cid}", rec_node_id, "CLAIM_SUPPORTS_RECOMMENDATION") # Or some other valid relationship
            
        for aid in synthesis.get("assumption_ids", []):
            GraphService.add_validated_edge(self.db, decision.id, f"assumption:{aid}", rec_node_id, "ASSUMPTION_INVALIDATES_RECOMMENDATION") # Adjust based on valid contracts
        
        # Link findings to recommendation
        db_findings = self.db.query(ChallengeFinding).filter(ChallengeFinding.decision_id == decision.id).all()
        for f_obj in db_findings:
            finding_node_id = GraphService.generate_node_id("ChallengeFinding", f_obj.id)
            GraphService.add_validated_edge(self.db, decision.id, finding_node_id, rec_node_id, "FINDING_AFFECTS_RECOMMENDATION")
        self.db.flush()
        
        # 6. Decision Integrity Envelope
        from services.integrity_service import DecisionIntegrityService
        envelope = DecisionIntegrityService.build_envelope(self.db, decision.id, run.id, run_id, rec_obj.id)
        
        rec_obj.status = "INTEGRITY_EVALUATED"
        self.db.flush()
        
        if envelope.integrity_status == "CRITICAL_REVIEW_REQUIRED":
            rec_obj.status = "CRITICAL_REVIEW_REQUIRED"
        elif envelope.integrity_status == "BLOCKED_PENDING_REVIEW":
            rec_obj.status = "BLOCKED_PENDING_REVIEW"
        else:
            rec_obj.status = "FINALIZED"
            
        self.db.commit()
            
        intermediate_state["synthesis"] = synthesis
        
        run.intermediate_state_json = json.dumps(intermediate_state)
        run.latency_ms_json = json.dumps(latency_tracker)
        decision.latency_ms = sum(latency_tracker.values())
        
        # Build envelope dict for return
        envelope_dict = {
            "hard_conflicts": json.loads(envelope.hard_conflicts_json),
            "critical_assumptions": json.loads(envelope.critical_assumptions_json),
            "unresolved_high_severity_signals": json.loads(envelope.unresolved_high_severity_signals_json),
            "mandatory_human_review": envelope.mandatory_human_review,
            "blocking_conditions": json.loads(envelope.blocking_conditions_json),
            "integrity_status": envelope.integrity_status
        }
        
        run.output_json = json.dumps({
            "synthesis": synthesis,
            "base_perspective": intermediate_state.get("base_perspective"),
            "challenge_findings": intermediate_state.get("challenge_findings", []),
            "escalation_level": escalation_level,
            "recommendation_id": rec_obj.id,
            "integrity_envelope": envelope_dict,
            "review_required": envelope.mandatory_human_review,
            "status": rec_obj.status
        })
        run.status = "Completed"
        run.end_time = datetime.datetime.utcnow()
        self.db.commit()
        
        return run.output_json

    def _lossless_synthesis(self, decision, perspective, challenges):
        system_prompt = "You are a Lossless Synthesis Engine. You must compile the final decision while preserving all unresolved conflicts, minority positions, and challenge findings."
        
        user_prompt = f"""
        DECISION: {decision.title}
        
        BASE PERSPECTIVE:
        {json.dumps(perspective)}
        
        TARGETED CHALLENGE FINDINGS:
        {json.dumps(challenges)}
        """
        
        schema = {
            "type": "object",
            "properties": {
                "recommendation": {"type": "string"},
                "recommendation_confidence": {"type": "integer"},
                "supporting_evidence": {"type": "array", "items": {"type": "string"}},
                "contradicting_evidence": {"type": "array", "items": {"type": "string"}},
                "resolved_conflicts": {"type": "array", "items": {"type": "string"}},
                "unresolved_conflicts": {"type": "array", "items": {"type": "string"}},
                "critical_assumptions": {"type": "array", "items": {"type": "string"}},
                "invalidated_assumptions": {"type": "array", "items": {"type": "string"}},
                "minority_positions": {"type": "array", "items": {"type": "string"}},
                "challenge_findings": {"type": "array", "items": {"type": "string"}},
                "missing_critical_information": {"type": "array", "items": {"type": "string"}},
                "conditions_for_reversal": {"type": "array", "items": {"type": "string"}},
                "next_best_action": {"type": "string"},
                "human_review_requirements": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["recommendation", "unresolved_conflicts", "challenge_findings"]
        }
        
        response, tokens = self.llm_provider.generate_structured(system_prompt, user_prompt, schema, model_name=settings.APEX_SYNTHESIS_MODEL)
        return response, tokens
