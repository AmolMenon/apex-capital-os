import asyncio
from typing import Dict, Any, List
from core.connectors.base import BaseConnector

class MockLinkedInConnector(BaseConnector):
    """
    A simulated LinkedIn connector for tracking talent and hiring signals.
    """
    
    @property
    def connector_name(self) -> str:
        return "LinkedInTalentAPI"

    async def fetch_intelligence(self) -> List[Dict[str, Any]]:
        await asyncio.sleep(0.8)
        return [
            {
                "type": "talent_departure",
                "role": "VP of Engineering",
                "target_company_id": 1,
                "summary": "Key talent departure: VP of Engineering left to start stealth AI startup.",
                "confidence": 98,
                "url": "https://linkedin.com/company/nova-ai/people"
            }
        ]

    def normalize_to_events(self, raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for item in raw_data:
            normalized.append({
                "event_type": "TALENT_SIGNAL",
                "entity_type": "Company",
                "entity_id": item["target_company_id"],
                "metadata": {
                    "headline": f"Talent Signal: {item['role']} Departure",
                    "summary": item["summary"],
                    "source": item["url"],
                    "confidence": item["confidence"],
                    "impact_assessment": "NEGATIVE_SIGNAL"
                }
            })
        return normalized
