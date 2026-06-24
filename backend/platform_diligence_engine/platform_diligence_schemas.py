from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PlatformSource(BaseModel):
    id: str
    name: str
    is_enabled: bool = True
    mode: str = "mock" # "mock", "public_search", "official_api", "disabled"
    last_checked_at: Optional[str] = None
    setup_note: Optional[str] = None

class PlatformSearchQuery(BaseModel):
    platform: str
    query: str
    purpose: str

class PlatformSignalBase(BaseModel):
    company_name: Optional[str] = None
    platform: str
    source_url: Optional[str] = None
    source_title: Optional[str] = None
    published_at: Optional[str] = None
    snippet: str
    signal_type: str # e.g. customer_pain, competitor_complaint
    sentiment: str # positive, negative, mixed, neutral
    relevance_score: int
    confidence: str # high, medium, low
    verification_status: str # public_anecdote, needs_verification
    decision_impact: str # high, medium, low
    bias_warning: Optional[str] = None
    next_action: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class PlatformSignal(PlatformSignalBase):
    signal_id: str
    run_id: str
    deal_id: int

class PlatformMention(BaseModel):
    platform: str
    snippet: str
    url: Optional[str] = None

class PlatformSentimentSummary(BaseModel):
    positive: int = 0
    negative: int = 0
    mixed: int = 0
    neutral: int = 0
    confidence: str = "low"
    sample_size: int = 0
    strongest_themes: List[str] = Field(default_factory=list)
    weakest_themes: List[str] = Field(default_factory=list)
    the_good: List[str] = Field(default_factory=list)
    the_bad: List[str] = Field(default_factory=list)
    general_consensus: str = ""

class PainPointCluster(BaseModel):
    pain_point: str
    user_language: str
    example_snippets: List[str]
    frequency: str
    platforms: List[str]
    customer_persona: Optional[str] = None
    urgency: str
    willingness_to_pay_signal: Optional[str] = None
    existing_workaround: Optional[str] = None
    related_competitor: Optional[str] = None
    startup_relevance: str
    diligence_question: str

class CompetitorSignal(BaseModel):
    competitor_name: str
    praised_for: List[str]
    complaints: List[str]
    feature_gaps: List[str]
    pricing_pain: Optional[str] = None
    switching_triggers: List[str]
    market_whitespace: str
    diligence_question: str

class ReputationRisk(BaseModel):
    risk: str
    source: str
    severity: str # high, medium, low
    confidence: str
    verification_required: bool
    suggested_diligence_action: str

class ReviewInsight(BaseModel):
    positive_themes: List[str]
    negative_themes: List[str]
    pricing_complaints: bool
    support_complaints: bool
    reliability_complaints: bool

class PlatformEvidenceItem(BaseModel):
    platform: str
    snippet: str
    source_url: Optional[str] = None
    date: Optional[str] = None
    confidence: str
    verification_status: str
    decision_impact: str
    next_action: str

class PlatformDiligenceMetadata(BaseModel):
    platforms_checked: List[str]
    warnings: List[str]
    overall_confidence: str
    bias_and_limitations_note: str

class PlatformDiligenceReport(BaseModel):
    run_id: str
    deal_id: int
    status: str
    platforms_checked: List[str]
    company_mentions: List[PlatformSignal] = Field(default_factory=list)
    reddit_findings: List[PlatformSignal] = Field(default_factory=list)
    review_platform_findings: List[PlatformSignal] = Field(default_factory=list)
    social_findings: List[PlatformSignal] = Field(default_factory=list)
    competitor_findings: List[CompetitorSignal] = Field(default_factory=list)
    pain_points: List[PainPointCluster] = Field(default_factory=list)
    reputation_risks: List[ReputationRisk] = Field(default_factory=list)
    sentiment_summary: PlatformSentimentSummary = Field(default_factory=PlatformSentimentSummary)
    evidence_added: List[PlatformEvidenceItem] = Field(default_factory=list)
    questions_generated: List[str] = Field(default_factory=list)
    decision_impact: str = ""
    next_actions: List[str] = Field(default_factory=list)
    metadata: PlatformDiligenceMetadata

class PlatformDiligenceRun(BaseModel):
    id: str
    deal_id: int
    status: str
    config: Dict[str, Any]
    report: Optional[PlatformDiligenceReport] = None
    created_at: str
    completed_at: Optional[str] = None
