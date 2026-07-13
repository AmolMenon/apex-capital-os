from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ThesisPoint(BaseModel):
    point: str
    evidence_label: str # Verified public fact, Company claim, Investor claim, Media reported, Analyst assumption, Private data required
    source_confidence: str
    proof_status: str # Proven, Assumption, Unknown

class InvestmentThesis(BaseModel):
    one_line_thesis: str
    why_now: str
    why_this_company: str
    why_this_team: str
    why_this_market: str
    why_venture_scale: str
    evidence_supporting: List[ThesisPoint]
    assumptions: List[str]
    private_diligence_required: List[str]

class AntiThesis(BaseModel):
    strongest_case_against: str
    market_risks: List[str]
    product_risks: List[str]
    competition_risks: List[str]
    economics_risks: List[str]
    fund_fit_risks: List[str]
    valuation_risks: List[str]
    unknown_private_metrics: List[str]
    pass_triggers: List[str]

class WhatMustBeTrue(BaseModel):
    statement: str
    why_it_matters: str
    current_evidence: str
    evidence_source: str
    confidence: str
    required_proof: List[str]
    diligence_owner: str
    status: str # Proven, Partially Supported, Assumption, Unknown, Contradicted

class PartnerQuestion(BaseModel):
    question: str
    reason: str

class PartnerPersona(BaseModel):
    name: str
    focus_area: str
    support_level: str # Support, Lean Support, Neutral, Lean Against, Oppose
    view_of_deal: str
    top_questions: List[PartnerQuestion]
    evidence_needed: List[str]
    likely_vote: str
    what_would_change_view: str

class PartnerVote(BaseModel):
    partner_name: str
    vote: str
    rationale: str

class ICSimulation(BaseModel):
    analyst_opening: str
    bull_case: str
    bear_case: str
    partner_debate: List[str]
    fund_math_discussion: str
    evidence_gaps: str
    partner_votes: List[PartnerVote]
    ic_chair_summary: str
    required_diligence: List[str]
    committee_decision: str # Move to deeper diligence, Hold for more data, Benchmark only, Outside mandate, Pass, IC-ready

class ConvictionDelta(BaseModel):
    driver: str
    impact: str # Increased, Decreased
    reason: str

class ConvictionScore(BaseModel):
    overall_score: int # 0 to 100
    conviction_level: str # Low Conviction, Emerging Conviction, High Interest, Low Evidence, Diligence-Backed Conviction, IC-Ready Conviction
    market_conviction: int
    team_conviction: int
    product_conviction: int
    traction_conviction: int
    evidence_conviction: int
    fund_fit_conviction: int
    valuation_conviction: int
    diligence_completeness: int
    red_team_severity: str
    source_confidence: str
    drivers: List[str]
    detractors: List[str]
    deltas: List[ConvictionDelta]

class ValuationScenario(BaseModel):
    scenario_name: str # Conservative, Base Case, Upside Case, Power Law Case
    entry_valuation: float
    exit_valuation: float
    ownership_at_entry: float
    ownership_at_exit: float
    fund_return: float
    fund_multiple_contribution: float
    notes: str

class ValuationSensitivity(BaseModel):
    latest_known_valuation: str
    assumed_entry_valuation: float
    cheque_size: float
    target_ownership: float
    required_exit_value: float
    dilution_assumptions: str
    scenarios: List[ValuationScenario]
    warnings: List[str]

class OwnershipScenario(BaseModel):
    fund_size: float
    target_ownership: float
    cheque_size: float
    entry_valuation: float
    stage: str
    reserve_ratio: float
    expected_dilution: float
    ownership_feasibility: str
    initial_ownership: float
    pro_rata_requirement: float
    follow_on_reserve_needed: float
    expected_exit_ownership: float
    warnings: List[str]

class FundReturnScenario(BaseModel):
    fund_size: float
    entry_ownership: float
    exit_ownership: float
    exit_valuation: float
    capital_invested: float
    exit_proceeds: float
    gross_multiple: float
    percentage_of_fund_returned: float
    can_return_1x_fund: bool
    required_exit_for_1x: float
    required_ownership_for_1x: float

class ChangeOurMindCondition(BaseModel):
    condition_type: str # Upgrade, Downgrade
    condition: str
    evidence_needed: str
    current_status: str
    decision_impact: str
    owner: str
    priority: str

class DecisionGate(BaseModel):
    gate_name: str
    passed: bool
    reason: str

class WarRoomFinalRecommendation(BaseModel):
    recommendation: str
    rationale: str
    next_action: str

class WarRoomMetadata(BaseModel):
    generated_at: str
    mode: str
    deal_type: str
    models_used: List[str]

class DealWarRoom(BaseModel):
    deal_id: str
    company_name: str
    war_room_status: str # draft/running/completed/completed_with_fallback
    thesis: InvestmentThesis
    anti_thesis: AntiThesis
    what_must_be_true: List[WhatMustBeTrue]
    partner_personas: List[PartnerPersona]
    ic_simulation: ICSimulation
    conviction_score: ConvictionScore
    valuation_sensitivity: ValuationSensitivity
    ownership_scenarios: List[OwnershipScenario]
    fund_return_scenarios: List[FundReturnScenario]
    change_our_mind: List[ChangeOurMindCondition]
    decision_gates: List[DecisionGate]
    final_recommendation: WarRoomFinalRecommendation
    metadata: WarRoomMetadata
