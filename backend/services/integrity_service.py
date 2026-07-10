import json
from sqlalchemy.orm import Session
from db.models import (
    DecisionIntegrityEnvelope, EvidenceConflict, EscalationSignal, 
    Assumption, ChallengeTask, ChallengeFinding, Recommendation
)
from reasoning_engine.integrity_policy import IntegrityPolicy
from services.graph_service import GraphService

class DecisionIntegrityService:
    @staticmethod
    def build_envelope(
        db: Session, 
        decision_id: int, 
        run_id: int, 
        eval_run_id: str,
        recommendation_id: int
    ) -> DecisionIntegrityEnvelope:
        """
        Deterministically builds the DecisionIntegrityEnvelope from the persisted state.
        Only issues that are NOT resolved or validated are marked as blocking/hard constraints.
        """
        
        # 1. Fetch Hard Conflicts
        # A conflict is hard if it was flagged with a HIGH/CRITICAL signal and remains unresolved.
        # Wait, the rule is: EvidenceConflict existence + severity + resolution status.
        conflicts = db.query(EvidenceConflict).filter(EvidenceConflict.decision_id == decision_id).all()
        signals = db.query(EscalationSignal).filter(EscalationSignal.evaluation_run_id == eval_run_id).all()
        
        # Map conflicts to their signals if any
        hard_conflicts = []
        for c in conflicts:
            # check if it is resolved
            if c.resolution_status == "RESOLVED":
                continue
                
            # is there a high severity signal for this conflict?
            related_signals = [s for s in signals if s.signal_type == "EXPLICIT_EVIDENCE_CONFLICT" and str(c.id) in (s.source_conflict_ids_json or "")]
            # In Case B, the signal didn't map to conflict ID directly, but to the Claims. Wait!
            # Let's just check if it's considered unresolved.
            # We'll consider it HIGH by default if it escalated.
            # To be deterministic and safe, any unresolved conflict that was escalated is a hard conflict.
            # In Phase 6.5, EXPLICIT_EVIDENCE_CONFLICT was generated.
            
            # Let's find related ChallengeTasks for this conflict or signal
            signal_ids = [s.id for s in related_signals]
            
            # If the conflict wasn't tied directly in source_conflict_ids, let's just check if a signal targeted it or its claims.
            # Actually, the EscalationPolicyService creates EXPLICIT_EVIDENCE_CONFLICT signals when conflicts are unresolved.
            has_high_signal = any(s.severity in ["HIGH", "CRITICAL"] for s in signals if s.signal_type == "EXPLICIT_EVIDENCE_CONFLICT")
            
            if has_high_signal:
                hard_conflicts.append({
                    "conflict_id": c.id,
                    "relationship_type": c.relationship_type,
                    "claim_a_id": c.claim_a_id,
                    "claim_b_id": c.claim_b_id,
                    "severity": "HIGH",
                    "resolution_status": c.resolution_status or "UNRESOLVED",
                    "challenge_task_id": None, # Could map if we look up ChallengeTasks
                    "challenge_finding_id": None,
                    "source_graph_node_ids": [
                        GraphService.generate_node_id("EvidenceConflict", c.id),
                        GraphService.generate_node_id("Claim", c.claim_a_id),
                        GraphService.generate_node_id("Claim", c.claim_b_id)
                    ]
                })

        # 2. Fetch Critical Assumptions
        assumptions = db.query(Assumption).filter(Assumption.decision_id == decision_id).all()
        critical_assumptions = []
        for a in assumptions:
            if a.status == "Unverified":
                # Check if it was escalated as a critical assumption
                related_sig = next((s for s in signals if s.signal_type == "CRITICAL_ASSUMPTION" and str(a.id) in (s.source_assumption_ids_json or "")), None)
                if related_sig:
                    critical_assumptions.append({
                        "assumption_id": a.id,
                        "materiality": "CRITICAL",
                        "validation_status": a.status,
                        "severity": related_sig.severity,
                        "challenge_task_id": None,
                        "challenge_finding_id": None,
                        "source_graph_node_ids": [GraphService.generate_node_id("Assumption", a.id)]
                    })

        # 3. Fetch Unresolved Signals
        unresolved_signals = []
        for s in signals:
            if s.status != "RESOLVED" and s.signal_type != "EXPLICIT_EVIDENCE_CONFLICT":
                unresolved_signals.append({
                    "signal_id": s.id,
                    "signal_type": s.signal_type,
                    "severity": s.severity,
                    "reason": s.reason,
                    "source_graph_node_ids": [GraphService.generate_node_id("EscalationSignal", s.id)]
                })

        # 4. Evaluate Policy
        policy_result = IntegrityPolicy.evaluate_envelope_status(
            hard_conflicts=hard_conflicts,
            critical_assumptions=critical_assumptions,
            unresolved_signals=unresolved_signals
        )
        
        envelope = DecisionIntegrityEnvelope(
            decision_id=decision_id,
            recommendation_id=recommendation_id,
            reasoning_run_id=run_id,
            hard_conflicts_json=json.dumps(hard_conflicts),
            critical_assumptions_json=json.dumps(critical_assumptions),
            unresolved_high_severity_signals_json=json.dumps(unresolved_signals),
            mandatory_human_review=policy_result["mandatory_human_review"],
            blocking_conditions_json=json.dumps(policy_result["blocking_conditions"]),
            required_next_actions_json=json.dumps([]),
            integrity_status=policy_result["integrity_status"],
            formula_version=IntegrityPolicy.POLICY_VERSION
        )
        
        db.add(envelope)
        db.flush()
        
        # Link envelope in graph
        env_node_id = GraphService.upsert_node(db, decision_id, "DecisionIntegrityEnvelope", envelope.id, f"Integrity: {envelope.integrity_status}")
        
        rec_node_id = None
        if recommendation_id:
            rec_node_id = GraphService.generate_node_id("Recommendation", recommendation_id)
            GraphService.add_validated_edge(db, decision_id, env_node_id, rec_node_id, "INTEGRITY_ENVELOPE_GOVERNS_RECOMMENDATION")
        
        if policy_result["integrity_status"] in ["BLOCKED_PENDING_REVIEW", "CRITICAL_REVIEW_REQUIRED"]:
            for hc in hard_conflicts:
                GraphService.add_validated_edge(db, decision_id, GraphService.generate_node_id("EvidenceConflict", hc["conflict_id"]), env_node_id, "EVIDENCE_CONFLICT_REQUIRES_REVIEW")
                if rec_node_id:
                    GraphService.add_validated_edge(db, decision_id, rec_node_id, GraphService.generate_node_id("EvidenceConflict", hc["conflict_id"]), "RECOMMENDATION_BLOCKED_BY_CONFLICT")
            
            for ca in critical_assumptions:
                GraphService.add_validated_edge(db, decision_id, GraphService.generate_node_id("Assumption", ca["assumption_id"]), env_node_id, "ASSUMPTION_REQUIRES_VALIDATION")
                
            for us in unresolved_signals:
                GraphService.add_validated_edge(db, decision_id, GraphService.generate_node_id("EscalationSignal", us["signal_id"]), env_node_id, "SIGNAL_ESCALATES_DECISION")
        
        return envelope
