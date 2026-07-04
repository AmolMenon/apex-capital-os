import os
import json
import logging
import time
from typing import Dict, Any, List, Optional
import requests
import google.generativeai as genai

from core.config import settings

logger = logging.getLogger(__name__)

class LLMProviderException(Exception):
    pass

class BaseLLMProvider:
    def generate_structured(self, system_prompt: str, user_prompt: str, schema: dict, model_name: str = None) -> tuple[dict, dict]:
        raise NotImplementedError
        
    def generate_text(self, system_prompt: str, user_prompt: str, model_name: str = None) -> tuple[str, dict]:
        raise NotImplementedError

class LLMProvider(BaseLLMProvider):
    """
    Unified LLM Provider Interface.
    Enforces structured JSON output, retries, timeout handling, and graceful failures.
    """
    
    @staticmethod
    def is_live_mode() -> bool:
        """Checks if the system is explicitly running in live LLM mode."""
        return settings.APEX_LLM_MODE == "live"
        
    def generate_structured(self, system_prompt: str, user_prompt: str, schema: Dict[str, Any], max_retries: int = 2, model_name: str = None) -> tuple[Dict[str, Any], Dict[str, Any]]:
        """
        Calls the LLM and enforces JSON output matching the provided schema.
        """
        is_live = self.is_live_mode()
        api_key = os.environ.get("GEMINI_API_KEY") or settings.GEMINI_API_KEY
        model_name = model_name or settings.APEX_REASONING_MODEL
        
        if is_live and not api_key:
            raise LLMProviderException(
                "LIVE MODEL VERIFICATION: BLOCKED BY MISSING CREDENTIAL\n"
                "SYSTEM IS IN LIVE MODE BUT NO API KEY CONFIGURED. "
                "Apex refuses to fall back to mocked reasoning. "
                "Configure GEMINI_API_KEY environment variable to proceed."
            )
            
        if not is_live:
            raise LLMProviderException("LLMProvider used in non-live mode! Use DeterministicTestProvider instead.")
        # (Test implementation moved to DeterministicTestProvider)

        # Live Mode Implementation
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        
        # We instruct Gemini to return JSON and provide the schema in the prompt
        full_system = f"{system_prompt}\n\nCRITICAL INSTRUCTION: You MUST output ONLY valid JSON matching this schema:\n{json.dumps(schema)}"
        
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"{full_system}\n\n{user_prompt}"}]
                }
            ],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }
        
        import random
        max_total_attempts = max_retries + 1
        for attempt in range(max_total_attempts):
            try:
                t0 = time.time()
                response = requests.post(url, json=payload, timeout=30)
                
                if response.status_code != 200:
                    error_msg = f"LLM API Error: {response.status_code} - {response.text}"
                    error_class = "UNKNOWN_ERROR"
                    if response.status_code in [401, 403]:
                        error_class = "AUTHENTICATION_FAILURE"
                    elif response.status_code == 400:
                        error_class = "INVALID_REQUEST"
                    elif response.status_code == 429:
                        if "GenerateRequestsPerDay" in response.text or "per day" in response.text.lower():
                            error_class = "DAILY_QUOTA_EXHAUSTED"
                        elif "model" in response.text.lower() and "quota" in response.text.lower() and "zero" in response.text.lower():
                            error_class = "MODEL_QUOTA_ZERO"
                        elif "tpm" in response.text.lower() or "tokens per minute" in response.text.lower():
                            error_class = "TRANSIENT_TPM_LIMIT"
                        else:
                            error_class = "TRANSIENT_RPM_LIMIT"
                    elif response.status_code >= 500:
                        error_class = "SERVER_ERROR"
                        
                    if error_class in ["DAILY_QUOTA_EXHAUSTED", "MODEL_QUOTA_ZERO", "AUTHENTICATION_FAILURE", "INVALID_REQUEST"]:
                        raise LLMProviderException(f"FAIL FAST [{error_class}]: {error_msg}")
                        
                    if attempt == max_total_attempts - 1:
                        raise LLMProviderException(f"MAX RETRIES EXCEEDED [{error_class}]: {error_msg}")
                        
                    base_delay = min(60, 2 ** attempt)
                    jitter = random.uniform(0, 0.2 * base_delay)
                    sleep_time = base_delay + jitter
                    
                    try:
                        resp_data = response.json()
                        for detail in resp_data.get("error", {}).get("details", []):
                            if detail.get("@type") == "type.googleapis.com/google.rpc.RetryInfo":
                                delay_str = detail.get("retryDelay", "0s")
                                if delay_str.endswith("s"):
                                    sleep_time = max(sleep_time, float(delay_str[:-1]))
                    except Exception:
                        pass
                        
                    print(f"Transient error ({error_class}). Sleeping for {sleep_time:.2f} seconds... (Attempt {attempt+1})")
                    time.sleep(sleep_time)
                    continue
                    
                data = response.json()
                
                try:
                    text_response = data['candidates'][0]['content']['parts'][0]['text']
                    if text_response.startswith("```json"):
                        text_response = text_response[7:-3]
                    elif text_response.startswith("```"):
                        text_response = text_response[3:-3]
                        
                    parsed_json = json.loads(text_response.strip())
                    usage = data.get("usageMetadata", {})
                    token_info = {
                        "input": usage.get("promptTokenCount", 0),
                        "output": usage.get("candidatesTokenCount", 0),
                        "latency_ms": int((time.time() - t0) * 1000)
                    }
                    return parsed_json, token_info
                except (KeyError, IndexError, json.JSONDecodeError) as e:
                    if attempt == max_total_attempts - 1:
                        raise LLMProviderException(f"Failed to parse LLM response into JSON: {str(e)}\\nRaw Response: {data}")
                    time.sleep(1)
                    continue
                    
            except requests.exceptions.RequestException as e:
                error_class = "NETWORK_ERROR"
                if attempt == max_total_attempts - 1:
                    raise LLMProviderException(f"MAX RETRIES EXCEEDED [{error_class}]: Network error connecting to LLM provider: {str(e)}")
                base_delay = min(60, 2 ** attempt)
                jitter = random.uniform(0, 0.2 * base_delay)
                time.sleep(base_delay + jitter)
                
        raise LLMProviderException("Maximum retries exceeded")

