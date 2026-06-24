from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class PortfolioConstructionTarget(BaseModel):
    max_companies: int
    min_companies: int
    sector_allocations: Dict[str, float]
    stage_allocations: Dict[str, float]

class FundProfile(BaseModel):
    fund_id: str
    fund_name: str
    fund_size: float
    currency: str
    fund_type: str
    geography_focus: List[str]
    sector_focus: List[str]
    stage_focus: List[str]
    target_check_size: str
    target_ownership: str
    reserve_ratio: str
    fund_life: str
    investment_period: str
    portfolio_construction_target: PortfolioConstructionTarget
    metadata: Dict[str, Any]

class FundConstructionPlan(BaseModel):
    target_portfolio_model: Dict[str, Any]
    actual_portfolio_model: Dict[str, Any]
    deployment_progress: Dict[str, Any]
    reserve_allocation: Dict[str, Any]
    sector_exposure: Dict[str, Any]
    stage_exposure: Dict[str, Any]
    ownership_distribution: Dict[str, Any]
    concentration_risk: Dict[str, Any]
    follow_on_capacity: Dict[str, Any]
    gaps_vs_target: Dict[str, Any]

class FundPerformanceSummary(BaseModel):
    committed_capital: float
    called_capital: float
    deployed_capital: float
    reserved_capital: float
    remaining_dry_powder: float
    number_of_investments: int
    active_portfolio_companies: int
    follow_on_candidates: int
    watchlist_companies: int
    marked_up_companies: int
    marked_down_companies: int
    unrealized_value: Optional[float]
    realized_value: Optional[float]
    tvpi: Optional[float]
    dpi: Optional[float]
    rvpi: Optional[float]
    gross_moic: Optional[float]
    data_confidence: str
    average_entry_valuation: Optional[float]
    weighted_average_ownership: Optional[float]

class LPProfile(BaseModel):
    lp_id: str
    lp_name: str
    lp_type: str
    geography: str
    preferred_sectors: List[str]
    preferred_stage: List[str]
    ticket_size: str
    relationship_status: str
    last_interaction: str
    interest_level: str
    concerns: List[str]
    next_action: str

class FundraisingPipelineItem(BaseModel):
    item_id: str
    lp_profile: LPProfile
    fit_score: int
    relationship_status: str
    concerns: List[str]
    next_action: str
    last_touch: str
    materials_needed: List[str]
    likely_ticket_size: str
    probability: int
    notes: str

class FundDataRoomItem(BaseModel):
    item_id: str
    title: str
    category: str
    status: str # "ready", "needs update", "missing", "not applicable"
    owner: str
    priority: str
    lp_relevance: str
    notes: str

class CapitalCallPlan(BaseModel):
    suggested_amount: float
    reason: str
    timing: str
    use_of_proceeds: List[str]
    companies_supported: List[str]
    dry_powder_after_call: float
    lp_communication_draft: str
    is_mock_plan: bool = True

class DistributionPlan(BaseModel):
    realized_proceeds: float
    distribution_amount: float
    lp_distribution_summary: str
    dpi_impact: str
    remaining_unrealized_value: float
    notes: str
    is_mock_plan: bool = True

class FundRisk(BaseModel):
    risk_id: str
    category: str
    severity: str
    evidence: str
    companies_affected: List[str]
    fund_impact: str
    recommended_action: str
    owner: str
    timeline: str

class ConcentrationAnalysis(BaseModel):
    heatmap_data: Dict[str, Any]
    overexposure_warnings: List[str]
    underexposure_warnings: List[str]
    diversification_gaps: List[str]
    risk_clusters: List[str]
    recommended_balancing_actions: List[str]

class FundNarrative(BaseModel):
    one_line_narrative: str
    lp_meeting_opening: str
    fundraising_deck_summary: str
    quarterly_update_narrative: str
    investment_strategy_explanation: str
    why_now: str
    why_this_team: str
    why_this_market: str
    what_has_been_proven: str
    what_remains_to_prove: str

class InstitutionalLPQuestion(BaseModel):
    question_id: str
    category: str
    question_text: str
    why_lp_asks: str
    current_answer: str
    evidence_available: List[str]
    evidence_missing: List[str]
    recommended_preparation: str

class GPCockpitSummary(BaseModel):
    top_gp_priorities: List[Dict[str, str]]
    urgent_alerts: List[Dict[str, str]]
    lp_actions: List[Dict[str, str]]
    portfolio_actions: List[Dict[str, str]]
    deal_actions: List[Dict[str, str]]
    fund_operations_actions: List[Dict[str, str]]

class LPReport(BaseModel):
    executive_summary: str
    fund_overview: str
    deployment_progress: str
    portfolio_construction: str
    portfolio_health: str
    top_companies: List[str]
    companies_needing_support: List[str]
    follow_on_candidates: List[str]
    reserve_strategy: str
    fund_risks: List[str]
    value_creation: str
    market_commentary: str
    case_studies: List[str]
    next_quarter_priorities: List[str]
    appendix: str
    version: str # "internal GP", "LP-facing", "short email update"
    is_mock: bool = True

class FundOSMetadata(BaseModel):
    status: str
    mock_fixtures_loaded: bool
    fund_profile_loaded: bool
    lp_pipeline_loaded: bool
    data_room_checklist_loaded: bool
    lp_report_available: bool
    routes_healthy: bool
