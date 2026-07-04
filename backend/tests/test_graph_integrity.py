import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.database import Base
from db.models import Decision, Claim, ChallengeTask, ChallengeFinding, Recommendation, EscalationSignal, EvidenceConflict
from services.graph_service import GraphService

engine = create_engine("sqlite:///:memory:")
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def setup_db(db):
    decision = Decision(title="Test Decision", status="Active")
    db.add(decision)
    db.commit()
    return decision

def test_challenge_creates_targets_object_edge(db, setup_db):
    task = ChallengeTask(decision_id=setup_db.id, target_type="Claim", target_id="1", challenge_question="Test")
    sig = EscalationSignal(decision_id=setup_db.id, reason="Reason")
    db.add_all([task, sig])
    db.commit()
    
    # Needs a claim 1 in graph
    GraphService.upsert_node(db, setup_db.id, "Claim", 1, "test")
    
    res = GraphService.link_escalation_to_challenge(db, setup_db.id, sig, task)
    assert res["status"] == "SUCCESS"
    
    trace = GraphService.trace_provenance(db, setup_db.id, f"challenge_task:{task.id}")
    edges = trace["edges"]
    assert any(e["relationship"] == "CHALLENGE_TARGETS_OBJECT" and e["target"] == "claim:1" for e in edges)

def test_invalid_relationship_type_rejected(db, setup_db):
    c1 = GraphService.upsert_node(db, setup_db.id, "Claim", 1, "claim 1")
    c2 = GraphService.upsert_node(db, setup_db.id, "Claim", 2, "claim 2")
    res = GraphService.add_validated_edge(db, setup_db.id, c1, c2, "INVALID_RELATIONSHIP")
    assert res["status"] == "RELATIONSHIP_REJECTED_INVALID_TYPE"

def test_cross_decision_relationship_rejected(db, setup_db):
    decision2 = Decision(title="Test 2", status="Active")
    db.add(decision2)
    db.commit()
    
    c1 = GraphService.upsert_node(db, setup_db.id, "Claim", 1, "claim 1")
    c2 = GraphService.upsert_node(db, decision2.id, "Claim", 2, "claim 2")
    
    res = GraphService.add_validated_edge(db, setup_db.id, c1, c2, "CLAIM_CONTRADICTS_CLAIM")
    assert res["status"] == "RELATIONSHIP_REJECTED_CROSS_DECISION"

def test_duplicate_prevention(db, setup_db):
    c1 = GraphService.upsert_node(db, setup_db.id, "Claim", 1, "claim 1")
    c2 = GraphService.upsert_node(db, setup_db.id, "Claim", 2, "claim 2")
    
    res1 = GraphService.add_validated_edge(db, setup_db.id, c1, c2, "CLAIM_CONTRADICTS_CLAIM")
    assert res1["status"] == "RELATIONSHIP_ACCEPTED"
    
    res2 = GraphService.add_validated_edge(db, setup_db.id, c1, c2, "CLAIM_CONTRADICTS_CLAIM")
    assert res2["status"] == "RELATIONSHIP_REJECTED_DUPLICATE"
    
    # nodes should also not duplicate on upsert
    GraphService.upsert_node(db, setup_db.id, "Claim", 1, "updated")
    from db.models import GraphNode
    assert db.query(GraphNode).filter(GraphNode.id == c1).count() == 1

def test_graph_sync_failure_does_not_leave_partial_chain(db, setup_db):
    task = ChallengeTask(decision_id=setup_db.id, challenge_question="Test")
    finding = ChallengeFinding(decision_id=setup_db.id, position_after="Test")
    rec = Recommendation(decision_id=setup_db.id, recommendation_value="Rec")
    db.add_all([task, finding, rec])
    db.commit()
    
    # Induce failure by passing bad target id that violates constraints in a transaction
    # Since we test partial rollback, we can mock `add_validated_edge` to raise Exception
    import services.graph_service
    original = services.graph_service.GraphService.add_validated_edge
    
    def bad_edge(*args, **kwargs):
        if args[4] == "FINDING_AFFECTS_RECOMMENDATION":
            raise ValueError("Simulated DB failure")
        return original(*args, **kwargs)
        
    services.graph_service.GraphService.add_validated_edge = bad_edge
    
    res = GraphService.persist_challenge_finding_chain(db, setup_db.id, task, finding, rec)
    
    services.graph_service.GraphService.add_validated_edge = original
    
    assert res[0]["status"] == "GRAPH_SYNC_FAILED"
    
    # Verify rollback
    from db.models import GraphEdge, GraphNode
    task_node = db.query(GraphNode).filter(GraphNode.id == f"challenge_task:{task.id}").first()
    assert task_node is None # rolled back
