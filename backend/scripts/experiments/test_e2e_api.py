import json
from fastapi.testclient import TestClient
from main import app
from db.database import get_db, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use a test database so we don't mess up live_val.db
engine = create_engine("sqlite:///test_e2e.db")
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)
TestingSessionLocal = sessionmaker(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

from auth.dependencies import get_current_active_user

def override_get_current_active_user():
    return {"id": 1, "username": "testuser", "role": "admin"}

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_active_user] = override_get_current_active_user

client = TestClient(app)

def setup_mock_data():
    db = TestingSessionLocal()
    from db.models import Decision, Claim, Assumption
    
    # 1. Create a Decision
    d = Decision(id=999, title="E2E Mock Decision", status="Draft")
    db.add(d)
    
    # 2. Add some claims
    c1 = Claim(decision_id=999, statement="Revenue is 10M")
    c2 = Claim(decision_id=999, statement="Revenue is 5M")
    db.add_all([c1, c2])
    db.commit()
    return db

def run_trace():
    db = setup_mock_data()
    print("Sending POST to /api/v1/decisions/999/evaluate_adaptive")
    
    res = client.post("/api/v1/decisions/999/evaluate_adaptive")
    
    print(f"Status Code: {res.status_code}")
    data = res.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    
    # Inspect DB after trace
    from db.models import EscalationSignal, ChallengeTask, ChallengeFinding, DecisionIntegrityEnvelope, Recommendation, GraphNode, GraphEdge
    
    print("\nDatabase State after execution:")
    signals = db.query(EscalationSignal).filter(EscalationSignal.decision_id == 999).all()
    print(f"Signals: {len(signals)}")
    tasks = db.query(ChallengeTask).filter(ChallengeTask.decision_id == 999).all()
    print(f"Tasks: {len(tasks)}")
    findings = db.query(ChallengeFinding).filter(ChallengeFinding.decision_id == 999).all()
    print(f"Findings: {len(findings)}")
    rec = db.query(Recommendation).filter(Recommendation.decision_id == 999).first()
    print(f"Recommendation ID: {rec.id if rec else None}, Status: {rec.status if rec else None}")
    env = db.query(DecisionIntegrityEnvelope).filter(DecisionIntegrityEnvelope.decision_id == 999).first()
    print(f"Envelope ID: {env.id if env else None}, Integrity Status: {env.integrity_status if env else None}")
    
    nodes = db.query(GraphNode).filter(GraphNode.decision_id == 999).count()
    edges = db.query(GraphEdge).count()
    print(f"Graph Nodes: {nodes}, Graph Edges: {edges}")

if __name__ == "__main__":
    run_trace()
