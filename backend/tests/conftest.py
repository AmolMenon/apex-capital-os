from sqlalchemy.pool import StaticPool
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.database import Base, get_db
from main import app
from db.models import User, RoleEnum

# In-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def admin_token(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "admin@apex.com",
        "password": "password",
        "name": "Admin"
    })
    
    # Manually promote to ADMIN in DB since default is ANALYST
    db = TestingSessionLocal()
    user = db.query(User).filter(User.email == "admin@apex.com").first()
    if user:
        user.role = RoleEnum.ADMIN
        db.commit()
    db.close()

    response = client.post("/api/v1/auth/login", data={
        "username": "admin@apex.com",
        "password": "password"
    })
    return response.json()["access_token"]
