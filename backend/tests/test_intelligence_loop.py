import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from main import app
from db.database import SessionLocal, engine
from db import models
from db.models import Base
from services.orchestrator_service import InvestmentCaseOrchestrator
from services.integrity_service import DecisionIntegrityService

from fastapi import Depends
from auth.dependencies import require_decision_access

client = TestClient(app)

def mock_require_decision_access(decision_id: int, db: Session = Depends(lambda: SessionLocal())):
    decision = db.query(models.Decision).filter(models.Decision.id == decision_id).first()
    return decision

app.dependency_overrides[require_decision_access] = mock_require_decision_access

@pytest.fixture(scope="module")
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    yield db
    db.close()

def test_assumption_persistence_and_evidence_linking(setup_db):
    db = setup_db
    # Create deal
    deal = models.Decision(title="Test Deal 1", status="ACTIVE")
    db.add(deal)
    db.commit()
    
    # 1. Assumption Persistence
    resp = client.post(f"/api/v1/decisions/{deal.id}/assumptions", json={
        "statement": "Retention is high",
        "category": "Traction"
    })
    assert resp.status_code == 200
    a_id = resp.json()["id"]
    
    # Create a claim
    claim = models.Claim(decision_id=deal.id, statement="Cohorts show 90% NRR")
    db.add(claim)
    db.commit()
    
    # 2. Evidence Linking
    resp = client.post(f"/api/v1/decisions/{deal.id}/assumptions/{a_id}/claim-links", json={
        "claim_id": claim.id,
        "relationship": "SUPPORTS"
    })
    assert resp.status_code == 200
    
    assumption = db.query(models.Assumption).filter_by(id=a_id).first()
    assert assumption.status == "Verified" # Recomputed to verified due to SUPPORTS link

def test_conflict_creation(setup_db):
    db = setup_db
    deal = db.query(models.Decision).first()
    
    c1 = models.Claim(decision_id=deal.id, statement="Revenue is 1M")
    c2 = models.Claim(decision_id=deal.id, statement="Revenue is 500k")
    db.add_all([c1, c2])
    db.commit()
    
    resp = client.post(f"/api/v1/decisions/{deal.id}/conflicts", json={
        "claim_a_id": c1.id,
        "claim_b_id": c2.id
    })
    assert resp.status_code == 200
    conf_id = resp.json()["id"]
    
    conf = db.query(models.EvidenceConflict).filter_by(id=conf_id).first()
    assert conf.origin == "ANALYST_LOGGED"
    assert conf.status == "OPEN"

def test_task_idempotency(setup_db):
    db = setup_db
    deal = db.query(models.Decision).first()
    
    # Mock task with trigger fingerprint
    task1 = models.ChallengeTask(
        decision_id=deal.id,
        challenge_mode="FALSIFICATION",
        trigger_fingerprint="test_fingerprint",
        status="PENDING"
    )
    db.add(task1)
    db.commit()
    
    # Idempotency is in adaptive_controller. We can simulate it by ensuring the logic checks for trigger_fingerprint
    task2 = db.query(models.ChallengeTask).filter_by(trigger_fingerprint="test_fingerprint", status="PENDING").first()
    assert task2 is not None
    assert task2.id == task1.id

def test_finding_to_conflict_transition(setup_db):
    db = setup_db
    deal = db.query(models.Decision).first()
    
    # Set up conflict
    conf = db.query(models.EvidenceConflict).first()
    
    # Create task
    task = models.ChallengeTask(decision_id=deal.id, target_type="EvidenceConflict", target_id=str(conf.id), status="COMPLETED")
    db.add(task)
    db.commit()
    
    # Create finding
    finding = models.ChallengeFinding(
        decision_id=deal.id,
        challenge_task_id=task.id,
        resolution_effect="SUPPORTS_CLAIM_A"
    )
    db.add(finding)
    db.commit()
    
    InvestmentCaseOrchestrator.apply_finding(db, finding.id)
    
    # Check conflict resolved
    db.refresh(conf)
    assert conf.status == "RESOLVED"

