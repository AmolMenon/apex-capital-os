import json

DEFAULT_SOURCES = [
    {"name": "reddit", "enabled": True, "mode": "mock", "allowed_usage": "Public Search / Official API if configured", "note": "No private communities"},
    {"name": "x_twitter", "enabled": True, "mode": "mock", "allowed_usage": "Public Search", "note": "No logged-in scraping"},
    {"name": "linkedin", "enabled": True, "mode": "mock", "allowed_usage": "Public Search", "note": "Strict rate limits, no auth scraping"},
    {"name": "product_hunt", "enabled": True, "mode": "mock", "allowed_usage": "Public Search", "note": "Launch comments and alternatives"},
    {"name": "g2", "enabled": True, "mode": "mock", "allowed_usage": "Public Search", "note": "B2B SaaS reviews"},
    {"name": "capterra", "enabled": True, "mode": "mock", "allowed_usage": "Public Search", "note": "B2B SaaS reviews"},
    {"name": "trustpilot", "enabled": True, "mode": "mock", "allowed_usage": "Public Search", "note": "Consumer/B2C reviews"},
    {"name": "google_play_store", "enabled": True, "mode": "mock", "allowed_usage": "Official API / Search", "note": "Mobile app reviews"},
    {"name": "apple_app_store", "enabled": True, "mode": "mock", "allowed_usage": "Official API / Search", "note": "Mobile app reviews"},
    {"name": "youtube", "enabled": True, "mode": "mock", "allowed_usage": "Public Comments", "note": "Review video comments"},
    {"name": "hackernews", "enabled": True, "mode": "mock", "allowed_usage": "Official API", "note": "Tech credibility debates"},
    {"name": "github", "enabled": True, "mode": "mock", "allowed_usage": "Official API", "note": "Issues, PRs, Stars"},
    {"name": "stack_overflow", "enabled": True, "mode": "mock", "allowed_usage": "Official API", "note": "Developer pain points"},
    {"name": "public_forums", "enabled": True, "mode": "mock", "allowed_usage": "Public Search", "note": "Niche category forums"},
    {"name": "blogs", "enabled": True, "mode": "mock", "allowed_usage": "Public Search", "note": "Reviews, comparisons"},
    {"name": "public_web", "enabled": True, "mode": "mock", "allowed_usage": "Public Search", "note": "General search"},
]

def get_default_platform_sources():
    return DEFAULT_SOURCES
