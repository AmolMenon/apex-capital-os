import json
from sqlalchemy.orm import Session
from db.models import Decision, DomainEvent, ReviewRun, Claim, Assumption, EvidenceConflict
import datetime

class FundraisingMemoryService:
    def __init__(self, db: Session):
        self.db = db

    def get_timeline(self, decision_id: int):
        events = self.db.query(DomainEvent).filter(
            DomainEvent.decision_id == decision_id
        ).order_by(DomainEvent.created_at.asc()).all()
        
        return [
            {
                "id": e.id,
                "event_type": e.event_type,
                "entity_type": e.entity_type,
                "entity_id": e.entity_id,
                "created_at": e.created_at.isoformat(),
                "actor": e.actor,
                "metadata": json.loads(e.metadata_json) if e.metadata_json else {}
            } for e in events
        ]

    def calculate_momentum(self, decision_id: int):
        """
        Momentum is calculated deterministically based on events over the last 30 days.
        Inputs: resolved conflicts, unresolved assumptions, new evidence, etc.
        """
        thirty_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=30)
        recent_events = self.db.query(DomainEvent).filter(
            DomainEvent.decision_id == decision_id,
            DomainEvent.created_at >= thirty_days_ago
        ).all()
        
        score = 0
        for e in recent_events:
            if e.event_type == "ConflictResolved":
                score += 2
            elif e.event_type == "EvidenceUploaded":
                score += 1
            elif e.event_type == "InvestorReviewExecuted":
                score += 1
            elif e.event_type == "DocumentMarkedStale":
                score -= 1
            elif e.event_type == "ConflictLogged":
                score -= 2
                
        if score > 3:
            return "Strong Positive Momentum"
        elif score > 0:
            return "Improving"
        elif score == 0:
            return "Stable"
        else:
            return "Regressing"

    def get_review_diff(self, review_a_id: int, review_b_id: int):
        """
        Reconstructs the Investment Case at A and B and calculates deterministic diff.
        """
        run_a = self.db.query(ReviewRun).filter(ReviewRun.id == review_a_id).first()
        run_b = self.db.query(ReviewRun).filter(ReviewRun.id == review_b_id).first()
        
        if not run_a or not run_b:
            raise ValueError("ReviewRun not found")
            
        time_a = run_a.created_at
        time_b = run_b.created_at
        
        def reconstruct_case(timestamp):
            claims = self.db.query(Claim).filter(
                Claim.decision_id == run_a.decision_id,
                Claim.created_at <= timestamp
            ).count()
            
            assumptions = self.db.query(Assumption).filter(
                Assumption.decision_id == run_a.decision_id,
                Assumption.created_at <= timestamp
            ).count()
            
            conflicts = self.db.query(EvidenceConflict).filter(
                EvidenceConflict.decision_id == run_a.decision_id,
                EvidenceConflict.created_at <= timestamp
            ).count()
            
            resolved_conflicts = self.db.query(EvidenceConflict).filter(
                EvidenceConflict.decision_id == run_a.decision_id,
                EvidenceConflict.created_at <= timestamp,
                EvidenceConflict.resolution_rationale != None
            ).count()
            
            return {
                "total_claims": claims,
                "total_assumptions": assumptions,
                "active_conflicts": conflicts - resolved_conflicts,
                "resolved_conflicts": resolved_conflicts
            }
            
        state_a = reconstruct_case(time_a)
        state_b = reconstruct_case(time_b)
        
        return {
            "state_a": state_a,
            "state_b": state_b,
            "diff": {
                "new_claims": state_b["total_claims"] - state_a["total_claims"],
                "new_assumptions": state_b["total_assumptions"] - state_a["total_assumptions"],
                "newly_resolved_conflicts": state_b["resolved_conflicts"] - state_a["resolved_conflicts"],
                "net_active_conflicts_change": state_b["active_conflicts"] - state_a["active_conflicts"]
            }
        }
