import os
import sys

# Ensure backend directory is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from db.database import SessionLocal
from db.models import Decision, Claim, EvidenceConflict, EscalationSignal, ChallengeTask, ChallengeFinding, DecisionIntegrityEnvelope, Recommendation, HumanDecisionRecord, Assumption

def extract():
    db = SessionLocal()
    # Nexus decision is ID 9999
    decision = db.query(Decision).filter_by(id=9999).first()
    if not decision:
        print("Nexus decision not found.")
        return

    print("=== Nexus Integrity Chain ===")
    
    # Claims
    claims = db.query(Claim).filter_by(decision_id=decision.id).all()
    for c in claims:
        print(f"Claim ID {c.id}: {c.statement[:50]}...")
    
    # EvidenceConflicts
    conflicts = db.query(EvidenceConflict).filter_by(decision_id=decision.id).all()
    for conf in conflicts:
        print(f"EvidenceConflict ID {conf.id} -> claims {conf.claim_a_id} vs {conf.claim_b_id}")
    
    # Assumptions
    assumptions = db.query(Assumption).filter_by(decision_id=decision.id).all()
    for a in assumptions:
        print(f"Assumption ID {a.id}: {a.statement[:50]}...")

    # Escalation Signals
    signals = db.query(EscalationSignal).filter_by(decision_id=decision.id).all()
    for s in signals:
        print(f"EscalationSignal ID {s.id} -> conflict_id: {s.evidence_conflict_id}, assumption_id: {s.assumption_id}")
        
    # Challenge Tasks
    tasks = db.query(ChallengeTask).filter_by(decision_id=decision.id).all()
    for t in tasks:
        print(f"ChallengeTask ID {t.id} -> signal_id: {t.escalation_signal_id}")
        
    # Challenge Findings
    findings = db.query(ChallengeFinding).filter(ChallengeFinding.challenge_task_id.in_([t.id for t in tasks])).all()
    for f in findings:
        print(f"ChallengeFinding ID {f.id} -> challenge_task_id: {f.challenge_task_id}")
        
    # Recommendations
    recs = db.query(Recommendation).filter_by(decision_id=decision.id).all()
    for r in recs:
        print(f"Recommendation ID {r.id}, status: {r.status}")
        
    # Envelopes
    envs = db.query(DecisionIntegrityEnvelope).filter_by(decision_id=decision.id).all()
    for e in envs:
        print(f"DecisionIntegrityEnvelope ID {e.id} -> recommendation_id: {e.recommendation_id}")
        
    # Human Decisions
    humans = db.query(HumanDecisionRecord).filter_by(decision_id=decision.id).all()
    for h in humans:
        print(f"HumanDecisionRecord ID {h.id} -> recommendation_id: {h.recommendation_id}, rationale: {h.rationale[:50]}...")

if __name__ == "__main__":
    extract()
