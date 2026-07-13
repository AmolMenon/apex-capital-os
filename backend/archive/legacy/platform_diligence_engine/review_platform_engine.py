from ai_providers.router import router

def run_review_platform_research(deal_name: str, config: dict) -> list:
    result = router.execute_task("platform_review_research", deal_name)
    return result.get("data", {}).get("findings", [])
