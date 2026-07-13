import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from platform_diligence_engine.platform_diligence_orchestrator import PlatformDiligenceOrchestrator
import asyncio
import json

async def main():
    orch = PlatformDiligenceOrchestrator()
    result = await orch.run_diligence(1001, "Sarvam AI")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
