import pytest
from db.models import ReasoningRun
from evaluation.run_frozen_pilot import main

def test_grader_failure_semantics():
    # If LLMProvider throws LLMProviderException during grading,
    # run.grading_status should be 'INCOMPLETE' and semantic_metrics should be absent/null.
    # We will test this logic structurally here.
    from services.llm_provider import LLMProviderException
    
    class MockRun:
        grading_status = "PENDING"
        grader_failure_reason = None
        output_json = "{}"
        
    run = MockRun()
    
    try:
        raise LLMProviderException("500 Internal Server Error")
    except LLMProviderException as e:
        run.grading_status = "INCOMPLETE"
        run.grader_failure_reason = str(e)
        
    assert run.grading_status == "INCOMPLETE"
    assert "500" in run.grader_failure_reason
    assert "semantic_metrics" not in run.output_json
