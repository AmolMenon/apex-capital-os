from sqlalchemy.orm import Session
from db.models import Decision, Recommendation, DecisionIntegrityEnvelope, Assumption, EvidenceConflict, ChallengeTask, ChallengeFinding, AssumptionClaimLink
import json

class InvestmentCaseReadService:
    @staticmethod
    def get_investment_case(db: Session, decision_id: int) -> dict:
        decision = db.query(Decision).filter(Decision.id == decision_id).first()
        if not decision:
            return None
            
        # Recommendation
        rec = db.query(Recommendation).filter(Recommendation.decision_id == decision_id).order_by(Recommendation.created_at.desc()).first()
        
        # Integrity Envelope
        env = db.query(DecisionIntegrityEnvelope).filter(DecisionIntegrityEnvelope.decision_id == decision_id).order_by(DecisionIntegrityEnvelope.id.desc()).first()
        
        # Assumptions & Claims
        assumptions = db.query(Assumption).filter(Assumption.decision_id == decision_id).all()
        assumption_ids = [a.id for a in assumptions]
        claim_links = db.query(AssumptionClaimLink).filter(AssumptionClaimLink.assumption_id.in_(assumption_ids)).all()
        
        # Group assumptions deterministically
        categories = {
            "Market": [], "Product": [], "Team": [], "Traction": [], "Financial": [], "Execution": [], "Other": []
        }
        for a in assumptions:
            cat = a.category if a.category in categories else "Other"
            categories[cat].append({
                "id": a.id,
                "statement": a.statement,
                "status": a.status,
                "claims": [{"claim_id": l.claim_id, "relationship": l.relationship} for l in claim_links if l.assumption_id == a.id]
            })
            
        # Strip empty categories
        grouped_assumptions = {k: v for k, v in categories.items() if v}
        
        # Conflicts
        conflicts = db.query(EvidenceConflict).filter(EvidenceConflict.decision_id == decision_id).all()
        
        # Diligence (Tasks & Findings)
        tasks = db.query(ChallengeTask).filter(ChallengeTask.decision_id == decision_id).all()
        findings = db.query(ChallengeFinding).filter(ChallengeFinding.decision_id == decision_id).all()
        
        return {
            "decision": {
                "id": decision.id,
                "title": decision.title,
                "status": decision.status
            },
            "analytical_recommendation": {
                "value": rec.recommendation_value if rec else None,
                "status": rec.status if rec else None,
            } if rec else None,
            "decision_integrity": {
                "status": env.integrity_status if env else None,
                "blocking_conditions": json.loads(env.blocking_conditions_json) if env and env.blocking_conditions_json else []
            } if env else None,
            "human_decision": {
                "value": "TBD" # Provided elsewhere if HumanDecisionRecord exists
            },
            "investment_case_assumptions": grouped_assumptions,
            "conflicts": [{
                "id": c.id,
                "claim_a_id": c.claim_a_id,
                "claim_b_id": c.claim_b_id,
                "status": c.status,
                "origin": c.origin
            } for c in conflicts],
            "diligence": {
                "tasks": [{"id": t.id, "target_type": t.target_type, "target_id": t.target_id, "status": t.status} for t in tasks],
                "findings": [{"id": f.id, "task_id": f.challenge_task_id, "resolution_effect": f.resolution_effect, "assumption_effect": f.assumption_effect} for f in findings]
            }
        }
