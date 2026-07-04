import json
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Recommendation, ReasoningRun, DecisionIntegrityEnvelope
from reasoning_engine.adaptive_controller import AdaptiveReasoningController

def verify_api_contract():
    db = SessionLocal()
    try:
        decision_id = 9999
        
        # 1. Fetch the latest run
        run = db.query(ReasoningRun).filter_by(decision_id=decision_id).order_by(ReasoningRun.id.desc()).first()
        if not run:
            print("No run found.")
            return
            
        api_response = json.loads(run.output_json)
        
        # 2. Fetch the recommendation
        rec_id = api_response["recommendation_id"]
        rec = db.query(Recommendation).filter_by(id=rec_id).first()
        
        # 3. Fetch the envelope
        env = db.query(DecisionIntegrityEnvelope).filter_by(recommendation_id=rec_id).first()
        
        # 4. Compare contract vs reality
        assert api_response["status"] == rec.status, f"Status mismatch: API {api_response['status']} vs DB {rec.status}"
        assert api_response["integrity_envelope"]["integrity_status"] == env.integrity_status, "Envelope status mismatch"
        
        print("API Contract matches DB Reality perfectly.")
        print(f"API Recommendation Status: {api_response['status']}")
        print(f"DB Recommendation Status: {rec.status}")
        print(f"API Envelope Status: {api_response['integrity_envelope']['integrity_status']}")
        print(f"DB Envelope Status: {env.integrity_status}")
        
    finally:
        db.close()

if __name__ == "__main__":
    verify_api_contract()
