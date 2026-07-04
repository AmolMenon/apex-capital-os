
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ClaimAuditRecord(BaseModel):
    claim_text: str
    claim_type: str # e.g., verified public fact, assumption, unknown
    source: str
    confidence: str
    verification_status: str
    decision_relevance: str
    risk_if_wrong: str
    reviewer_required: bool

class TrustScore(BaseModel):
    entity_id: str
    entity_type: str
    overall_trust_score: int
    trust_level: str
    evidence_quality_score: int
    grounding_score: int
    source_confidence_score: int
    assumption_risk_score: int
    unknowns_risk_score: int
    hallucination_risk: str
    deterministic_gates_passed: bool
    review_required: bool
    safe_to_share: str
    reasons: List[str]
    metadata: Dict[str, Any]

class ProvenanceRecord(BaseModel):
    output_id: str
    module: str
    context: str
    source_inputs_used: List[str]
    evidence_items_used: List[str]
    model_provider_used: str
    prompt_version: str
    generated_timestamp: datetime
    fallback_status: bool
    deterministic_rules_applied: List[str]
    reviewer_status: str
    last_modified_timestamp: datetime

class DeterministicGateAudit(BaseModel):
    gate_name: str
    applied: bool
    result: str
    reason: str
    affected_output: str
    severity: str

class ReviewerStatusUpdate(BaseModel):
    reviewer_status: str
    comments: Optional[str] = None
