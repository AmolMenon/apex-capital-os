from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class ConversationMessageOutput(BaseModel):
    speaker: str = Field(default="Unknown")
    role: str = Field(default="Unknown")
    timestamp: str = Field(default="")
    message_text: str = Field(default="")
    detected_topic: str = Field(default="")
    linked_claim: str = Field(default="")

class FollowupItemOutput(BaseModel):
    id: str = Field(default="")
    followup_item: str = Field(default="")
    requested_by: str = Field(default="Investor")
    promised_by: str = Field(default="Founder")
    due_date: str = Field(default="")
    status: str = Field(default="Open")
    linked_risk: str = Field(default="")
    importance: str = Field(default="Medium")
    impact_if_unresolved: str = Field(default="")

class ContradictionOutput(BaseModel):
    id: str = Field(default="")
    contradiction_title: str = Field(default="")
    source_A: str = Field(default="")
    source_B: str = Field(default="")
    severity: str = Field(default="Medium")
    why_it_matters: str = Field(default="")
    decision_impact: str = Field(default="")
    followup_question: str = Field(default="")
    recommended_diligence_action: str = Field(default="")

class ExtractedEvidenceOutput(BaseModel):
    id: str = Field(default="")
    evidence_text: str = Field(default="")
    evidence_type: str = Field(default="")
    source_conversation: str = Field(default="")
    speaker: str = Field(default="Founder")
    confidence: str = Field(default="Medium")
    supports_or_weakens: str = Field(default="Neutral")
    linked_claim: str = Field(default="")
    verification_status: str = Field(default="Needs verification")

class InvestorQuestionOutput(BaseModel):
    question_text: str = Field(default="")
    category: str = Field(default="")
    importance: str = Field(default="Medium")
    answered_status: str = Field(default="No")
    answer_quality: str = Field(default="Missing")
    linked_answer: str = Field(default="")
    followup_required: bool = Field(default=False)

class FounderResponseAnalysisOutput(BaseModel):
    strongest_answers: List[str] = Field(default_factory=list)
    weakest_answers: List[str] = Field(default_factory=list)
    evasive_answers: List[str] = Field(default_factory=list)
    honest_uncertainty: List[str] = Field(default_factory=list)
    data_backed_answers: List[str] = Field(default_factory=list)
    vague_claims: List[str] = Field(default_factory=list)

class ConversationScorecardOutput(BaseModel):
    directness: int = Field(default=0)
    specificity: int = Field(default=0)
    evidence_quality: int = Field(default=0)
    clarity: int = Field(default=0)
    responsiveness: int = Field(default=0)
    credibility: int = Field(default=0)
    consistency: int = Field(default=0)
    investor_readiness: int = Field(default=0)

class ConversationDecisionImpactOutput(BaseModel):
    recommendation_adjustment: str = Field(default="No Change")
    evidence_score_impact: str = Field(default="Neutral")
    ic_readiness_impact: str = Field(default="Neutral")
    confidence_impact: str = Field(default="Neutral")
    decision_gates_triggered: List[str] = Field(default_factory=list)
    final_explanation: str = Field(default="")

class ConversationSignalOutput(BaseModel):
    positive_signals: List[str] = Field(default_factory=list)
    negative_signals: List[str] = Field(default_factory=list)

class ConversationRoundOutput(BaseModel):
    round_id: str = Field(default="")
    title: str = Field(default="")
    conversation_type: str = Field(default="")
    date: str = Field(default="")
    participants: List[str] = Field(default_factory=list)
    raw_text: str = Field(default="")
    parsed_messages: List[ConversationMessageOutput] = Field(default_factory=list)
    round_score: int = Field(default=0)
    key_signal: str = Field(default="")

class ConversationIntelligenceOutput(BaseModel):
    deal_id: str = Field(default="")
    company_name: str = Field(default="")
    conversation_rounds: List[ConversationRoundOutput] = Field(default_factory=list)
    
    # Scores
    founder_response_quality_score: int = Field(default=0)
    clarity_score: int = Field(default=0)
    responsiveness_score: int = Field(default=0)
    credibility_score: int = Field(default=0)
    evidence_provided_score: int = Field(default=0)
    contradiction_risk_score: int = Field(default=0)
    overall_conversation_score: int = Field(default=0)
    
    # Scorecard Breakdowns
    scorecard: ConversationScorecardOutput = Field(default_factory=ConversationScorecardOutput)
    founder_analysis: FounderResponseAnalysisOutput = Field(default_factory=FounderResponseAnalysisOutput)
    investor_questions: List[InvestorQuestionOutput] = Field(default_factory=list)

    # Signals
    positive_signals: List[str] = Field(default_factory=list)
    negative_signals: List[str] = Field(default_factory=list)
    contradictions: List[ContradictionOutput] = Field(default_factory=list)
    evidence_extracted: List[ExtractedEvidenceOutput] = Field(default_factory=list)
    open_followups: List[FollowupItemOutput] = Field(default_factory=list)
    
    # Impact
    decision_impact: ConversationDecisionImpactOutput = Field(default_factory=ConversationDecisionImpactOutput)
    recommendation_adjustment: str = Field(default="No Change")
    summary: str = Field(default="")

class ConversationTimelineEvent(BaseModel):
    id: str = Field(default="")
    date: str = Field(default="")
    event_type: str = Field(default="")
    description: str = Field(default="")
    signal: str = Field(default="Neutral") # Positive / Neutral / Negative / Needs Follow-up
    linked_page: str = Field(default="")

class TranscriptUploadInput(BaseModel):
    title: str
    conversation_type: str
    date: str
    participants: str
    raw_text: str
    linked_diligence_task: Optional[str] = None
    linked_claim: Optional[str] = None
    linked_risk: Optional[str] = None
