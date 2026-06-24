import pytest
from fastapi.testclient import TestClient
from main import app
from db.database import SessionLocal, Base, engine
from db.models import User, Workspace, WorkspaceMember
from auth.password import get_password_hash
from core.config import settings
import os

client = TestClient(app)

def setup_module(module):
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def test_db():
    db = SessionLocal()
    # Create test workspace
    ws = Workspace(name="Test Workspace")
    db.add(ws)
    db.commit()
    db.refresh(ws)
    
    # Create test user
    user = User(
        email="test@apexcapital.com",
        hashed_password=get_password_hash("testpassword123"),
        name="Test User"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create member
    member = WorkspaceMember(workspace_id=ws.id, user_id=user.id)
    db.add(member)
    db.commit()
    
    yield db
    db.close()

def test_login_success(test_db):
    settings.ENABLE_AUTH = True
    response = client.post(
        "/api/auth/login",
        json={"email": "test@apexcapital.com", "password": "testpassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_password(test_db):
    settings.ENABLE_AUTH = True
    response = client.post(
        "/api/auth/login",
        json={"email": "test@apexcapital.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401

def test_auth_me_no_token():
    settings.ENABLE_AUTH = True
    response = client.get("/api/auth/me")
    assert response.status_code == 401
