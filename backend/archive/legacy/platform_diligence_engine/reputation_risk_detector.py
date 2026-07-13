import json
from ai_providers.router import router

def detect_reputation_risks(deal_name: str, signals: list) -> list:
    context = f"{deal_name}|||{json.dumps(signals)}"
    result = router.execute_task("platform_reputation_risks", context)
    return result.get("data", {}).get("reputation_risks", [])
