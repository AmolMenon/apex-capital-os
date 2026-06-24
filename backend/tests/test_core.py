import pytest
from fastapi.testclient import TestClient
from main import app
from db.database import SessionLocal, Base, engine

client = TestClient(app)

def setup_module(module):
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    Base.metadata.drop_all(bind=engine)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "ok"
    assert "mode" in data

def test_health_db():
    response = client.get("/health/db")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"

def test_health_ai():
    response = client.get("/health/ai")
    assert response.status_code == 200

def test_version():
    response = client.get("/version")
    assert response.status_code == 200
    data = response.json()
    assert "app" in data
    assert "Apex Capital" in data["app"]
    assert "version" in data
