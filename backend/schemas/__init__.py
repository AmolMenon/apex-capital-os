from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from research_engine.research_schemas import ResearchBrief

class ScorecardOutput(BaseModel):
    market_size_score: int
    market_timing_score: int
    founder_quality_score: int
    founder_market_fit_score: int
    product_differentiation_score: int
    traction_quality_score: int
    business_model_score: int
    distribution_score: int
    moat_score: int
    exit_score: int

class RiskOutput(BaseModel):
    severity: str
    risk: str
    why_it_matters: str = ""
    how_to_diligence: str = ""
    evidence_needed: str = ""

class DiligenceQuestionOutput(BaseModel):
    category: str = "General"
    question: str

class PartnerPushbackOutput(BaseModel):
    question: str

class MarketMapOutput(BaseModel):
    tam: str = ""
    sam: str = ""
    som: str = ""
    growth_drivers: List[str] = []
    incumbents: List[str] = []
    direct_competitors: List[str] = []
    indirect_alternatives: List[str] = []
    emerging_challengers: List[str] = []
    white_space: str = ""
    
class CompetitorOutput(BaseModel):
    name: str
    category: str
    geography: str = "Global"
    business_model: str = "B2B SaaS"
    stage: str = "Public"
    estimated_revenue: str = "$100M+"
    valuation_range: str = "$1B+"
    relevance: str = "High"
    why_it_matters: str = ""
    strength: str = ""
    weakness: str = ""
    why_we_win: str = ""

class FundReturnOutput(BaseModel):
    fund_size_m: float
    entry_valuation_m: float
    exit_valuation_m: float
    ownership_percentage: float
    return_to_fund_m: float
    moic: float
    fund_returned_percentage: float
    verdict: str

class ExitScenarioOutput(BaseModel):
    case_type: str # Bear, Base, Bull
    exit_valuation_m: float
    probability_percentage: int
    return_multiple: float
    reason: str

class ExitAnalysisOutput(BaseModel):
    scenarios: List[ExitScenarioOutput]
    potential_acquirers: List[str]
    ipo_likelihood: str
    strategic_logic: str
    exit_constraints: str

class DiligenceTask(BaseModel):
    task: str
    objective: str
    owner: str = "Deal Team"
    evidence_required: str
    pass_fail_signal: str

class DiligencePhase(BaseModel):
    phase_name: str
    goal: str
    tasks: List[DiligenceTask]

class ArchetypeOutput(BaseModel):
    name: str
    what_matters_most: str
    typical_risks: List[str]
    key_metrics: List[str]
    relevant_comparables: List[str]
    exit_pathways: str

class ICPersonaOutput(BaseModel):
    role: str # Bull Case Partner, Bear Case Partner, IC Chair
    viewpoint: str
    key_argument: str
    evidence_needed: str
    final_stance: str

class MemoOutput(BaseModel):
    executive_summary: str = ""
    problem: str = ""
    solution: str = ""
    market_opportunity: str = ""
    founder_market_fit: str = ""
    product_differentiation: str = ""
    traction: str = ""
    business_model: str = ""
    competition: str = ""
    key_risks: str = ""
    return_potential: str = ""
    research_evidence: str = ""
    deck_evidence_review: str = ""
    final_recommendation: str = ""


class ICOnePagerOutput(BaseModel):
    company: str = ""
    sector: str = ""
    stage: str = ""
    round_details: str = ""
    apex_score: float = 0
    recommendation: str = ""
    one_line_thesis: str = ""
    why_now: str = ""
    why_this_team: str = ""
    why_this_can_be_big: str = ""
    key_traction: str = ""
    main_risks: List[str] = []
    diligence_required: str = ""
    final_call: str = ""

class DealBase(BaseModel):
    startup_name: str
    sector: Optional[str] = None
    sub_sector: Optional[str] = None
    geography: Optional[str] = None
    stage: Optional[str] = None
    business_model: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    
    source: Optional[str] = None
    source_type: Optional[str] = None
    why_interesting: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[str] = None
    active_playbook_id: Optional[str] = None
    
    deal_type: Optional[str] = "user"
    is_public_benchmark: Optional[bool] = False
    public_profile_json: Optional[str] = None
    
    founder_name: Optional[str] = None
    founder_email: Optional[str] = None
    founder_background: Optional[str] = None
    market_size: Optional[float] = None
    growth_rate: Optional[float] = None
    
    revenue: Optional[float] = None
    mrr: Optional[float] = None
    arr: Optional[float] = None
    users: Optional[int] = None
    customers: Optional[int] = None
    retention_rate: Optional[float] = None
    churn_rate: Optional[float] = None
    gross_margin: Optional[float] = None
    cac: Optional[float] = None
    ltv: Optional[float] = None
    traction_summary: Optional[str] = None
    customer_summary: Optional[str] = None
    revenue_summary: Optional[str] = None
    
    funding_raised: Optional[float] = None
    valuation: Optional[float] = None
    round_size: Optional[str] = None
    fundraising_status: Optional[str] = None
    
    competitors: Optional[str] = None
    status: Optional[str] = "New"

class DealCreate(DealBase):
    pass

class DealUpdate(BaseModel):
    status: Optional[str] = None
    startup_name: Optional[str] = None
    sector: Optional[str] = None
    sub_sector: Optional[str] = None
    geography: Optional[str] = None
    stage: Optional[str] = None
    business_model: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    source: Optional[str] = None
    source_type: Optional[str] = None
    why_interesting: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[str] = None
    active_playbook_id: Optional[str] = None
    founder_name: Optional[str] = None
    founder_email: Optional[str] = None
    founder_background: Optional[str] = None
    traction_summary: Optional[str] = None
    customer_summary: Optional[str] = None
    revenue_summary: Optional[str] = None
    round_size: Optional[str] = None
    fundraising_status: Optional[str] = None

class FullAnalysisOutput(BaseModel):
    deal_id: int
    company_name: str
    overall_score: float
    power_law_score: float
    risk_score: float
    recommendation: str
    confidence: str
    one_line_thesis: str
    main_reason: str
    change_recommendation_condition: str
    
    scorecard: ScorecardOutput
    risks: List[RiskOutput]
    diligence_questions: List[DiligenceQuestionOutput]
    partner_pushback: List[PartnerPushbackOutput]
    market_map: MarketMapOutput
    competitors: List[CompetitorOutput]
    fund_return: FundReturnOutput
    exit_analysis: ExitAnalysisOutput
    diligence_plan: List[DiligencePhase]
    archetype: ArchetypeOutput
    ic_simulation: List[ICPersonaOutput]
    
    memo: MemoOutput
    ic_one_pager: ICOnePagerOutput

from deck_engine.deck_schemas import DeckAnalysisOutput

from diligence_engine.diligence_schemas import DiligencePlanOutput

class ICDecisionLogOutput(BaseModel):
    id: int
    decision_date: datetime
    decision: str
    decision_rationale: str
    conditions: Optional[str]
    partner_concerns: Optional[str]
    next_step: Optional[str]
    
    class Config:
        from_attributes = True

class Deal(DealBase):
    id: int
    created_at: datetime
    updated_at: datetime
    analysis: Optional[FullAnalysisOutput] = None
    research_brief: Optional[Any] = Field(None, exclude=True)
    deck_analysis: Optional[Any] = Field(None, exclude=True)
    diligence_plan: Optional[Any] = Field(None, exclude=True)
    ic_decision_logs: List[Any] = Field([], exclude=True)

    class Config:
        from_attributes = True

class DealStatusUpdate(BaseModel):
    status: str
