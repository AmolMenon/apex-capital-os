import sys
import os
import json
import uuid

if "DATABASE_URL" not in os.environ:
    os.environ["DATABASE_URL"] = "sqlite:///./test_apex_capital.db"
os.environ["APEX_LLM_MODE"] = "test"
os.environ["APEX_REASONING_PROVIDER"] = "mock"

sys.path.insert(0, os.path.abspath('.'))

from db.database import SessionLocal, engine
from db.models import Decision, DomainPack, ReasoningAgent, DecisionSubject, Claim, Assumption, ReasoningRun, DecisionIntegrityEnvelope
from reasoning_engine.adaptive_controller import AdaptiveReasoningController
from services.llm_provider import DeterministicTestProvider
import database.crud as crud

def seed_test_data(db):
    print("Seeding test data...")
    # Clear old data for test objects to ensure idempotency
    from db.models import User
    db.query(User).filter(User.id == 1).delete()
    db.query(Claim).filter(Claim.id.in_([1, 2, 3])).delete()
    db.query(Assumption).filter(Assumption.id.in_([1, 2, 3])).delete()
    db.query(Decision).filter(Decision.id == 9999).delete()
    db.query(DecisionSubject).filter(DecisionSubject.id == 9999).delete()
    db.query(DomainPack).filter(DomainPack.id == "test_pack").delete()
    db.query(ReasoningAgent).filter(ReasoningAgent.id == "test_agent").delete()
    db.commit()

    test_user = User(id=1, email="test@apex.vc", hashed_password="pw", name="Test User", role="admin", is_active=True)
    pack = DomainPack(id="test_pack", name="Venture Capital SaaS", description="SaaS Evaluation", config_json="{}")
    agent = ReasoningAgent(id="test_agent", domain_pack_id="test_pack", name="Apex Reasoning Engine", system_prompt="Test", capabilities_json="[]")
    
    # Seed Nexus Data Systems metadata
    metadata = {
        "sector": "Data Infrastructure",
        "stage": "Series A",
        "round_size": "$8M",
        "valuation": "$40M Pre-money",
        "lead_investor": "TBD"
    }
    subject = DecisionSubject(id=9999, name="Nexus Data Systems", description="The unified control plane for multi-cloud AI data pipelines.", metadata_json=json.dumps(metadata))
    decision = Decision(id=9999, subject_id=9999, domain_pack_id="test_pack", title="Nexus Data Systems - Series A Investment", status="Debate")
    
    db.add_all([test_user, pack, agent, subject, decision])
    db.commit()
    
    # Add evidence for Nexus
    c1 = Claim(id=1, decision_id=9999, statement="Nexus generated $1.5M in ARR last year.", provenance_type="Extracted from Pitch Deck")
    c2 = Claim(id=2, decision_id=9999, statement="Of the $1.5M revenue, $400k is deferred professional services.", provenance_type="Extracted from Financials Footnote")
    c3 = Claim(id=3, decision_id=9999, statement="CTO Sarah is taking a leave of absence.", provenance_type="Extracted from Founder Update Email")
    a1 = Assumption(id=1, decision_id=9999, statement="Nexus will hit $10M ARR next year (6x growth).", confidence=40, status="Unverified")
    a2 = Assumption(id=2, decision_id=9999, statement="Customer churn is manageable (No data provided).", confidence=20, status="Unverified")
    a3 = Assumption(id=3, decision_id=9999, statement="Competitors are not heavily discounting.", confidence=50, status="Unverified")
    
    db.add_all([c1, c2, c3, a1, a2, a3])
    
    from services.graph_service import GraphService
    # Just add them to graph, let the engine wire them up
    for c in [c1, c2, c3]:
        GraphService.upsert_node(db, 9999, "Claim", c.id, c.statement)
    for a in [a1, a2, a3]:
        GraphService.upsert_node(db, 9999, "Assumption", a.id, a.statement)
        
    db.commit()

def run_test():
    db = SessionLocal()
    try:
        seed_test_data(db)
        
        # Inject DeterministicTestProvider
        print("Running adaptive evaluation with DeterministicTestProvider...")
        provider = DeterministicTestProvider()
        controller = AdaptiveReasoningController(db, llm_provider=provider)
        
        output_json = controller.evaluate_decision_adaptive(decision_id=9999)
        output = json.loads(output_json)
        
        # Verify
        print("Output:", json.dumps(output, indent=2))
        
        assert "integrity_envelope" in output
        assert output["status"] in ["FINALIZED", "BLOCKED_PENDING_REVIEW"]
        
        # Check database
        run = db.query(ReasoningRun).filter(ReasoningRun.decision_id == 9999).order_by(ReasoningRun.id.desc()).first()
        envelope = db.query(DecisionIntegrityEnvelope).filter(DecisionIntegrityEnvelope.reasoning_run_id == run.id).first()
        
        assert envelope is not None, "Envelope was not created!"
        print(f"Success! Envelope {envelope.id} created with status {envelope.integrity_status}")
        
        # Verify Telemetry
        decision = db.query(Decision).filter(Decision.id == 9999).first()
        assert decision.input_tokens > 0, "Input tokens not updated"
        assert decision.output_tokens > 0, "Output tokens not updated"
        assert decision.latency_ms > 0, "Latency not updated"
        assert decision.base_analysis_calls > 0, "Base analysis calls not tracked"
        print(f"Telemetry verified: {decision.input_tokens} input tokens, {decision.output_tokens} output tokens, {decision.latency_ms}ms latency.")
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    run_test()
