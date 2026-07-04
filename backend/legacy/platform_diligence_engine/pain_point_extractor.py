import json
from ai_providers.router import router

def extract_pain_points(deal_name: str, signals: list) -> list:
    context = f"{deal_name}|||{json.dumps(signals)}"
    result = router.execute_task("platform_pain_points", context)
    return result.get("data", {}).get("pain_points", [])