class DeterministicTestProvider(BaseLLMProvider):
    """
    Test Provider that returns deterministic outputs without hitting the LLM API.
    Zero-live-call guarantee.
    """
    def generate_structured(self, system_prompt: str, user_prompt: str, schema: Dict[str, Any], max_retries: int = 2, model_name: str = None) -> tuple[Dict[str, Any], Dict[str, Any]]:
        # Explicit Test Mode Path
        if "items" in schema.get("properties", {}):
            return {"items": [
                {"statement": "Nexus generated $1.5M in ARR last year.", "provenance_type": "Source Fact", "confidence_score": 99},
                {"statement": "We will hit $10M ARR next year.", "provenance_type": "Assumption", "confidence_score": 85},
                {"statement": "Our CTO left last week due to disagreements.", "provenance_type": "Extracted Claim", "confidence_score": 90}
            ]}, {"input": 100, "output": 50, "latency_ms": 100}
        elif "position" in schema.get("properties", {}):
            scenario = os.environ.get("MOCK_SCENARIO", "BLOCKED")
            if scenario == "CLEAR":
                return {
                    "position": "Invest. Team is strong and market is growing.",
                    "confidence": 95,
                    "supporting_claim_ids": [1],
                    "contradicting_claim_ids": [],
                    "assumption_ids": [],
                    "key_risks": [],
                    "missing_information": [],
                    "questions_to_resolve": [],
                    "conditions_that_would_change_position": []
                }, {"input": 150, "output": 80, "latency_ms": 150}
            else:
                return {
                    "position": "Hold pending CTO leave clarification and churn data.",
                    "confidence": 80,
                    "supporting_claim_ids": [1],
                    "contradicting_claim_ids": [2],
                    "assumption_ids": [1, 2],
                    "key_risks": ["Leadership instability (CTO leave)", "Revenue quality ($400k non-recurring)"],
                    "missing_information": ["Customer churn data"],
                    "questions_to_resolve": [],
                    "conditions_that_would_change_position": []
                }, {"input": 150, "output": 80, "latency_ms": 150}
        elif "target_id" in schema.get("properties", {}):
            return {
                "target_id": "claim:2",
                "original_position": "Hold",
                "challenge_findings": "Found $400k of non-recurring revenue in financials, contradicting the $1.5M ARR claim.",
                "new_evidence_relationships": ["challenge_finding:1->recommendation:1"],
                "assumption_status_change": "Invalidated",
                "risk_status_change": "Materialized",
                "position_before": "Invest",
                "position_after": "Hold",
                "confidence_before": 90,
                "confidence_after": 75,
                "conditions_for_reversal": ["SaaS revenue displaces professional services"],
                "unresolved_questions": ["What is true gross retention?"],
                "recommended_action": "Request true software ARR breakdown",
                "supporting_claim_ids": [1],
                "contradicting_claim_ids": [2]
            }, {"input": 200, "output": 100, "latency_ms": 200}
        elif "recommendation" in schema.get("properties", {}):
            scenario = os.environ.get("MOCK_SCENARIO", "BLOCKED")
            if scenario == "CLEAR":
                return {
                    "recommendation": "Proceed with Series A investment. Growth is strong and market position is defensible.",
                    "recommendation_type": "Invest",
                    "recommendation_confidence": 95,
                    "model_confidence": 95,
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
                    "conditions_for_reversal": ["Growth drops below 50% YoY"],
                    "next_best_action": "Issue Term Sheet",
                    "memory_objects_used": []
                }, {"input": 250, "output": 150, "latency_ms": 250}
            else:
                return {
                    "recommendation": "Do not proceed until CTO departure and ARR discrepancies are resolved.",
                    "recommendation_type": "Hold",
                    "recommendation_confidence": 75,
                    "model_confidence": 85,
                    "supporting_claim_ids": [1],
                    "contradicting_claim_ids": [2],
                    "assumption_ids": [1, 2, 3],
                    "key_risks": ["Leadership instability (CTO leave)", "Revenue quality ($400k non-recurring)"],
                    "missing_information": ["Customer churn data"],
                    "missing_critical_information": ["Customer churn data", "Reason for CTO leave of absence"],
                    "unresolved_disagreements": ["ARR vs Total Revenue definition"],
                    "unresolved_conflicts": ["Claim 1 ($1.5M ARR) conflicts with Claim 2 ($400k PS)"],
                    "challenge_findings": ["Found $400k of non-recurring revenue in financials, contradicting the $1.5M ARR claim."],
                    "critical_assumptions": ["Nexus will hit $10M ARR next year (6x growth)"],
                    "conditions_for_reversal": ["CTO returns or strong replacement hired", "Provide historical churn data showing >95% NDR"],
                    "next_best_action": "Request true software ARR breakdown and churn data",
                    "memory_objects_used": []
                }, {"input": 250, "output": 150, "latency_ms": 250}
        return {}, {"input": 0, "output": 0, "latency_ms": 0}
