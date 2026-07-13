from pydantic import BaseModel
from typing import List, Optional

class DiligenceTaskOutput(BaseModel):
    id: str
    task: str
    category: str
    objective: str
    owner: str
    priority: str # Low, Medium, High, Critical
    status: str # Not Started, In Progress, Blocked, Complete
    evidence_required: str
    expected_output: str
    deadline_suggestion: str
    ic_relevance: str

class EvidenceItemOutput(BaseModel):
    id: str
    evidence_name: str
    evidence_type: str
    linked_claim_or_risk: str
    confidence_level: str
    verification_status: str # Missing, Requested, Received, Verified, Contradictory, Insufficient
    source: str
    date_collected: str
    notes: str
    impact_on_recommendation: str

class ClaimVerificationOutput(BaseModel):
    id: str
    claim_text: str
    claim_type: str
    current_evidence_level: str
    verification_status: str
    evidence_required: str
    founder_question: str
    customer_question: Optional[str]
    data_room_document_required: str
    risk_if_unverified: str
    effect_on_recommendation: str

class FounderFollowupOutput(BaseModel):
    id: str
    category: str
    question: str
    why_it_matters: str

class CustomerReferenceOutput(BaseModel):
    id: str
    category: str
    question: str
    what_to_listen_for: str

class DataRoomRequestOutput(BaseModel):
    id: str
    document_requested: str
    category: str
    why_it_matters: str
    priority: str
    linked_risk_or_claim: str
    status: str

class RiskResolutionOutput(BaseModel):
    id: str
    risk_name: str
    severity: str
    current_status: str # Open, Under Review, Evidence Requested, Partially Resolved, Resolved, Escalated
    evidence_needed: str
    diligence_action: str
    owner: str
    deadline: str
    resolution_condition: str
    impact_if_unresolved: str

class ICReadinessOutput(BaseModel):
    ic_readiness_score: int
    readiness_verdict: str
    readiness_blockers: List[str]
    next_best_action: str

class DiligencePlanOutput(BaseModel):
    deal_id: int
    company_name: str
    ic_readiness_score: int
    diligence_status: str
    final_diligence_verdict: str
    
    priority_tasks: List[DiligenceTaskOutput]
    claim_verifications: List[ClaimVerificationOutput]
    founder_followups: List[FounderFollowupOutput]
    customer_reference_questions: List[CustomerReferenceOutput]
    data_room_requests: List[DataRoomRequestOutput]
    risk_resolution_plan: List[RiskResolutionOutput]
    evidence_items: List[EvidenceItemOutput]
