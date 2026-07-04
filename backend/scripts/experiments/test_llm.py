import sys, os, time
sys.path.insert(0, os.path.abspath('.'))
from core.config import settings
from services.llm_provider import LLMProvider

try:
    t0 = time.time()
    res = LLMProvider.generate_structured(
        system_prompt="You are a ping test.",
        user_prompt="Reply with {'status': 'ok'}.",
        schema={"type": "object", "properties": {"status": {"type": "string"}}},
        max_retries=1
    )
    latency = int((time.time() - t0) * 1000)
    print("LIVE PROVIDER RESPONSE: SUCCESS")
    print(f"MODEL: {settings.APEX_REASONING_MODEL}")
    print(f"LATENCY: {latency}ms")
except Exception as e:
    latency = int((time.time() - t0) * 1000)
    print("LIVE PROVIDER RESPONSE: FAIL")
    print(f"MODEL: {settings.APEX_REASONING_MODEL}")
    print(f"LATENCY: {latency}ms")
    print(f"ERROR: {e}")
