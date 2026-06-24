from pydantic import BaseModel
from typing import List, Optional, Any

class ExtractedDeckSection(BaseModel):
    section_type: str
    confidence: float
    extracted_text: str
    investor_relevance: str
    quality_note: str

class DeckClaimOutput(BaseModel):
    claim_text: str
    claim_type: str
    evidence_level: str
    verification_required: bool
    diligence_question: str

class DeckFinancialOutput(BaseModel):
    current_revenue: Optional[str] = None
    projected_revenue: Optional[str] = None
    burn_rate: Optional[str] = None
    runway: Optional[str] = None
    gross_margin: Optional[str] = None
    fundraising_ask: Optional[str] = None
    valuation: Optional[str] = None
    use_of_funds: Optional[str] = None
    flags: List[str] = []

class DeckTractionOutput(BaseModel):
    revenue: Optional[str] = None
    mrr: Optional[str] = None
    arr: Optional[str] = None
    growth_rate: Optional[str] = None
    customers: Optional[str] = None
    users: Optional[str] = None
    retention: Optional[str] = None
    churn: Optional[str] = None
    cac: Optional[str] = None
    ltv: Optional[str] = None
    notable_logos: List[str] = []

class DeckRiskOutput(BaseModel):
    risk: str
    type: str
    severity: str
    explanation: str
    diligence_action: str

class MissingDeckSectionOutput(BaseModel):
    section_name: str
    severity: str
    why_it_matters: str
    suggested_fix: str
    likely_investor_question: str

class DeckQualityOutput(BaseModel):
    problem_clarity: int
    customer_specificity: int
    solution_sharpness: int
    market_logic: int
    traction_evidence: int
    business_model_clarity: int
    competitive_positioning: int
    team_credibility: int
    financial_clarity: int
    fundraising_ask_clarity: int

class InvestorReadinessOutput(BaseModel):
    deck_quality_score: int
    investor_readiness_score: int
    evidence_strength_score: int
    narrative_clarity_score: int
    diligence_burden_score: int
    verdict: str

class DeckAnalysisOutput(BaseModel):
    deal_id: int
    deck_name: str
    deck_summary: str
    deck_quality_score: int
    investor_readiness_score: int
    extracted_sections: List[ExtractedDeckSection]
    key_claims: List[DeckClaimOutput]
    financials: DeckFinancialOutput
    traction: DeckTractionOutput
    risks: List[DeckRiskOutput]
    missing_sections: List[MissingDeckSectionOutput]
    quality_breakdown: DeckQualityOutput
    readiness_breakdown: InvestorReadinessOutput
    recommended_follow_up_questions: List[str]
