import pytest
from fastapi.testclient import TestClient
from main import app
from db.database import SessionLocal, Base, engine
from db.models import User, Workspace, WorkspaceMembership, Decision, DecisionSubject
from auth.password import get_password_hash
from core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from db.database import get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(scope="module")
def setup_auth_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Create two workspaces
    ws1 = Workspace(name="Alpha Capital")
    ws2 = Workspace(name="Beta Ventures")
    db.add_all([ws1, ws2])
    db.commit()

    # Create users
    user_a = User(email="usera@alpha.com", hashed_password=get_password_hash("test"), name="User A", is_active=True)
    user_b = User(email="userb@beta.com", hashed_password=get_password_hash("test"), name="User B", is_active=True)
    db.add_all([user_a, user_b])
    db.commit()

    # Add to workspaces
    mem_a = WorkspaceMembership(user_id=user_a.id, workspace_id=ws1.id, role="admin")
    mem_b = WorkspaceMembership(user_id=user_b.id, workspace_id=ws2.id, role="admin")
    db.add_all([mem_a, mem_b])
    db.commit()

    # Create subjects
    # Create subjects
    sub_a = DecisionSubject(name="Startup A")
    sub_b = DecisionSubject(name="Startup B")
    db.add_all([sub_a, sub_b])
    db.commit()

    # Create decisions
    dec_a = Decision(title="Decision A", status="Review", workspace_id=ws1.id, subject_id=sub_a.id)
    dec_b = Decision(title="Decision B", status="Review", workspace_id=ws2.id, subject_id=sub_b.id)
    db.add_all([dec_a, dec_b])
    db.commit()

    yield {
        "user_a": user_a,
        "user_b": user_b,
        "dec_a": dec_a,
        "dec_b": dec_b,
        "ws1": ws1,
        "ws2": ws2
    }

    db.close()
    Base.metadata.drop_all(bind=engine)

def get_token(username: str):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": username, "password": "test"}
    )
    return response.json()["access_token"]

def test_unauthenticated_rejected(setup_auth_db):
    settings.ENABLE_AUTH = True
    dec_a = setup_auth_db["dec_a"]
    
    # Try accessing decision A without token
    response = client.get(f"/api/v1/decisions/{dec_a.id}")
    assert response.status_code == 401

def test_cross_workspace_denied(setup_auth_db):
    settings.ENABLE_AUTH = True
    token_a = get_token("usera@alpha.com")
    headers = {"Authorization": f"Bearer {token_a}"}
    
    dec_b = setup_auth_db["dec_b"]
    
    # Try accessing decision B with user A's token
    response = client.get(f"/api/v1/decisions/{dec_b.id}", headers=headers)
    assert response.status_code == 403 or response.status_code == 404

    # Try Investment Case
    response = client.get(f"/api/v1/decisions/{dec_b.id}/investment-case", headers=headers)
    assert response.status_code == 403 or response.status_code == 404

    # Try Claims
    response = client.get(f"/api/v1/decisions/{dec_b.id}/claims", headers=headers)
    assert response.status_code == 403 or response.status_code == 404
    
    # Try Assumptions
    response = client.get(f"/api/v1/decisions/{dec_b.id}/assumptions", headers=headers)
    assert response.status_code == 403 or response.status_code == 404

    # Try Evaluation
    response = client.post(f"/api/v1/decisions/{dec_b.id}/evaluate_adaptive", headers=headers)
    assert response.status_code == 403 or response.status_code == 404

    # Try Status
    response = client.get(f"/api/v1/decisions/{dec_b.id}/status", headers=headers)
    assert response.status_code == 403 or response.status_code == 404

def test_workspace_member_allowed(setup_auth_db):
    settings.ENABLE_AUTH = True
    token_a = get_token("usera@alpha.com")
    headers = {"Authorization": f"Bearer {token_a}"}
    
    dec_a = setup_auth_db["dec_a"]
    
    # Try accessing decision A with user A's token
    response = client.get(f"/api/v1/decisions/{dec_a.id}", headers=headers)
    assert response.status_code == 200

def test_deal_list_scoping(setup_auth_db):
    settings.ENABLE_AUTH = True
    token_a = get_token("usera@alpha.com")
    headers = {"Authorization": f"Bearer {token_a}"}
    
    dec_a = setup_auth_db["dec_a"]
    dec_b = setup_auth_db["dec_b"]
    
    response = client.get("/api/v1/decisions/", headers=headers)
    assert response.status_code == 200
    
    deals = response.json()
    deal_ids = [d["id"] for d in deals]
    
    # Should only see Decision A, not Decision B
    assert dec_a.id in deal_ids
    assert dec_b.id not in deal_ids
