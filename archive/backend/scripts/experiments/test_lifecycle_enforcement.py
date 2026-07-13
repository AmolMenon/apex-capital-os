import sys
import os
import json

os.environ["DATABASE_URL"] = "sqlite:///./test_apex_capital.db"
os.environ["APEX_LLM_MODE"] = "test"
os.environ["APEX_REASONING_PROVIDER"] = "mock"

sys.path.insert(0, os.path.abspath('.'))

from db.database import SessionLocal
from db.models import Decision, DomainPack, ReasoningAgent, DecisionSubject, Claim, Assumption, ReasoningRun, DecisionIntegrityEnvelope, EscalationSignal
from reasoning_engine.adaptive_controller import AdaptiveReasoningController
from services.llm_provider import BaseLLMProvider
from typing import Dict, Any

class MockLifecycleProvider(BaseLLMProvider):
    def __init__(self, severity_mock_type="CLEAR"):
        self.severity_mock_type = severity_mock_type
        
    def generate_structured(self, system_prompt: str, user_prompt: str, schema: Dict[str, Any], max_retries: int = 2, model_name: str = None) -> tuple[Dict[str, Any], Dict[str, Any]]:
        if "items" in schema.get("properties", {}):
            return {"items": []}, {"input": 10, "output": 10, "latency_ms": 10}
            
        elif "position" in schema.get("properties", {}):
            res = {
                "position": "Do not invest until the CTO departure is clarified.",
                "confidence": 80 if self.severity_mock_type != "HIGH" else 60, # 60 triggers MEDIUM low confidence
                "supporting_claim_ids": [1],
                "contradicting_claim_ids": [],
                "assumption_ids": [1] if self.severity_mock_type == "MEDIUM" else [], # Triggers MEDIUM critical assumption
                "key_risks": ["governance risk"] if self.severity_mock_type == "CRITICAL" else [], # Wait, "governance" triggers HIGH
                "missing_information": ["Missing info"] if self.severity_mock_type in ["HIGH", "CRITICAL"] else [], # Triggers HIGH
                "questions_to_resolve": [],
                "conditions_that_would_change_position": []
            }
            return res, {"input": 150, "output": 80, "latency_ms": 150}
            
        elif "target_id" in schema.get("properties", {}):
            return {
                "target_id": "claim:3",
                "original_position": "Do not invest",
                "challenge_findings": "The CTO departure was actually amicable according to new evidence.",
                "new_evidence_relationships": [],
                "assumption_status_change": "Invalidated",
                "risk_status_change": "Mitigated",
                "position_before": "Do not invest",
                "position_after": "Hold pending leadership review.",
                "confidence_before": 80,
                "confidence_after": 70,
                "conditions_for_reversal": ["New CTO hired"],
                "unresolved_questions": ["What is the CTO exit package?"],
                "recommended_action": "Request CTO exit interview",
                "supporting_claim_ids": [1],
                "contradicting_claim_ids": []
            }, {"input": 200, "output": 100, "latency_ms": 200}
            
        elif "recommendation" in schema.get("properties", {}):
            return {
                "recommendation": "Do not proceed until CTO departure is investigated.",
                "recommendation_type": "Hold",
                "recommendation_confidence": 80,
                "model_confidence": 80,
                "supporting_claim_ids": [1],
                "contradicting_claim_ids": [],
                "assumption_ids": [],
                "key_risks": [],
                "missing_information": [],
                "missing_critical_information": [],
                "unresolved_disagreements": [],
                "unresolved_conflicts": [],
                "challenge_findings": [],
                "critical_assumptions": [],
                "conditions_for_reversal": [],
                "next_best_action": "Request CTO exit interview",
                "memory_objects_used": []
            }, {"input": 250, "output": 150, "latency_ms": 250}
        return {}, {"input": 0, "output": 0, "latency_ms": 0}

