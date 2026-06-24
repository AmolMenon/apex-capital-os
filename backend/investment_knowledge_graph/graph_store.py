from typing import List, Dict, Any, Optional
from .graph_schemas import (
    GraphEntity, GraphRelationship, SimilarDeal, PatternFinding, 
    SourceReliabilityScore, DecisionMemoryRecord, LearningNode
)
from .graph_fixtures import (
    MOCK_ENTITIES, MOCK_RELATIONSHIPS, MOCK_SIMILAR_DEALS, MOCK_PATTERN_FINDINGS,
    MOCK_RECURRING_RISKS, MOCK_DILIGENCE_GAPS, MOCK_SOURCE_RELIABILITY, 
    MOCK_DECISION_MEMORY, MOCK_LEARNING_NODES
)
import datetime

class GraphStore:
    def __init__(self):
        self.entities: Dict[str, GraphEntity] = {}
        self.relationships: Dict[str, GraphRelationship] = {}
        self.similar_deals_cache: Dict[str, List[SimilarDeal]] = {}
        self.pattern_findings: List[PatternFinding] = []
        self.recurring_risks: List[Dict[str, Any]] = []
        self.diligence_gaps: List[Dict[str, Any]] = []
        self.source_reliability: List[SourceReliabilityScore] = []
        self.decision_memory: List[DecisionMemoryRecord] = []
        self.learning_nodes: List[LearningNode] = []
        
        self.is_built = False
        self.last_rebuild = None
        
    def load_mock_fixtures(self):
        self.entities = {e["entity_id"]: GraphEntity(**e) for e in MOCK_ENTITIES}
        self.relationships = {r["relationship_id"]: GraphRelationship(**r) for r in MOCK_RELATIONSHIPS}
        
        self.similar_deals_cache = {}
        for deal_id, deals in MOCK_SIMILAR_DEALS.items():
            self.similar_deals_cache[deal_id] = [SimilarDeal(**d) for d in deals]
            
        self.pattern_findings = [PatternFinding(**p) for p in MOCK_PATTERN_FINDINGS]
        self.recurring_risks = MOCK_RECURRING_RISKS
        self.diligence_gaps = MOCK_DILIGENCE_GAPS
        self.source_reliability = [SourceReliabilityScore(**s) for s in MOCK_SOURCE_RELIABILITY]
        self.decision_memory = [DecisionMemoryRecord(**m) for m in MOCK_DECISION_MEMORY]
        self.learning_nodes = [LearningNode(**l) for l in MOCK_LEARNING_NODES]
        
        self.is_built = True
        self.last_rebuild = datetime.datetime.utcnow().isoformat() + "Z"

# Global singleton store
GRAPH_DB = GraphStore()
