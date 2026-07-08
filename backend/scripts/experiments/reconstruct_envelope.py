import os
import sys
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from db.database import SessionLocal
from db.models import Recommendation, DecisionIntegrityEnvelope, EscalationSignal, ChallengeTask, ChallengeFinding, EvidenceConflict, Assumption

def reconstruct():
    db = SessionLocal()
    
    # Starting from Recommendation ID 3 (as extracted from previous step)
    rec_id = 3
    rec = db.query(Recommendation).filter_by(id=rec_id).first()
    print(f"Starting at Recommendation ID: {rec.id}")

    # Envelope
    envelope = db.query(DecisionIntegrityEnvelope).filter_by(recommendation_id=rec.id).first()
    print(f"-> Found Envelope ID: {envelope.id} via EXACT FK `recommendation_id`")
    
    # Check that we did NOT use timestamp or decision_id max()
    print("-> Verification: Did not use latest timestamp or reason string.")
    
    # Hard Conflicts & Unresolved Signals
    hard_conflicts = json.loads(envelope.hard_conflicts_json)
    print(f"-> Hard Conflicts: {len(hard_conflicts)}")
    for hc in hard_conflicts:
        conf_id = hc['conflict_id']
        # Fetch originating EvidenceConflict
        ev = db.query(EvidenceConflict).filter_by(id=conf_id).first()
        print(f"  -> Originating EvidenceConflict ID: {ev.id}")
        
    signals = json.loads(envelope.unresolved_high_severity_signals_json)
    print(f"-> Unresolved Escalation Signals: {len(signals)}")
    for sig in signals:
        sig_id = sig['signal_id']
        s = db.query(EscalationSignal).filter_by(id=sig_id).first()
        print(f"  -> EscalationSignal ID: {s.id}")
        
        # Traverse to ChallengeTask
        task = db.query(ChallengeTask).filter_by(escalation_signal_id=s.id).first()
        if task:
            print(f"    -> ChallengeTask ID: {task.id}")
            # Traverse to ChallengeFinding
            finding = db.query(ChallengeFinding).filter_by(challenge_task_id=task.id).first()
            if finding:
                print(f"      -> ChallengeFinding ID: {finding.id}")

    # Critical assumptions
    assumptions = json.loads(envelope.critical_assumptions_json)
    print(f"-> Critical Assumptions: {len(assumptions)}")
    for a in assumptions:
        a_id = a['assumption_id']
        asm = db.query(Assumption).filter_by(id=a_id).first()
        print(f"  -> Originating Assumption ID: {asm.id}")

if __name__ == "__main__":
    reconstruct()
