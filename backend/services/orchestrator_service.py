import json
from sqlalchemy.orm import Session
from db.models import (
    Assumption, EvidenceConflict, ChallengeTask, ChallengeFinding, 
    EscalationSignal, AssumptionClaimLink, Claim, Recommendation, ReasoningRun
)
from services.integrity_service import DecisionIntegrityService

class InvestmentCaseOrchestrator:
    @staticmethod
    def apply_finding(db: Session, finding_id: int):
        finding = db.query(ChallengeFinding).filter(ChallengeFinding.id == finding_id).first()
        if not finding:
            return
            
        task = db.query(ChallengeTask).filter(ChallengeTask.id == finding.challenge_task_id).first()
        if not task:
            return

        # 1. Update Affected Conflict (if any)
        if task.target_type == "EvidenceConflict":
            conflict = db.query(EvidenceConflict).filter(EvidenceConflict.id == int(task.target_id)).first()
            if conflict:
                InvestmentCaseOrchestrator.recompute_conflict_state(db, conflict.id)
                
        # 2. Update Affected Assumption (if any)
        assumption_id = None
        if task.target_type == "Assumption":
            assumption_id = int(task.target_id)
        elif task.target_type == "EvidenceConflict" or task.escalation_signal_id:
            signal = db.query(EscalationSignal).filter(EscalationSignal.id == task.escalation_signal_id).first()
            if signal and signal.assumption_id:
                assumption_id = signal.assumption_id
                
        if assumption_id:
            InvestmentCaseOrchestrator.recompute_assumption_state(db, assumption_id)
            
        # 3. Recompute Integrity Envelope
        rec = db.query(Recommendation).filter(Recommendation.decision_id == task.decision_id).order_by(Recommendation.created_at.desc()).first()
        run = db.query(ReasoningRun).filter(ReasoningRun.decision_id == task.decision_id).order_by(ReasoningRun.start_time.desc()).first()
        
        DecisionIntegrityService.build_envelope(
            db=db,
            decision_id=task.decision_id,
            run_id=run.id if run else None,
            eval_run_id=run.evaluation_run_id if run else "manual",
            recommendation_id=rec.id if rec else None
        )

    @staticmethod
    def recompute_conflict_state(db: Session, conflict_id: int):
        conflict = db.query(EvidenceConflict).filter(EvidenceConflict.id == conflict_id).first()
        if not conflict:
            return
            
        tasks = db.query(ChallengeTask).filter(ChallengeTask.target_type == "EvidenceConflict", ChallengeTask.target_id == str(conflict.id)).all()
        # Also include tasks where target_id was stored as string but maybe not matched directly if cast needed
        # We know conflict_id matches.
        # But we'll just parse target_id out in python to be safe.
        all_conflict_tasks = db.query(ChallengeTask).filter(ChallengeTask.target_type == "EvidenceConflict").all()
        task_ids = [t.id for t in all_conflict_tasks if str(t.target_id) == str(conflict.id)]
        findings = db.query(ChallengeFinding).filter(ChallengeFinding.challenge_task_id.in_(task_ids)).order_by(ChallengeFinding.created_at.desc()).all()
        
        if not findings:
            conflict.status = "OPEN"
            conflict.resolution_status = "UNRESOLVED"
            db.commit()
            return
            
        latest = findings[0]
        effect = latest.resolution_effect
        
        if effect in ["SUPPORTS_CLAIM_A", "SUPPORTS_CLAIM_B", "RECONCILES_BOTH"]:
            conflict.status = "RESOLVED"
            conflict.resolution_status = "RESOLVED"
        elif effect == "CONFLICT_REMAINS":
            conflict.status = "CONFIRMED_CONTRADICTION"
            conflict.resolution_status = "UNRESOLVED"
        else: # INSUFFICIENT_EVIDENCE
            conflict.status = "OPEN"
            conflict.resolution_status = "UNRESOLVED"
            
        db.commit()

    @staticmethod
    def recompute_assumption_state(db: Session, assumption_id: int):
        assumption = db.query(Assumption).filter(Assumption.id == assumption_id).first()
        if not assumption:
            return
            
        links = db.query(AssumptionClaimLink).filter(AssumptionClaimLink.assumption_id == assumption_id).all()
        supports = sum(1 for l in links if l.relationship == "SUPPORTS")
        contradicts = sum(1 for l in links if l.relationship == "CONTRADICTS")
        
        claim_ids = [l.claim_id for l in links]
        conflicts = db.query(EvidenceConflict).filter(
            (EvidenceConflict.claim_a_id.in_(claim_ids)) | (EvidenceConflict.claim_b_id.in_(claim_ids))
        ).all()
        unresolved_conflicts = sum(1 for c in conflicts if c.status != "RESOLVED")
        
        all_assump_tasks = db.query(ChallengeTask).filter(ChallengeTask.target_type == "Assumption").all()
        task_ids = [t.id for t in all_assump_tasks if str(t.target_id) == str(assumption.id)]
        
        signals = db.query(EscalationSignal).filter(EscalationSignal.assumption_id == assumption.id).all()
        signal_ids = [s.id for s in signals]
        signal_tasks = db.query(ChallengeTask).filter(ChallengeTask.escalation_signal_id.in_(signal_ids)).all()
        task_ids.extend([t.id for t in signal_tasks])
        findings = db.query(ChallengeFinding).filter(ChallengeFinding.challenge_task_id.in_(task_ids)).order_by(ChallengeFinding.created_at.desc()).all()
        
        status = "Unverified"
        
        if findings:
            latest_finding = findings[0]
            effect = latest_finding.assumption_effect
            if effect == "SUPPORTS":
                status = "Verified"
            elif effect == "WEAKENS":
                status = "Unverified"
            elif effect == "INVALIDATES":
                status = "Invalidated"
            else:
                if contradicts > 0 or unresolved_conflicts > 0:
                    status = "Unverified"
                elif supports > 0:
                    status = "Verified"
        else:
            if contradicts > 0 or unresolved_conflicts > 0:
                status = "Unverified"
            elif supports > 0:
                status = "Verified"
                
        assumption.status = status
        db.commit()

    @staticmethod
    def log_conflict(db: Session, decision_id: int, claim_a_id: int, claim_b_id: int, origin: str = "ANALYST_LOGGED"):
        conflict = EvidenceConflict(
            decision_id=decision_id,
            claim_a_id=claim_a_id,
            claim_b_id=claim_b_id,
            relationship_type="CONTRADICTION",
            status="OPEN",
            origin=origin,
            resolution_status="UNRESOLVED"
        )
        db.add(conflict)
        db.commit()
        db.refresh(conflict)
        return conflict
