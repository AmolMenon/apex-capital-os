import sys
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.models import Decision, ReasoningRun, EscalationSignal, ChallengeTask, ChallengeFinding, EvidenceConflict, Assumption, Recommendation
from reasoning_engine.adaptive_controller import AdaptiveReasoningController
from reasoning_engine.integrity_policy import IntegrityPolicy
from services.integrity_service import DecisionIntegrityService
from services.graph_service import GraphService

def main():
    engine = create_engine("sqlite:///../live_val.db")
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    print("Replaying Case B (Decision ID 2) Finalization...")
    decision_id = 2
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    
    # We assume Case B had already generated base analysis, signals, tasks, findings.
    # We will simulate the synthesis step by retrieving what it *would* have output in a draft,
    # or just mocking a draft synthesis that drops the exact string, which is what happened before.
    
    # Actually, the user asked to not call the LLM and to use the persisted state.
    # The synthesis in Case B failed validation so it wasn't saved. Let's provide a mock synthesis response
    # that represents the natural language summary the LLM produced.
    mock_synthesis = {
        "recommendation": "Defer investment until the conflict in efficacy claims is resolved.",
        "recommendation_type": "Defer",
        "recommendation_confidence": 3,
        "supporting_evidence": [],
        "contradicting_evidence": ["Claim 2: 80%", "Claim 3: 40%"],
        "resolved_conflicts": [],
        "unresolved_conflicts": ["There remains a significant discrepancy between the 80% and 40% efficacy claims."],
        "critical_assumptions": [],
        "invalidated_assumptions": [],
        "minority_positions": [],
        "challenge_findings": ["The conflict remains a critical barrier to due diligence."],
        "missing_critical_information": ["Source data for claims", "Trial phases"],
        "conditions_for_reversal": [],
        "next_best_action": "Request full clinical data from founders.",
        "human_review_requirements": ["Human review is necessary to resolve efficacy discrepancy."]
    }
    
    # We fetch the run. We create a new run or just use the DB to build the envelope.
    # Let's create a dummy ReasoningRun to associate with.
    run = ReasoningRun(
        decision_id=decision_id,
        execution_mode="test",
        provider="mock",
        model="mock",
        execution_topology="adaptive",
        status="Running"
    )
    db.add(run)
    db.commit()
    
    # Draft Recommendation
    rec_obj = Recommendation(
        decision_id=decision_id,
        reasoning_run_id=run.id,
        recommendation_value=mock_synthesis["recommendation"],
        recommendation_type=mock_synthesis["recommendation_type"],
        model_confidence=mock_synthesis["recommendation_confidence"],
        key_risks_json=json.dumps(mock_synthesis["critical_assumptions"]),
        missing_information_json=json.dumps(mock_synthesis["missing_critical_information"]),
        status="DRAFT"
    )
    db.add(rec_obj)
    db.flush()
    
    rec_node_id = GraphService.upsert_node(db, decision_id, "Recommendation", rec_obj.id, rec_obj.recommendation_value)
    
    # We will use eval_run_id "run_2" which was the original run for Case B
    eval_run_id = "run_2" 
    
    # Build Envelope
    envelope = DecisionIntegrityService.build_envelope(db, decision_id, run.id, eval_run_id, rec_obj.id)
    
    rec_obj.status = "INTEGRITY_EVALUATED"
    db.flush()
    
    if envelope.integrity_status == "CRITICAL_REVIEW_REQUIRED":
        rec_obj.status = "CRITICAL_REVIEW_REQUIRED"
    elif envelope.integrity_status == "BLOCKED_PENDING_REVIEW":
        rec_obj.status = "BLOCKED_PENDING_REVIEW"
    else:
        rec_obj.status = "FINALIZED"
        
    db.commit()
    
    print(f"Recommendation Status: {rec_obj.status}")
    print(f"Integrity Status: {envelope.integrity_status}")
    print(f"Mandatory Review: {envelope.mandatory_human_review}")
    print(f"Hard Conflicts:\n{json.dumps(json.loads(envelope.hard_conflicts_json), indent=2)}")
    print(f"Blocking Conditions:\n{json.dumps(json.loads(envelope.blocking_conditions_json), indent=2)}")
    
    print("\nGraph Node Check:")
    nodes = db.query(GraphNode).filter(GraphNode.decision_id == decision_id).all()
    types = set(n.node_type for n in nodes)
    print(f"Node types present: {types}")
    print("DecisionIntegrityEnvelope in Graph:", "DecisionIntegrityEnvelope" in types)
    
if __name__ == "__main__":
    from db.models import GraphNode
    main()
