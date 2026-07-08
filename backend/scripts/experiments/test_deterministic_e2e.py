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

from scripts.experiments.seed_nexus_canonical import seed_test_data

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
