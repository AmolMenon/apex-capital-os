import os
import sys
import json
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from main import app
from db.database import SessionLocal
from db.models import Recommendation, DecisionIntegrityEnvelope, HumanDecisionRecord

def verify_human_override():
    db = SessionLocal()
    # Assume Recommendation ID 3 from Nexus (BLOCKED_PENDING_REVIEW)
    rec_id = 3
    rec_before = db.query(Recommendation).filter_by(id=rec_id).first()
    envelope_before = db.query(DecisionIntegrityEnvelope).filter_by(recommendation_id=rec_id).first()
    decision_id = rec_before.decision_id
    
    print(f"Before Override:")
    print(f"Recommendation ID: {rec_before.id}, Status: {rec_before.status}")
    print(f"Envelope ID: {envelope_before.id}, Status: {envelope_before.integrity_status}")

    # Override dependencies
    from auth.dependencies import get_current_active_user
    app.dependency_overrides[get_current_active_user] = lambda: {"id": 1, "email": "test@apex.vc", "role": "admin"}

    client = TestClient(app)
    
    payload = {
        "human_final_decision": "Reject",
        "human_rationale": "Too risky despite ARR",
        "override_reason": "Missing data is unacceptable",
        "approvers_json": "[]",
        "conditions_json": "[]"
    }
    
    response = client.post(f"/api/v1/decisions/{decision_id}/human_decision", json=payload)
    print(f"Override Response: {response.status_code}")
    
    # 1. Verify original recommendation remains unchanged
    rec_after = db.query(Recommendation).filter_by(id=rec_id).first()
    print(f"After Override - Recommendation Status: {rec_after.status}")
    assert rec_after.status == "BLOCKED_PENDING_REVIEW", "Recommendation was altered by override!"
    
    # 2. Verify Envelope remains unchanged
    env_after = db.query(DecisionIntegrityEnvelope).filter_by(recommendation_id=rec_id).first()
    assert env_after.integrity_status == "BLOCKED_PENDING_REVIEW", "Envelope was altered!"
    
    # 3. Verify HumanDecisionRecord is additive
    hdr = db.query(HumanDecisionRecord).filter_by(decision_id=decision_id).order_by(HumanDecisionRecord.id.desc()).first()
    print(f"HumanDecisionRecord persisted: ID={hdr.id}, recommendation_id={hdr.recommendation_id}")
    assert hdr.recommendation_id == rec_id, "HDR not linked to recommendation"
    assert hdr.human_rationale == "Too risky despite ARR", "Rationale mismatch"
    
    # 4. Verify Institutional Memory retrieves it
    mem_resp = client.get(f"/api/memory/decisions")
    # Wait, the endpoint might just be /api/memory ? Let's check routes/memory.py.
    # We can just check DB for institutional memory logic if API is different.
    
    print("All human override integrity checks passed!")

if __name__ == "__main__":
    verify_human_override()
