import os
import json
import pytest
from sqlalchemy.orm import Session
from db.database import SessionLocal, Base, engine
from db.models import (
    Workspace, DomainPack, DecisionSubject, Decision,
    Claim, Assumption, EvidenceConflict, Recommendation,
    EscalationSignal, ChallengeTask, ChallengeFinding, DecisionIntegrityEnvelope,
    ReasoningRun
)
from reasoning_engine.adaptive_controller import AdaptiveReasoningController

@pytest.fixture(scope="module")
def db_session():
    # Make sure we use a clean DB or test DB for this module
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    yield db
    db.close()

def test_integrity_chain_end_to_end(db_session: Session):
    # Setup base entities
    ws = db_session.query(Workspace).first()
    if not ws:
        ws = Workspace(name="Integrity Chain Test WS")
        db_session.add(ws)
        db_session.commit()

    dp = db_session.query(DomainPack).filter_by(name="Venture Capital").first()
    if not dp:
        max_dp_id = db_session.query(DomainPack).order_by(DomainPack.id.desc()).first()
        new_dp_id = (max_dp_id.id + 1) if max_dp_id else 1
        dp = DomainPack(id=new_dp_id, name="Venture Capital")
        db_session.add(dp)
        db_session.commit()

    subject = db_session.query(DecisionSubject).filter_by(name="Test Startup").first()
    if not subject:
        max_id = db_session.query(DecisionSubject).order_by(DecisionSubject.id.desc()).first()
        new_id = (max_id.id + 1) if max_id else 1
        subject = DecisionSubject(id=new_id, name="Test Startup")
        db_session.add(subject)
        db_session.commit()

    from db.models import ReasoningAgent
    agent = db_session.query(ReasoningAgent).filter_by(name="Test Agent").first()
    if not agent:
        max_agent_id = db_session.query(ReasoningAgent).order_by(ReasoningAgent.id.desc()).first()
        new_agent_id = (max_agent_id.id + 1) if max_agent_id else 1
        agent = ReasoningAgent(
            id=new_agent_id,
            name="Test Agent",
            domain_pack_id=dp.id,
            system_prompt="You are a test agent."
        )
        db_session.add(agent)
        db_session.commit()

    decision = Decision(title="Invest in Test Startup", subject_id=subject.id, domain_pack_id=dp.id, status="In Progress")
    db_session.add(decision)
    db_session.commit()

    # Create claims and assumptions
    claim_a = Claim(decision_id=decision.id, statement="Strong team.", confidence=90)
    claim_b = Claim(decision_id=decision.id, statement="Team lacks experience.", confidence=80)
    db_session.add_all([claim_a, claim_b])
    db_session.commit()

    assumption = Assumption(decision_id=decision.id, statement="Market will grow 10x.", status="Unverified")
    db_session.add(assumption)
    db_session.commit()

    # Create unresolved conflict
    conflict = EvidenceConflict(
        decision_id=decision.id,
        claim_a_id=claim_a.id,
        claim_b_id=claim_b.id,
        relationship_type="CONTRADICTS",
        resolution_status="Unresolved"
    )
    db_session.add(conflict)
    db_session.commit()

    # Run the adaptive controller (Mocked LLM will run)
    os.environ["MOCK_LLM_PROVIDER"] = "1"
    
    controller = AdaptiveReasoningController(db_session)
    output_json = controller.evaluate_decision_adaptive(decision.id)
    output = json.loads(output_json)

    # Asserts on relational fields
    
    # 1. Escalation Signals must have evidence_conflict_id and assumption_id
    conflict_signals = db_session.query(EscalationSignal).filter(
        EscalationSignal.decision_id == decision.id,
        EscalationSignal.signal_type == "EXPLICIT_EVIDENCE_CONFLICT"
    ).all()
    assert len(conflict_signals) > 0, "No conflict signal generated"
    assert conflict_signals[0].evidence_conflict_id == conflict.id, "Foreign key for evidence_conflict_id not set"

    assumption_signals = db_session.query(EscalationSignal).filter(
        EscalationSignal.decision_id == decision.id,
        EscalationSignal.signal_type == "CRITICAL_ASSUMPTION"
    ).all()
    
    if assumption_signals:
        # Mock LLM provider may or may not return assumptions in the baseline perspective.
        # Let's verify that if it does, the FK is set.
        assert assumption_signals[0].assumption_id is not None, "Foreign key for assumption_id not set"

    # 2. Challenge Tasks must have escalation_signal_id
    tasks = db_session.query(ChallengeTask).filter(ChallengeTask.decision_id == decision.id).all()
    assert len(tasks) > 0, "No challenge tasks generated"
    for task in tasks:
        assert task.escalation_signal_id is not None, "Foreign key for escalation_signal_id not set on ChallengeTask"

    # 3. Decision Integrity Envelope must have recommendation_id
    rec_id = output.get("recommendation_id")
    assert rec_id is not None, "Recommendation ID not returned in output"

    envelope = db_session.query(DecisionIntegrityEnvelope).filter(
        DecisionIntegrityEnvelope.decision_id == decision.id
    ).order_by(DecisionIntegrityEnvelope.id.desc()).first()
    
    assert envelope is not None, "DecisionIntegrityEnvelope not created"
    assert envelope.recommendation_id == rec_id, "Foreign key for recommendation_id not set on DecisionIntegrityEnvelope"
    
    print("All ID-based relational integrity checks passed successfully.")
