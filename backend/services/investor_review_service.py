from sqlalchemy.orm import Session
import json
import datetime
import time
from db.models import Decision, Claim, Assumption, EvidenceConflict, EscalationSignal, ReviewRun, ReasoningRun
from services.llm_provider import LLMProvider, BaseLLMProvider

class InvestorReviewService:
    def __init__(self, db: Session, llm_provider: BaseLLMProvider = None):
        self.db = db
        self.llm_provider = llm_provider or LLMProvider()
        
    def generate_review(self, decision_id: int):
        t0 = time.time()
        
        # 1. Read Canonical State
        decision = self.db.query(Decision).filter(Decision.id == decision_id).first()
        if not decision:
            raise ValueError(f"Decision {decision_id} not found")
            
        claims = self.db.query(Claim).filter(Claim.decision_id == decision_id).all()
        assumptions = self.db.query(Assumption).filter(Assumption.decision_id == decision_id).all()
        conflicts = self.db.query(EvidenceConflict).filter(EvidenceConflict.decision_id == decision_id).all()
        signals = self.db.query(EscalationSignal).filter(EscalationSignal.decision_id == decision_id).all()

        # Build context
        claims_text = "\n".join([f"- [ID: {c.id}] {c.statement}" for c in claims]) if claims else "None"
        assumptions_text = "\n".join([f"- [ID: {a.id}] {a.statement} (Status: {a.status})" for a in assumptions]) if assumptions else "None"
        conflicts_text = "\n".join([f"- [ID: {c.id}] Conflict between {c.claim_a_id} and {c.claim_b_id}: {c.resolution_rationale}" for c in conflicts]) if conflicts else "None"
        signals_text = "\n".join([f"- [ID: {s.id}] {s.signal_type} ({s.severity}): {s.reason}" for s in signals]) if signals else "None"
        
        user_prompt = f"""
        Company/Decision: {decision.title}
        
        Canonical Investment Case Data:
        
        CLAIMS (Source of Truth):
        {claims_text}
        
        ASSUMPTIONS:
        {assumptions_text}
        
        EVIDENCE CONFLICTS:
        {conflicts_text}
        
        ESCALATION SIGNALS (Risks):
        {signals_text}
        """
        
        system_prompt = """
        You are simulating a disciplined institutional Investor Review. 
        Your task is to read the canonical investment case data (Claims, Assumptions, Conflicts, Signals) and generate a comprehensive review.
        
        CRITICAL RULES:
        1. DO NOT hallucinate facts. Everything must be derived from the provided Claims, Assumptions, and Conflicts.
        2. DO NOT introduce a theatrical partner debate.
        3. Every major conclusion must reference the underlying data (Use exact Claim IDs and Conflict IDs).
        4. If evidence is insufficient to make a recommendation, set the outcome to "Insufficient Evidence" and explain what information is required. Never fabricate numbers. Never invent traction. Never invent customer validation.
        5. Provide a specific, actionable plan for the founder. Never generate generic advice. Reject recommendations that could apply to every startup.
        """
        
        schema = {
            "type": "object",
            "properties": {
                "memo": {
                    "type": "object",
                    "properties": {
                        "executive_summary": {"type": "string"},
                        "business_overview": {"type": "string"},
                        "market_opportunity": {"type": "string"},
                        "product_assessment": {"type": "string"},
                        "traction": {"type": "string"},
                        "business_model": {"type": "string"},
                        "competition": {"type": "string"},
                        "team": {"type": "string"},
                        "strengths": {"type": "array", "items": {"type": "string"}},
                        "weaknesses": {"type": "array", "items": {"type": "string"}},
                        "key_assumptions": {"type": "array", "items": {"type": "string"}},
                        "evidence_quality": {"type": "string"},
                        "critical_risks": {"type": "array", "items": {"type": "string"}},
                        "open_questions": {"type": "array", "items": {"type": "string"}},
                        "recommendation": {"type": "string"},
                        "next_milestones": {"type": "array", "items": {"type": "string"}}
                    }
                },
                "perspectives": {
                    "type": "object",
                    "properties": {
                        "areas_of_alignment": {"type": "array", "items": {"type": "string"}},
                        "areas_of_concern": {"type": "array", "items": {"type": "string"}},
                        "split_opinions": {"type": "array", "items": {"type": "string"}}
                    }
                },
                "investor_questions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "question": {"type": "string"},
                            "importance": {"type": "string", "enum": ["High", "Medium", "Low"]},
                            "why_ask": {"type": "string"},
                            "existing_evidence": {"type": "string"},
                            "missing_evidence": {"type": "string"},
                            "how_to_prepare": {"type": "string"}
                        }
                    }
                },
                "decision": {
                    "type": "object",
                    "properties": {
                        "outcome": {"type": "string", "enum": ["Strong Meeting", "Meeting Recommended", "Needs More Validation", "Insufficient Evidence", "Pass"]},
                        "rationale": {"type": "string"}
                    }
                },
                "action_plan": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "problem": {"type": "string"},
                            "why_investors_care": {"type": "string"},
                            "supporting_evidence_ids": {"type": "array", "items": {"type": "integer"}},
                            "contradictory_evidence_ids": {"type": "array", "items": {"type": "integer"}},
                            "missing_evidence": {"type": "string"},
                            "what_needs_to_change": {"type": "string"},
                            "suggested_approaches": {"type": "array", "items": {"type": "string"}},
                            "priority": {"type": "string", "enum": ["P0", "P1", "P2"]},
                            "difficulty": {"type": "string", "enum": ["Low", "Medium", "High"]},
                            "expected_fundraising_impact": {"type": "string"},
                            "verification_criteria": {"type": "string"},
                            "definition_of_done": {"type": "string"},
                            "success_criteria": {"type": "string"}
                        },
                        "required": ["problem", "why_investors_care", "what_needs_to_change", "suggested_approaches", "priority", "difficulty", "expected_fundraising_impact", "verification_criteria", "definition_of_done", "success_criteria"]
                    }
                }
            },
            "required": ["memo", "perspectives", "investor_questions", "decision", "action_plan"]
        }
        
        # 2. Run LLM
        response, token_info = self.llm_provider.generate_structured(system_prompt, user_prompt, schema)
        
        # Phase 2: Compute Deterministic Readiness Index
        from services.confidence_service import ReadinessService
        from db.models import ProvenanceType
        
        evidence_count = len(claims)
        hard_evidence_count = len([c for c in claims if c.provenance_type == ProvenanceType.HARD_EVIDENCE.value])
        unresolved_contradictions_count = len([c for c in conflicts if c.status != "RESOLVED"])
        resolved_assumptions_count = len([a for a in assumptions if a.status == "Verified"])
        
        # Count missing evidence from the LLM output's action plan
        action_plan = response.get("action_plan", [])
        missing_info_count = sum(1 for action in action_plan if action.get("missing_evidence"))
        
        readiness_data = ReadinessService.calculate_readiness(
            evidence_count=evidence_count,
            hard_evidence_count=hard_evidence_count,
            unresolved_contradictions_count=unresolved_contradictions_count,
            missing_information_count=missing_info_count,
            staleness_penalty_count=0,
            resolved_assumptions_count=resolved_assumptions_count
        )
        
        # Attach readiness data
        response["decision"]["readiness"] = readiness_data
        
        duration_ms = int((time.time() - t0) * 1000)
        
        # 3. Log Metadata and Cache response
        from services.graph_service import GraphService, EphemeralLanguageCache
        current_hash = GraphService.compute_canonical_graph_hash(self.db, decision_id)
        
        # Save graph hash to token_usage_json to track which graph this run evaluated
        if token_info:
            token_info["canonical_graph_hash"] = current_hash
        else:
            token_info = {"canonical_graph_hash": current_hash}
            
        run = ReviewRun(
            decision_id=decision_id,
            status="Completed",
            duration_ms=duration_ms,
            token_usage_json=json.dumps(token_info),
            completed_at=datetime.datetime.utcnow()
        )
        self.db.add(run)
        
        # Cache the ephemeral language
        EphemeralLanguageCache.set_cache(decision_id, current_hash, "investor_review", response)
        
        # Also log a domain event for the timeline
        from db.models import DomainEvent, ActionItem
        event = DomainEvent(
            decision_id=decision_id,
            event_type="InvestorReviewExecuted",
            entity_type="ReviewRun",
            actor="System",
            metadata_json=json.dumps({"outcome": response.get("decision", {}).get("outcome")})
        )
        self.db.add(event)
        
        # 4. Persist Execution Tickets (ActionItems)
        # Clear existing uncompleted ones to avoid duplicates or update them
        self.db.query(ActionItem).filter_by(decision_id=decision_id, status="TODO").delete()
        
        for action in action_plan:
            new_item = ActionItem(
                decision_id=decision_id,
                title=action.get("what_needs_to_change", "Action Required")[:255],
                priority="High" if action.get("priority") in ["P0", "P1"] else "Medium",
                status="TODO",
                problem=action.get("problem"),
                why_investors_care=action.get("why_investors_care"),
                missing_evidence=action.get("missing_evidence"),
                definition_of_done=action.get("definition_of_done"),
                estimated_effort=action.get("difficulty"),
                expected_impact=action.get("expected_fundraising_impact"),
                verification_criteria=action.get("verification_criteria")
            )
            self.db.add(new_item)

        self.db.commit()
        
        return response
