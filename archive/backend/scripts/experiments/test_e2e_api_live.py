import json
import os
from fastapi.testclient import TestClient
from main import app
from db.database import get_db, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from auth.dependencies import get_current_active_user

engine = create_engine("sqlite:///test_e2e_live.db")
TestingSessionLocal = sessionmaker(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def override_get_current_active_user():
    return {"id": 1, "username": "testuser", "role": "admin"}

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_active_user] = override_get_current_active_user

client = TestClient(app)

def run_trace():
    db = TestingSessionLocal()
    
    from db.models import Decision, DomainPack, ReasoningAgent, Claim
    
    # Check if Decision 4 exists
    d = db.query(Decision).filter(Decision.id == 4).first()
    if not d:
        pack = db.query(DomainPack).first()
        d = Decision(id=4, title="Case D E2E Test", status="Draft", domain_pack_id=pack.id)
        db.add(d)
        
        c = Claim(decision_id=4, statement="Revenue is solid")
        db.add(c)
        db.commit()
    
    from core.config import settings
    settings.APEX_LLM_MODE = "test"
    os.environ["APEX_LLM_MODE"] = "test"
    
    print(f"Sending POST to /api/v1/decisions/{d.id}/evaluate_adaptive")
    res = client.post(f"/api/v1/decisions/{d.id}/evaluate_adaptive")
    
    print(f"Status Code: {res.status_code}")
    try:
        data = res.json()
        print(f"Response: {json.dumps(data, indent=2)}")
    except:
        print("Response not JSON:", res.text)
            
    from db.models import EscalationSignal, ChallengeTask, ChallengeFinding, DecisionIntegrityEnvelope, Recommendation, GraphNode, GraphEdge
    
    print("\nDatabase State after execution:")
    signals = db.query(EscalationSignal).filter(EscalationSignal.decision_id == d.id).all()
    print(f"Signals: {len(signals)}")
    tasks = db.query(ChallengeTask).filter(ChallengeTask.decision_id == d.id).all()
    print(f"Tasks: {len(tasks)}")
    findings = db.query(ChallengeFinding).filter(ChallengeFinding.decision_id == d.id).all()
    print(f"Findings: {len(findings)}")
    rec = db.query(Recommendation).filter(Recommendation.decision_id == d.id).order_by(Recommendation.id.desc()).first()
    print(f"Recommendation ID: {rec.id if rec else None}, Status: {rec.status if rec else None}")
    env = db.query(DecisionIntegrityEnvelope).filter(DecisionIntegrityEnvelope.decision_id == d.id).order_by(DecisionIntegrityEnvelope.id.desc()).first()
    print(f"Envelope ID: {env.id if env else None}, Integrity Status: {env.integrity_status if env else None}")
    
    nodes = db.query(GraphNode).filter(GraphNode.decision_id == d.id).count()
    edges = db.query(GraphEdge).filter(GraphEdge.decision_id == d.id).count() 
    print(f"Graph Nodes (Decision 4): {nodes}, Graph Edges: {edges}")

if __name__ == "__main__":
    run_trace()
