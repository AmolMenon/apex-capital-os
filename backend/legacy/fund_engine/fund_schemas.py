from pydantic import BaseModel
from typing import List, Optional, Dict

class FundProfileOutput(BaseModel):
    fund_name: str
    fund_size: int
    strategy: str
    target_stages: List[str]
    target_sectors: List[str]
    target_ownership: Dict[str, str]
    check_sizes: Dict[str, str]
    reserve_ratio_initial: float
    reserve_ratio_follow_on: float
    portfolio_target_min: int
    portfolio_target_max: int
    return_objective_net_moic: float
    power_law_assumption: str

class FundReturnModelOutput(BaseModel):
    expected_gross_multiple: float
    expected_net_multiple: float
    capital_returned: int
    winners_needed: int
    outcome_distribution: Dict[str, float]

class OwnershipScenarioOutput(BaseModel):
    round_size: int
    pre_money_valuation: int
    post_money_valuation: int
    check_size: int
    ownership_acquired: float
    post_dilution_ownership: float
    required_exit_value_1x_fund: int
    required_exit_value_half_fund: int
    required_exit_value_tenth_fund: int

class ReserveStrategyOutput(BaseModel):
    initial_check: int
    reserve_amount: int
    total_capital_planned: int
    follow_on_priority: str  # Low, Medium, High
    rationale: str
    capital_allocation_warning: Optional[str] = None

class PortfolioConstructionOutput(BaseModel):
    deals_by_sector: Dict[str, int]
    deals_by_stage: Dict[str, int]
    active_pipeline_count: int
    average_apex_score: float
    average_ic_readiness: float
    capital_allocated_by_sector: Dict[str, int]
    sector_warnings: List[str]
    stage_warnings: List[str]
    general_warnings: List[str]

class PowerLawSimulationOutput(BaseModel):
    expected_value_score: float
    weighted_return_potential: float
    prob_write_off: float
    prob_small_exit: float
    prob_good_exit: float
    prob_breakout: float
    prob_fund_returner: float
    classification: str  # Fund Returner Candidate, Breakout Candidate, etc.
    what_must_be_true: str

class ConcentrationRiskOutput(BaseModel):
    concentration_risk_score: int
    sector_concentration: Dict[str, float]
    stage_concentration: Dict[str, float]
    major_warnings: List[str]
    suggested_actions: List[str]

class ThesisFitOutput(BaseModel):
    sector_fit: int
    stage_fit: int
    geography_fit: int
    ownership_feasibility: int
    market_size_fit: int
    power_law_potential: int
    evidence_quality: int
    strategic_portfolio_fit: int
    diligence_readiness: int
    exit_pathway_fit: int
    total_score: int
    verdict: str  # Strong Fit, Good Fit, Conditional Fit, Weak Fit, Outside Mandate
    why_it_fits: List[str]
    why_it_may_not_fit: List[str]
    what_must_be_true: List[str]

class FundFitAssessmentOutput(BaseModel):
    deal_id: int
    company_name: str
    fund_size: int
    initial_check_size: int
    target_ownership: float
    required_exit_value_for_1x_fund: int
    fund_return_potential: str
    thesis_fit_score: int
    portfolio_concentration_risk: str
    recommendation: str
    key_constraints: List[str]
    
    thesis_fit: ThesisFitOutput
    ownership_scenarios: OwnershipScenarioOutput
    reserve_strategy: ReserveStrategyOutput
    power_law_simulation: PowerLawSimulationOutput
