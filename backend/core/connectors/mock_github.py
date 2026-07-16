import asyncio
from typing import Dict, Any, List
from core.connectors.base import BaseConnector

class MockGitHubConnector(BaseConnector):
    """
    A simulated GitHub connector for tracking engineering velocity and talent signals.
    """
    
    @property
    def connector_name(self) -> str:
        return "GitHubInsightsAPI"

    async def fetch_intelligence(self) -> List[Dict[str, Any]]:
        await asyncio.sleep(0.5)
        return [
            {
                "type": "repo_activity",
                "repo_name": "NovaAI/core",
                "commit_count": 45,
                "target_company_id": 1,
                "summary": "Engineering velocity spiked 300% this week.",
                "confidence": 92,
                "url": "https://github.com/NovaAI/core"
            }
        ]

    def normalize_to_events(self, raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for item in raw_data:
            normalized.append({
                "event_type": "ENGINEERING_VELOCITY_UPDATE",
                "entity_type": "Company",
                "entity_id": item["target_company_id"],
                "metadata": {
                    "headline": f"GitHub Activity: {item['repo_name']}",
                    "summary": item["summary"],
                    "source": item["url"],
                    "confidence": item["confidence"],
                    "impact_assessment": "POSITIVE_SIGNAL"
                }
            })
        return normalized