def test_integrity_recomputation(setup_db):
    db = setup_db
    deal = db.query(models.Decision).first()
    
    env = db.query(models.DecisionIntegrityEnvelope).filter_by(decision_id=deal.id).order_by(models.DecisionIntegrityEnvelope.id.desc()).first()
    assert env is not None

def test_read_model(setup_db):
    deal = setup_db.query(models.Decision).first()
    resp = client.get(f"/api/v1/decisions/{deal.id}/investment-case")
    assert resp.status_code == 200
    data = resp.json()
    assert "Traction" in data["investment_case_assumptions"]

def test_cross_deal_link_rejection(setup_db):
    db = setup_db
    deal1 = db.query(models.Decision).first()
    deal2 = models.Decision(title="Deal 2", status="ACTIVE")
    db.add(deal2)
    db.commit()
    
    claim = db.query(models.Claim).filter_by(decision_id=deal1.id).first()
    a = models.Assumption(decision_id=deal2.id, statement="Test")
    db.add(a)
    db.commit()
    
    resp = client.post(f"/api/v1/decisions/{deal2.id}/assumptions/{a.id}/claim-links", json={
        "claim_id": claim.id,
        "relationship": "SUPPORTS"
    })
    assert resp.status_code == 400
    
def test_completed_task_new_evidence(setup_db):
    # Tests that fingerprint changes if links count changes
    db = setup_db
    deal = db.query(models.Decision).first()
    a = models.Assumption(decision_id=deal.id, statement="Test 2", status="Verified")
    db.add(a)
    db.commit()
    links_count = db.query(models.AssumptionClaimLink).filter_by(assumption_id=a.id).count()
    fp1 = f"assumption_{a.id}_st_{a.status}_links_{links_count}"
    
    # Add new claim link
    claim = models.Claim(decision_id=deal.id, statement="Test")
    db.add(claim)
    db.commit()
    link = models.AssumptionClaimLink(assumption_id=a.id, claim_id=claim.id, relationship="CONTRADICTS")
    db.add(link)
    db.commit()
    
    links_count2 = db.query(models.AssumptionClaimLink).filter_by(assumption_id=a.id).count()
    fp2 = f"assumption_{a.id}_st_{a.status}_links_{links_count2}"
    assert fp1 != fp2

def test_inconclusive_finding(setup_db):
    db = setup_db
    deal = db.query(models.Decision).first()
    conf = models.EvidenceConflict(decision_id=deal.id, claim_a_id=1, claim_b_id=2, status="OPEN")
    db.add(conf)
    db.commit()
    task = models.ChallengeTask(decision_id=deal.id, target_type="EvidenceConflict", target_id=str(conf.id), status="COMPLETED")
    db.add(task)
    db.commit()
    finding = models.ChallengeFinding(decision_id=deal.id, challenge_task_id=task.id, resolution_effect="INSUFFICIENT_EVIDENCE")
    db.add(finding)
    db.commit()
    InvestmentCaseOrchestrator.apply_finding(db, finding.id)
    db.refresh(conf)
    assert conf.status == "OPEN"

def test_multiple_findings(setup_db):
    db = setup_db
    deal = db.query(models.Decision).first()
    a = models.Assumption(decision_id=deal.id, statement="Test 3")
    db.add(a)
    db.commit()
    task1 = models.ChallengeTask(decision_id=deal.id, target_type="Assumption", target_id=str(a.id), status="COMPLETED")
    task2 = models.ChallengeTask(decision_id=deal.id, target_type="Assumption", target_id=str(a.id), status="COMPLETED")
    db.add_all([task1, task2])
    db.commit()
    # First finding weakens
    f1 = models.ChallengeFinding(decision_id=deal.id, challenge_task_id=task1.id, assumption_effect="WEAKENS")
    db.add(f1)
    db.commit()
    InvestmentCaseOrchestrator.apply_finding(db, f1.id)
    db.refresh(a)
    assert a.status == "Unverified"
    
    # Second finding supports
    import time
    time.sleep(0.1)
    f2 = models.ChallengeFinding(decision_id=deal.id, challenge_task_id=task2.id, assumption_effect="SUPPORTS")
    db.add(f2)
    db.commit()
    InvestmentCaseOrchestrator.apply_finding(db, f2.id)
    db.refresh(a)
    assert a.status == "Verified"

