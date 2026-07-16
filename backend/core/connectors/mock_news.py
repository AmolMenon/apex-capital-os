import asyncio
from typing import Dict, Any, List
from core.connectors.base import BaseConnector

class MockNewsConnector(BaseConnector):
    """
    A simulated news connector for demonstration purposes.
    In a real system, this would call RSS feeds, Google News APIs, etc.
    """
    
    @property
    def connector_name(self) -> str:
        return "GlobalNewsAPI"

    async def fetch_intelligence(self) -> List[Dict[str, Any]]:
        # Simulate network delay
        await asyncio.sleep(1)
        return [
            {
                "topic": "Competitor Fundraise",
                "content": "Stripe raises new round at $65B valuation.",
                "target_company_id": 1, 
                "confidence": 95,
                "url": "https://news.example.com/stripe-65b"
            },
            {
                "topic": "Executive Hiring",
                "content": "Acme Corp (Portfolio) hires former Google VP as CTO.",
                "target_company_id": 4, 
                "confidence": 99,
                "url": "https://news.example.com/acme-cto"
            }
        ]

    def normalize_to_events(self, raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for item in raw_data:
            event_type = "MARKET_SIGNAL"
            if item["topic"] == "Executive Hiring":
                event_type = "PORTFOLIO_SIGNAL"
                
            normalized.append({
                "event_type": event_type,
                "entity_type": "Company",
                "entity_id": item["target_company_id"],
                "metadata": {
                    "headline": item["topic"],
                    "summary": item["content"],
                    "source": item["url"],
                    "confidence": item["confidence"],
                    "impact_assessment": "REQUIRES_REVIEW"
                }
            })
        return normalized
