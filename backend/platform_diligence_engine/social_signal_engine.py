from ai_providers.router import router

def run_social_signal_research(deal_name: str, config: dict) -> list:
    result = router.execute_task("platform_social_research", deal_name)
    return result.get("data", {}).get("findings", [])
