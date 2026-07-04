import pytest
from unittest.mock import patch, MagicMock
from services.llm_provider import LLMProvider, LLMProviderException

@patch('requests.post')
def test_fail_fast_daily_quota(mock_post, monkeypatch):
    monkeypatch.setattr("core.config.settings.APEX_LLM_MODE", "live")
    monkeypatch.setenv("GEMINI_API_KEY", "test_key")
    
    mock_resp = MagicMock()
    mock_resp.status_code = 429
    mock_resp.text = "GenerateRequestsPerDayPerProjectPerModel-FreeTier"
    mock_post.return_value = mock_resp
    
    provider = LLMProvider()
    with pytest.raises(LLMProviderException, match="FAIL FAST \\[DAILY_QUOTA_EXHAUSTED\\]"):
        provider.generate_structured("sys", "user", {"type": "object"}, max_retries=2)
        
    assert mock_post.call_count == 1

@patch('requests.post')
@patch('time.sleep')
def test_transient_retry(mock_sleep, mock_post, monkeypatch):
    monkeypatch.setattr("core.config.settings.APEX_LLM_MODE", "live")
    monkeypatch.setenv("GEMINI_API_KEY", "test_key")
    
    # First response fails with 500, second succeeds
    fail_resp = MagicMock()
    fail_resp.status_code = 500
    fail_resp.text = "Internal Server Error"
    
    succ_resp = MagicMock()
    succ_resp.status_code = 200
    succ_resp.json.return_value = {
        "candidates": [{"content": {"parts": [{"text": '{"result": "ok"}'}]}}],
        "usageMetadata": {}
    }
    
    mock_post.side_effect = [fail_resp, succ_resp]
    
    provider = LLMProvider()
    res, tokens = provider.generate_structured("sys", "user", {"type": "object"}, max_retries=2)
    
    assert res == {"result": "ok"}
    assert mock_post.call_count == 2
    assert mock_sleep.call_count == 1
