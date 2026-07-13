from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class SourcingSignal(BaseModel):
    signal: str
    source: str
    confidence: str
    why_it_matters: str
    thesis_relevance: str
    decision_importance: str
    verification_needed: str
    signal_type: str
    signal_quality: str

class SourcingScore(BaseModel):
    total_score: int
    thesis_fit: int
    market_timing: int
    signal_strength: int
    source_confidence: int
    fund_fit: int
    stage_fit: int
    power_law_potential: int
    knowledge_graph_similarity: int
    diligence_accessibility: int
    hype_risk_adjustment: int
    sourcing_priority: str

class ThesisFitOutput(BaseModel):
    thesis_id: str
    thesis_name: str
    fit_score: int
    fit_level: str
    reasons_for_fit: List[str]
    reasons_against_fit: List[str]
    missing_info: List[str]
    suggested_next_action: str

class SourcedCompany(BaseModel):
    company_id: str
    company_name: str
    sector: str
    geography: str
    stage_estimate: str
    business_model: str
    public_description: str
    discovery_source: str
    signals: List[SourcingSignal]
    thesis_fit: Optional[ThesisFitOutput]
    sourcing_score: Optional[SourcingScore]
    unknowns: List[str]
    assumptions: List[str]
    source_references: List[str]
    recommended_next_action: str
    status: str
    metadata: Dict[str, Any] = {}

class MarketRadarSignal(BaseModel):
    signal_id: str
    signal_title: str
    market: str
    source: str
    date: str
    signal_type: str
    confidence: str
    relevance_to_thesis: str
    companies_mentioned: List[str]
    analyst_interpretation: str
    next_action: str

class MarketMapCategory(BaseModel):
    category_name: str
    companies: List[str]
    benchmark_companies: List[str]
    public_signals: List[str]
    funding_signals: List[str]
    risks: List[str]
    open_questions: List[str]
    maturity: str
    signal_strength: str
    white_space: str
    fund_relevance: str

class MarketMap(BaseModel):
    thesis_id: str
    categories: List[MarketMapCategory]

class FounderOutreachDraft(BaseModel):
    linkedin_message: str
    warm_intro_ask: str
    email_draft: str
    follow_up_message: str
    call_prep_notes: str

class SourcingPipelineItem(BaseModel):
    item_id: str
    company_id: str
    company_name: str
    thesis_id: str
    thesis_name: str
    sourcing_score: int
    signal_quality: str
    owner: str
    next_action: str
    last_touch: str
    source: str
    reason_for_priority: str
    status: str

class SourcingRecommendation(BaseModel):
    action: str
    reason: str
    priority: str
