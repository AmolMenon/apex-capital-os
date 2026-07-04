import pytest
from fastapi.testclient import TestClient
from fastapi import Depends
from main import app
from db.database import SessionLocal, Base, engine
from db.models import User, RoleEnum
from auth.password import get_password_hash
from core.config import settings
from auth.dependencies import require_roles
import os

# Mount a temporary route for testing roles
@app.get("/api/v1/route_admin_only")
def route_admin_only(user=Depends(require_roles([RoleEnum.ADMIN]))):
    return {"status": "ok", "user_role": user.role}

client = TestClient(app)

def setup_module(module):
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def test_db():
    db = SessionLocal()
    
    # Create test users
    admin_user = User(
        email="admin@apexcapital.com",
        hashed_password=get_password_hash("testpassword123"),
        name="Admin User",
        role="Admin",
        is_active=True
    )
    viewer_user = User(
        email="viewer@apexcapital.com",
        hashed_password=get_password_hash("testpassword123"),
        name="Viewer User",
        role="Viewer",
        is_active=True
    )
    inactive_user = User(
        email="inactive@apexcapital.com",
        hashed_password=get_password_hash("testpassword123"),
        name="Inactive User",
        role="Admin",
        is_active=False
    )
    db.add(admin_user)
    db.add(viewer_user)
    db.add(inactive_user)
    db.commit()
    
    yield db
    db.close()

def test_register(test_db):
    settings.ENABLE_AUTH = True
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "newuser@apexcapital.com", "password": "newpassword123", "name": "New User", "role": "Viewer"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@apexcapital.com"
    assert "id" in data

def test_login_success(test_db):
    settings.ENABLE_AUTH = True
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin@apexcapital.com", "password": "testpassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_login_invalid_password(test_db):
    settings.ENABLE_AUTH = True
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin@apexcapital.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401

def test_login_inactive_user(test_db):
    settings.ENABLE_AUTH = True
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "inactive@apexcapital.com", "password": "testpassword123"}
    )
    assert response.status_code == 400

def test_auth_me_no_token():
    settings.ENABLE_AUTH = True
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401

def test_auth_me_valid_token(test_db):
    settings.ENABLE_AUTH = True
    login_res = client.post("/api/v1/auth/login", data={"username": "admin@apexcapital.com", "password": "testpassword123"})
    token = login_res.json()["access_token"]
    
    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "admin@apexcapital.com"

def test_role_based_access_permitted(test_db):
    settings.ENABLE_AUTH = True
    login_res = client.post("/api/v1/auth/login", data={"username": "admin@apexcapital.com", "password": "testpassword123"})
    token = login_res.json()["access_token"]
    
    response = client.get("/api/v1/route_admin_only", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["user_role"] == "Admin"

def test_role_based_access_rejected(test_db):
    settings.ENABLE_AUTH = True
    login_res = client.post("/api/v1/auth/login", data={"username": "viewer@apexcapital.com", "password": "testpassword123"})
    token = login_res.json()["access_token"]
    
    response = client.get("/api/v1/route_admin_only", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403
