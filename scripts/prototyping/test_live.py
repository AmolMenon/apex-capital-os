import asyncio
import os
import sys
import logging

logging.basicConfig(level=logging.INFO)
sys.path.append(os.path.abspath("backend"))

os.environ["APP_MODE"] = "real"
os.environ["ENABLE_REAL_LLM"] = "true"

from agentic_workflow_engine.agent_orchestrator import orchestrator

async def run():
    print("Testing live workflow...")
    run_obj = await orchestrator.run_full_workflow("1", "Sarvam AI")
    print(f"Status: {run_obj.status}")
    print(f"Fallback used: {run_obj.workflow_mode}")

asyncio.run(run())
