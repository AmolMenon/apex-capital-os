import json
from db.models import Claim, Assumption, EvidenceConflict, EscalationSignal
from sqlalchemy.orm import Session

class EscalationPolicyService:
    @staticmethod
    def evaluate_decision_state(db: Session, decision_id: int, evaluation_run_id: str, single_perspective: dict, evidence_conflicts: list, domain_pack_name: str = "") -> str:
        """
        Evaluates the evidence and the baseline Single perspective to determine the escalation path.
        Returns one of: NO_ESCALATION, TARGETED_CHALLENGE, HUMAN_REVIEW_REQUIRED, FULL_DELIBERATION_OPTIONAL
        And persists `EscalationSignal` objects in the database.
        """
        signals = []
        
        # Domain Specific Escalation Triggers
        if domain_pack_name == "Venture Capital":
            # Example: Unclear cap table or governance issue
            risks = single_perspective.get("key_risks", [])
            if any("governance" in r.lower() or "integrity" in r.lower() for r in risks):
                signals.append(EscalationSignal(
                    decision_id=decision_id, evaluation_run_id=evaluation_run_id,
                    signal_type="GOVERNANCE_OR_INTEGRITY_RISK", severity="HIGH",
                    reason="Founder integrity or governance concern detected.",
                    recommended_challenge_type="GOVERNANCE_CHALLENGE", priority="HIGH"
                ))
        elif domain_pack_name == "Corporate Strategy":
            risks = single_perspective.get("key_risks", [])
            if any("cannibalization" in r.lower() for r in risks):
                signals.append(EscalationSignal(
                    decision_id=decision_id, evaluation_run_id=evaluation_run_id,
                    signal_type="HIGH_DOWNSIDE_ASYMMETRY", severity="HIGH",
                    reason="Cannibalization risk detected in strategy.",
                    recommended_challenge_type="DOWNSIDE_CASE", priority="HIGH"
                ))
        elif domain_pack_name == "Operations":
            risks = single_perspective.get("key_risks", [])
            if any("safety" in r.lower() or "single-point" in r.lower() for r in risks):
                signals.append(EscalationSignal(
                    decision_id=decision_id, evaluation_run_id=evaluation_run_id,
                    signal_type="HIGH_DOWNSIDE_ASYMMETRY", severity="HIGH",
                    reason="Safety or single-point failure risk detected.",
                    recommended_challenge_type="DOWNSIDE_CASE", priority="HIGH"
                ))
        
        # Rule 1: High severity evidence conflicts
        for conflict in evidence_conflicts:
            if conflict.resolution_status != "Resolved":
                sig = EscalationSignal(
                    decision_id=decision_id,
                    evaluation_run_id=evaluation_run_id,
                    signal_type="EXPLICIT_EVIDENCE_CONFLICT",
                    severity="HIGH",
                    source_conflict_ids_json=json.dumps([conflict.id]),
                    evidence_conflict_id=conflict.id,
                    reason=f"Unresolved evidence conflict: {conflict.relationship_type}",
                    recommended_challenge_type="CONTRADICTION_RESOLUTION",
                    priority="HIGH"
                )
                signals.append(sig)

        # Rule 2: Low confidence in single pass
        confidence = single_perspective.get("confidence", 100)
        if confidence < 70:
            sig = EscalationSignal(
                decision_id=decision_id,
                evaluation_run_id=evaluation_run_id,
                signal_type="LOW_CONFIDENCE",
                severity="MEDIUM",
                reason=f"Model confidence is low ({confidence}%) in the initial baseline pass.",
                recommended_challenge_type="MISSING_EVIDENCE_TEST",
                priority="MEDIUM"
            )
            signals.append(sig)

        # Rule 3: Missing critical information
        missing_info = single_perspective.get("missing_information", [])
        for info in missing_info:
            sig = EscalationSignal(
                decision_id=decision_id,
                evaluation_run_id=evaluation_run_id,
                signal_type="MISSING_CRITICAL_INFORMATION",
                severity="HIGH",
                reason=f"Critical information missing: {info}",
                recommended_challenge_type="HUMAN_REVIEW_REQUIRED", # Wait, human review is an escalation category, but we'll use MISSING_EVIDENCE_TEST or FLAG
                priority="HIGH"
            )
            signals.append(sig)
            
        # Rule 4: Critical Assumptions
        assumptions = single_perspective.get("assumption_ids", [])
        for asm_id in assumptions:
            sig = EscalationSignal(
                decision_id=decision_id,
                evaluation_run_id=evaluation_run_id,
                signal_type="CRITICAL_ASSUMPTION",
                severity="MEDIUM",
                source_assumption_ids_json=json.dumps([asm_id]),
                assumption_id=asm_id,
                reason=f"Material recommendation depends on unverified critical assumption ID: {asm_id}.",
                recommended_challenge_type="ASSUMPTION_STRESS_TEST",
                priority="MEDIUM"
            )
            signals.append(sig)

        # Persist signals
        for s in signals:
            db.add(s)
        db.commit()

        # Determine highest escalation
        if any(s.recommended_challenge_type == "HUMAN_REVIEW_REQUIRED" for s in signals):
            # We still want to do targeted challenges if there are other triggers
            if any(s.recommended_challenge_type != "HUMAN_REVIEW_REQUIRED" for s in signals):
                return "TARGETED_CHALLENGE_AND_HUMAN_REVIEW"
            return "HUMAN_REVIEW_REQUIRED"
        
        if len(signals) > 0:
            return "TARGETED_CHALLENGE"
            
        return "NO_ESCALATION"
