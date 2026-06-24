import json
from ai_providers.router import router

def analyze_sentiment(deal_name: str, signals: list) -> dict:
    context = f"{deal_name}|||{json.dumps(signals)}"
    result = router.execute_task("platform_sentiment_analysis", context)
    return result.get("data", {}).get("sentiment_summary", {
        "positive": 0, "negative": 0, "mixed": 0, "neutral": 0,
        "confidence": "low", "sample_size": len(signals),
        "strongest_themes": [], "weakest_themes": [],
        "the_good": [], "the_bad": [], "general_consensus": ""
    })
