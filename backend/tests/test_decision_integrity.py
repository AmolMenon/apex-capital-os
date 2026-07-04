import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.database import Base
from db.models import Decision, EvidenceConflict, EscalationSignal, Assumption, ReasoningRun, Recommendation, DecisionIntegrityEnvelope, ChallengeTask, ChallengeFinding
from services.integrity_service import DecisionIntegrityService
from services.graph_service import GraphService
from reasoning_engine.integrity_policy import IntegrityPolicy
from reasoning_engine.adaptive_controller import SynthesisSchemaValidator
import json

@pytest.fixture(scope="function")
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    yield db
    db.close()

def setup_mock_decision(db, decision_id=1, eval_run_id="run_1"):
    decision = Decision(id=decision_id, title="Test Decision")
    db.add(decision)
    run = ReasoningRun(id=1, decision_id=decision_id, evaluation_run_id=eval_run_id, status="Completed")
    db.add(run)
    rec = Recommendation(id=1, decision_id=decision_id, reasoning_run_id=run.id, recommendation_value="Do X", status="DRAFT")
    db.add(rec)
    db.commit()
    return decision_id, run.id, eval_run_id, rec.id

def test_high_conflict_blocks_finalization(db_session):
    decision_id, run_id, eval_run_id, rec_id = setup_mock_decision(db_session)
    
    conflict = EvidenceConflict(id=1, decision_id=decision_id, claim_a_id=1, claim_b_id=2, relationship_type="CONTRADICTS", resolution_status="UNRESOLVED")
    db_session.add(conflict)
    
    signal = EscalationSignal(id=1, decision_id=decision_id, evaluation_run_id=eval_run_id, signal_type="EXPLICIT_EVIDENCE_CONFLICT", severity="HIGH", source_conflict_ids_json='["1"]')
    db_session.add(signal)
    db_session.commit()
    
    envelope = DecisionIntegrityService.build_envelope(db_session, decision_id, run_id, eval_run_id, rec_id)
    
    assert envelope.mandatory_human_review is True
    assert envelope.integrity_status == "BLOCKED_PENDING_REVIEW"
    
    hard_conflicts = json.loads(envelope.hard_conflicts_json)
    assert len(hard_conflicts) == 1
    assert hard_conflicts[0]["conflict_id"] == 1

def test_resolved_high_conflict_does_not_block(db_session):
    decision_id, run_id, eval_run_id, rec_id = setup_mock_decision(db_session)
    
    conflict = EvidenceConflict(id=1, decision_id=decision_id, claim_a_id=1, claim_b_id=2, relationship_type="CONTRADICTS", resolution_status="RESOLVED")
    db_session.add(conflict)
    
    signal = EscalationSignal(id=1, decision_id=decision_id, evaluation_run_id=eval_run_id, signal_type="EXPLICIT_EVIDENCE_CONFLICT", severity="HIGH", source_conflict_ids_json='["1"]')
    db_session.add(signal)
    db_session.commit()
    
    envelope = DecisionIntegrityService.build_envelope(db_session, decision_id, run_id, eval_run_id, rec_id)
    
    # Conflict is RESOLVED, so it shouldn't block
    assert envelope.mandatory_human_review is False
    assert envelope.integrity_status == "CLEAR"
    
def test_critical_assumption_blocks_finalization(db_session):
    decision_id, run_id, eval_run_id, rec_id = setup_mock_decision(db_session)
    
    assumption = Assumption(id=1, decision_id=decision_id, statement="It will rain", status="Unverified")
    db_session.add(assumption)
    
    signal = EscalationSignal(id=1, decision_id=decision_id, evaluation_run_id=eval_run_id, signal_type="CRITICAL_ASSUMPTION", severity="CRITICAL", source_assumption_ids_json='["1"]')
    db_session.add(signal)
    db_session.commit()
    
    envelope = DecisionIntegrityService.build_envelope(db_session, decision_id, run_id, eval_run_id, rec_id)
    
    assert envelope.mandatory_human_review is True
    assert envelope.integrity_status == "CRITICAL_REVIEW_REQUIRED"
    
    ca = json.loads(envelope.critical_assumptions_json)
    assert len(ca) == 1
    assert ca[0]["assumption_id"] == 1

def test_medium_issue_allows_conditional(db_session):
    decision_id, run_id, eval_run_id, rec_id = setup_mock_decision(db_session)
    
    signal = EscalationSignal(id=1, decision_id=decision_id, evaluation_run_id=eval_run_id, signal_type="LOW_CONFIDENCE", severity="MEDIUM")
    db_session.add(signal)
    db_session.commit()
    
    envelope = DecisionIntegrityService.build_envelope(db_session, decision_id, run_id, eval_run_id, rec_id)
    
    assert envelope.mandatory_human_review is False
    assert envelope.integrity_status == "CONDITIONAL"

def test_synthesis_schema_validation():
    # Valid
    SynthesisSchemaValidator.validate({
        "recommendation": "Yes",
        "unresolved_conflicts": [],
        "challenge_findings": [],
        "recommendation_confidence": 95
    })
    
    # Missing required field
    with pytest.raises(ValueError):
        SynthesisSchemaValidator.validate({
            "recommendation": "Yes",
            "challenge_findings": []
        })
        
    # Invalid confidence
    with pytest.raises(ValueError):
        SynthesisSchemaValidator.validate({
            "recommendation": "Yes",
            "unresolved_conflicts": [],
            "challenge_findings": [],
            "recommendation_confidence": 150
        })

def test_envelope_idempotent_generation(db_session):
    decision_id, run_id, eval_run_id, rec_id = setup_mock_decision(db_session)
    # Generate envelope twice, ensure no crashes and output matches.
    envelope1 = DecisionIntegrityService.build_envelope(db_session, decision_id, run_id, eval_run_id, rec_id)
    envelope2 = DecisionIntegrityService.build_envelope(db_session, decision_id, run_id, eval_run_id, rec_id)
    assert envelope1.integrity_status == envelope2.integrity_status
