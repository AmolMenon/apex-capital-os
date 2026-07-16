import asyncio
from typing import Dict, Any, List
from core.connectors.base import BaseConnector

class MockRegulatoryConnector(BaseConnector):
    """
    A simulated Regulatory filings connector (EDGAR, Companies House, etc.).
    """
    
    @property
    def connector_name(self) -> str:
        return "RegulatoryFilingsAPI"

    async def fetch_intelligence(self) -> List[Dict[str, Any]]:
        await asyncio.sleep(1.2)
        return [
            {
                "type": "form_d",
                "target_company_id": 1,
                "summary": "Form D filed: Indicates $15M raised in fresh capital.",
                "confidence": 100,
                "url": "https://sec.gov/edgar/search"
            }
        ]

    def normalize_to_events(self, raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for item in raw_data:
            normalized.append({
                "event_type": "REGULATORY_FILING",
                "entity_type": "Company",
                "entity_id": item["target_company_id"],
                "metadata": {
                    "headline": "New Regulatory Filing (Form D)",
                    "summary": item["summary"],
                    "source": item["url"],
                    "confidence": item["confidence"],
                    "impact_assessment": "MATERIAL_UPDATE"
                }
            })
        return normalized
