import asyncio
from typing import Dict, Any, List
from core.connectors.base import BaseConnector

class MockRSSConnector(BaseConnector):
    """
    A simulated RSS connector for competitor blogs and industry updates.
    """
    
    @property
    def connector_name(self) -> str:
        return "RSSFeeder"

    async def fetch_intelligence(self) -> List[Dict[str, Any]]:
        await asyncio.sleep(0.7)
        return [
            {
                "title": "Competitor DataScale launches new integration framework",
                "target_company_id": 1,
                "summary": "Competitor 'DataScale' announced a similar integration framework, reducing Nova AI's uniqueness.",
                "confidence": 85,
                "url": "https://datascale.example.com/blog/new-framework"
            }
        ]

    def normalize_to_events(self, raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for item in raw_data:
            normalized.append({
                "event_type": "NEWS_UPDATE",
                "entity_type": "Company",
                "entity_id": item["target_company_id"],
                "metadata": {
                    "headline": item["title"],
                    "summary": item["summary"],
                    "source": item["url"],
                    "confidence": item["confidence"],
                    "impact_assessment": "NEGATIVE_SIGNAL"
                }
            })
        return normalized
