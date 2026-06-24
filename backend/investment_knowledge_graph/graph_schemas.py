from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class GraphEntity(BaseModel):
    entity_id: str
    entity_type: str
    name: str
    description: Optional[str] = None
    confidence: int = 100
    source_module: str
    source_reference: Optional[str] = None
    created_at: str
    updated_at: str

class GraphRelationship(BaseModel):
    relationship_id: str
    from_entity_id: str
    to_entity_id: str
    relationship_type: str
    evidence: Optional[str] = None
    confidence: int = 100
    source_reference: Optional[str] = None
    decision_relevance: Optional[str] = None

class SimilarDeal(BaseModel):
    company_name: str
    similarity_score: int
    why_similar: str
    key_differences: str
    useful_benchmark_reason: str
    relevant_risks: List[str]
    decision_context: str

class PatternFinding(BaseModel):
    pattern_id: str
    pattern_type: str
    description: str
    deals_affected: List[str]
    evidence: str
    confidence: int
    implication: str
    recommended_process_change: Optional[str] = None

class SourceReliabilityScore(BaseModel):
    source_type: str
    average_reliability: int
    common_issues: List[str]
    decision_usefulness: str
    confidence_adjustment: int

class DecisionMemoryRecord(BaseModel):
    memory_id: str
    deal_id: str
    company_name: str
    deal_type: str
    recommendation: str
    confidence: int
    evidence_score: int
    ic_readiness: str
    fund_fit: str
    red_team_severity: str
    partner_support: str
    fund_math_result: str
    decision_blockers: List[str]
    next_action: str
    what_changed_the_decision: str
    created_at: str

class LearningNode(BaseModel):
    learning_id: str
    learning: str
    why_it_matters: str
    evidence: str
    suggested_workflow_change: str
    priority: str
    affected_modules: List[str]
