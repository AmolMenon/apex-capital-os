
from observability_engine.observability_schemas import SystemHealth, ErrorLog

MOCK_SYSTEM_HEALTH = SystemHealth(
    api_health="Healthy",
    database_health="Healthy",
    llm_health="Fallback Mock Mode Active",
    scraper_health="Fallback Mock Mode Active"
)

MOCK_ERRORS = [
    ErrorLog(
        error_id="ERR-102",
        route="/api/live-scraper",
        message="API Key Missing, defaulted to Mock",
        timestamp="2026-06-14T01:00:00Z"
    )
]

MOCK_PROVIDER_HEALTH = {
    "OpenAI": "Configured (Not used)",
    "Anthropic": "Configured (Not used)",
    "Gemini": "Mock Fallback",
    "Perplexity": "Mock Fallback"
}

MOCK_FEATURE_HEALTH = [
    {"feature": "Agentic Workflow", "status": "Healthy"},
    {"feature": "Data Room Parser", "status": "Healthy"},
    {"feature": "Fund Math", "status": "Healthy"}
]

MOCK_DEMO_RELIABILITY = {
    "status": "Ready for Demo",
    "warnings": ["Mock mode active for external sends"],
    "last_check": "2026-06-14T10:00:00Z"
}
