from .graph_store import GRAPH_DB
from typing import Dict, Any

class GraphOrchestrator:
    @staticmethod
    def rebuild_full_graph() -> bool:
        # In a real environment, this would trigger Airflow/Celery tasks to hit OpenAI
        # and parse thousands of documents into nodes and edges.
        # For the demo, we load the deterministic high-fidelity fixtures.
        GRAPH_DB.load_mock_fixtures()
        return True

    @staticmethod
    def rebuild_deal_graph(deal_id: str) -> bool:
        if not GRAPH_DB.is_built:
            GRAPH_DB.load_mock_fixtures()
        return True

    @staticmethod
    def get_status() -> Dict[str, Any]:
        return {
            "status": "healthy",
            "graph_built": GRAPH_DB.is_built,
            "entities_count": len(GRAPH_DB.entities),
            "relationships_count": len(GRAPH_DB.relationships),
            "last_rebuild": GRAPH_DB.last_rebuild,
            "mock_fixtures_loaded": True,
            "routes_healthy": True
        }