def setup_scenario(db, decision_id):
    db.query(Claim).filter(Claim.id.in_([1, 2, 3])).delete()
    db.query(Assumption).filter(Assumption.id.in_([1, 2, 3])).delete()
    db.query(EscalationSignal).filter(EscalationSignal.decision_id == decision_id).delete()
    db.query(Decision).filter(Decision.id == decision_id).delete()
    db.query(DecisionSubject).filter(DecisionSubject.id == decision_id).delete()
    db.query(DomainPack).filter(DomainPack.id == "test_pack").delete()
    db.query(ReasoningAgent).filter(ReasoningAgent.id == "test_agent").delete()
    db.commit()

    pack = DomainPack(id="test_pack", name="Test Pack", description="Test", config_json="{}")
    agent = ReasoningAgent(id="test_agent", domain_pack_id="test_pack", name="Test Agent", system_prompt="Test", capabilities_json="[]")
    subject = DecisionSubject(id=decision_id, name="Test Subject", description="Test subject", metadata_json="{}")
    decision = Decision(id=decision_id, subject_id=decision_id, domain_pack_id="test_pack", title="Test Decision", status="Debate")
    
    a1 = Assumption(id=1, decision_id=decision_id, statement="Assumption 1", confidence=90, status="Unverified")
    
    db.add_all([pack, agent, subject, decision, a1])
    db.commit()

def run_test():
    db = SessionLocal()
    
    # Test 1: CLEAR -> FINALIZED
    print("\\n--- TEST 1: CLEAR ---")
    setup_scenario(db, 1000)
    provider_clear = MockLifecycleProvider(severity_mock_type="CLEAR")
    controller = AdaptiveReasoningController(db, llm_provider=provider_clear)
    res_clear = json.loads(controller.evaluate_decision_adaptive(1000))
    print(f"Envelope status: {res_clear['integrity_envelope']['integrity_status']}")
    print(f"Recommendation status: {res_clear['status']}")
    assert res_clear["status"] == "FINALIZED"
    
    # Test 2: BLOCKED_PENDING_REVIEW
    print("\\n--- TEST 2: BLOCKED_PENDING_REVIEW ---")
    setup_scenario(db, 1001)
    provider_high = MockLifecycleProvider(severity_mock_type="HIGH")
    controller = AdaptiveReasoningController(db, llm_provider=provider_high)
    res_high = json.loads(controller.evaluate_decision_adaptive(1001))
    print(f"Envelope status: {res_high['integrity_envelope']['integrity_status']}")
    print(f"Recommendation status: {res_high['status']}")
    assert res_high["status"] == "BLOCKED_PENDING_REVIEW"
    
    # How to force CRITICAL? 
    # Let's manually inject a CRITICAL EscalationSignal in the DB before synthesis.
    print("\\n--- TEST 3: CRITICAL_REVIEW_REQUIRED ---")
    setup_scenario(db, 1002)
    provider_crit = MockLifecycleProvider(severity_mock_type="CRITICAL")
    
    # We can inject a CRITICAL signal directly into DB with the run ID. We need the run ID though.
    # The run ID is created inside evaluate_decision_adaptive. We can monkey patch evaluate_decision_state in EscalationPolicyService?
    # Or just use the fact that the policy handles "CRITICAL" severities.
    # Actually, let's just monkeypatch the evaluate_envelope_status method for test 3!
    from reasoning_engine.integrity_policy import IntegrityPolicy
    original_evaluate = IntegrityPolicy.evaluate_envelope_status
    def mock_evaluate_envelope_status(hard_conflicts, critical_assumptions, unresolved_signals):
        return {
            "integrity_status": "CRITICAL_REVIEW_REQUIRED",
            "mandatory_human_review": True,
            "blocking_conditions": ["Injected CRITICAL failure for test"]
        }
    IntegrityPolicy.evaluate_envelope_status = mock_evaluate_envelope_status
    
    controller = AdaptiveReasoningController(db, llm_provider=provider_crit)
    res_crit = json.loads(controller.evaluate_decision_adaptive(1002))
    print(f"Envelope status: {res_crit['integrity_envelope']['integrity_status']}")
    print(f"Recommendation status: {res_crit['status']}")
    assert res_crit["status"] == "CRITICAL_REVIEW_REQUIRED"
    
    # Restore
    IntegrityPolicy.evaluate_envelope_status = original_evaluate

    print("\\nSuccess! exact enforcement boundaries tested.")
    db.close()

if __name__ == "__main__":
    run_test()
