from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class CopilotMetadata(BaseModel):
    deal_id: Optional[str] = None
    company_name: Optional[str] = None
    mode: str = "mock"
    provider_used: str = "mock"
    fallback_used: bool = False
    generated_at: str

class CopilotConfidence(BaseModel):
    level: str # High, Medium, Low
    score: int # 0-100
    reason: str

class EvidenceReference(BaseModel):
    label: str
    module: str # Web Research, Evidence Center, Agent Workflow, War Room, Red Team, Fund Math, Decision Engine, Memo
    claim: str
    confidence: str
    verification_status: str
    source_url: Optional[str] = None
    source_title: Optional[str] = None

class CopilotFollowUp(BaseModel):
    question: str
    reason: str

class CopilotAnswer(BaseModel):
    answer: str
    short_answer: str
    question_intent: str
    evidence_used: List[EvidenceReference]
    source_references: List[str]
    assumptions: List[str]
    unknowns: List[str]
    decision_impact: str
    recommended_next_action: str
    confidence: CopilotConfidence
    guardrail_flags: List[str]
    metadata: CopilotMetadata
    follow_up_questions: List[CopilotFollowUp]

class CopilotQuestion(BaseModel):
    question: str
    deal_id: Optional[str] = None
    
class QuestionIntent(BaseModel):
    intent_category: str
    requires_private_data: bool
    requires_fund_math: bool
    requires_red_team: bool

class RetrievedEvidence(BaseModel):
    evidence_text: str
    source_module: str
    confidence: str
    verification_status: str
    source_url: Optional[str] = None
    decision_relevance: str
    evidence_type: str # fact, claim, assumption, unknown

class CopilotMessage(BaseModel):
    role: str # user, copilot
    content: str
    timestamp: str
    fullAnswer: Optional[Dict[str, Any]] = None

class CopilotSession(BaseModel):
    session_id: str
    deal_id: Optional[str] = None
    messages: List[CopilotMessage]
    created_at: str
    last_updated: str
