from .graph_store import GRAPH_DB
from typing import Dict, Any, List

class GraphQueryEngine:
    @staticmethod
    def get_company_graph(deal_id: str) -> Dict[str, Any]:
        # Return mock structures
        if not GRAPH_DB.is_built:
            GRAPH_DB.load_mock_fixtures()
            
        # Simplified: return the entire graph for the demo visualizer
        return {
            "nodes": [e.dict() for e in GRAPH_DB.entities.values()],
            "edges": [r.dict() for r in GRAPH_DB.relationships.values()]
        }
    
    @staticmethod
    def get_similar_deals(deal_id: str) -> List[Dict[str, Any]]:
        if not GRAPH_DB.is_built:
            GRAPH_DB.load_mock_fixtures()
            
        str_id = str(deal_id)
        if str_id in GRAPH_DB.similar_deals_cache:
            return [d.dict() for d in GRAPH_DB.similar_deals_cache[str_id]]
        return []

    @staticmethod
    def get_cross_deal_insights() -> Dict[str, Any]:
        if not GRAPH_DB.is_built:
            GRAPH_DB.load_mock_fixtures()
            
        return {
            "patterns": [p.dict() for p in GRAPH_DB.pattern_findings],
            "recurring_risks": GRAPH_DB.recurring_risks,
            "diligence_gaps": GRAPH_DB.diligence_gaps,
            "source_reliability": [s.dict() for s in GRAPH_DB.source_reliability],
            "decision_memory": [m.dict() for m in GRAPH_DB.decision_memory],
            "learning_loop": [l.dict() for l in GRAPH_DB.learning_nodes]
        }
