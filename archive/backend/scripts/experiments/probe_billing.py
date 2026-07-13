import sys, os, time
sys.path.insert(0, os.path.abspath('.'))

from core.config import settings
from services.llm_provider import LLMProvider

print("STEP 1: VERIFY CREDENTIAL AND PROJECT CONFIGURATION")
has_key = bool(os.environ.get("GEMINI_API_KEY") or settings.GEMINI_API_KEY)
print(f"GEMINI_API_KEY PRESENT: {has_key}")
print(f"APEX_LLM_MODE: {settings.APEX_LLM_MODE}")
print(f"CONFIGURED PROVIDER: {settings.APEX_REASONING_PROVIDER}")
print(f"CONFIGURED REASONING MODEL: {settings.APEX_REASONING_MODEL}")
print(f"CONFIGURED GRADER MODEL: {settings.APEX_GRADER_MODEL}")

if not has_key:
    print("PROBE_FAILED: NO_API_KEY")
    sys.exit(1)

print("\nSTEP 2: ONE MINIMAL LIVE PROVIDER PROBE")
schema = {
    "type": "object",
    "properties": {"status": {"type": "string"}},
    "required": ["status"]
}

try:
    res, tokens = LLMProvider.generate_structured(
        "You are a system checking billing access.",
        "Reply with status: OK",
        schema,
        model_name=settings.APEX_REASONING_MODEL
    )
    print("BILLING_QUOTA_VERIFICATION_PROBE_SUCCESS")
    print(f"Result: {res}")
except Exception as e:
    print(f"BILLING_QUOTA_VERIFICATION_PROBE_FAILED: {e}")
    sys.exit(2)
