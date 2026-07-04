from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class PortfolioCompany(BaseModel):
    company_id: str
    deal_id: Optional[str] = None
    company_name: str
    sector: str
    stage_at_entry: str
    entry_date: str
    entry_valuation: str
    initial_check_size: str
    initial_ownership: str
    current_ownership: str
    reserve_allocated: str
    lead_partner: str
    portfolio_status: str # "active", "watchlist", "needs_support", "follow_on_candidate", "marked_down", "exited"
    latest_health_score: int
    metadata: Dict[str, Any]

class PortfolioKPI(BaseModel):
    kpi_name: str
    category: str # "Revenue", "Customers", "Product", "Financial", "GTM", "Team"
    value: str
    period: str
    source: str
    confidence: str
    trend: str # "improving", "stable", "deteriorating", "unknown"
    benchmark_comparison: Optional[str] = None
    warning_flag: Optional[str] = None

class KPITimeSeries(BaseModel):
    company_id: str
    kpis: List[PortfolioKPI]

class FounderUpdate(BaseModel):
    update_id: str
    company_id: str
    reporting_period: str
    raw_text: str
    metrics_reported: List[str]
    wins: List[str]
    misses: List[str]
    asks: List[str]
    risks: List[str]
    hiring_updates: List[str]
    customer_updates: List[str]
    fundraising_updates: List[str]
    runway_update: str
    confidence: str
    extracted_at: str

class BoardDeckAnalysis(BaseModel):
    company_id: str
    company_narrative: str
    kpi_trends: List[str]
    actuals_vs_plan: str
    hiring_plan: str
    runway: str
    burn: str
    sales_pipeline: str
    customer_wins_losses: str
    product_milestones: str
    risks: List[str]
    asks_from_board: List[str]
    inconsistencies: List[str]
    missing_slides: List[str]
    board_deck_quality_score: int # 0-100

class PortfolioHealthScore(BaseModel):
    overall_score: int
    growth_score: int
    retention_score: int
    margin_score: int
    runway_score: int
    execution_score: int
    reporting_quality_score: int
    founder_communication_score: int
    risk_score: int
    trend: str # "improving", "stable", "deteriorating", "unknown"

class PortfolioRisk(BaseModel):
    risk_type: str
    companies_affected: List[str]
    severity: str # "high", "medium", "low"
    trend: str
    evidence: str
    recommended_action: str
    partner_owner: str

class FollowOnRecommendation(BaseModel):
    company_id: str
    recommendation: str # "Strong Follow-On Candidate", "Consider Follow-On", "Monitor Before Follow-On", "Do Not Follow-On Yet", "Reserve for Support Only", "Mark Down / Watchlist"
    reasons: List[str]
    blockers: List[str]
    required_proof: List[str]
    valuation_sensitivity: str
    ownership_impact: str
    reserve_impact: str
    next_action: str

class ReserveAllocationOutput(BaseModel):
    company_id: str
    current_allocation: str
    suggested_allocation: str
    risk_level: str
    justification: str

class ValueCreationRecommendation(BaseModel):
    company_id: str
    recommendation: str
    why_it_matters: str
    evidence: str
    urgency: str # "High", "Medium", "Low"
    owner: str
    expected_impact: str
    suggested_action: str

class PortfolioAlert(BaseModel):
    company_id: str
    alert_type: str
    message: str
    severity: str

class LPReport(BaseModel):
    report_id: str
    period: str
    portfolio_summary: str
    top_performers: List[str]
    companies_needing_support: List[str]
    follow_on_candidates: List[str]
    portfolio_risks: List[str]
    reserve_allocation_view: str
    key_metrics_summary: str
    value_creation_work: str
    market_commentary: str
    next_quarter_priorities: List[str]
    markdown_content: str

class PortfolioSummary(BaseModel):
    total_companies: int
    active_companies: int
    follow_on_candidates: int
    watchlist_companies: int
    companies_needing_support: int
    average_health_score: int
    reserve_availability: str

class PortfolioMetadata(BaseModel):
    last_updated: str
    data_mode: str # "mock" or "real"
