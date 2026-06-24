from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class PartnerPreference(BaseModel):
    role_name: str
    focus_areas: List[str]
    preferred_evidence: List[str]
    common_objections: List[str]
    decision_style: str

class MemoTemplateConfig(BaseModel):
    required_sections: List[str]
    optional_sections: List[str]
    custom_instructions: str

class ICProcessConfig(BaseModel):
    review_stages: int
    partner_review_required: bool
    red_team_required: bool
    war_room_required: bool
    ic_simulation_required: bool
    minimum_safe_to_share_status: str

class DecisionGateConfig(BaseModel):
    min_evidence_score_for_ic: int
    min_data_room_completeness: int
    required_cap_table_presence: bool
    required_customer_references: bool
    required_retention_data: bool
    required_gross_margin_data: bool
    maximum_unresolved_critical_blockers: int
    ownership_feasibility_threshold: float

class ScoringProfile(BaseModel):
    market_weight: float
    founder_weight: float
    product_weight: float
    traction_weight: float
    financial_quality_weight: float
    evidence_quality_weight: float

class SectorPlaybook(BaseModel):
    sector_name: str
    focus_areas: List[str]
    required_diligence_questions: List[str]
    key_risks: List[str]
    scoring_weight_adjustments: Dict[str, float]

class StageStrategy(BaseModel):
    stage_name: str
    focus_metrics: List[str]
    acceptable_evidence_uncertainty: str
    ownership_target: str
    required_data_room_items: List[str]

class InvestmentPhilosophy(BaseModel):
    founder_market_fit_importance: str
    market_size_threshold: str
    capital_efficiency_preference: str
    technical_risk_tolerance: str
    regulatory_risk_tolerance: str
    valuation_sensitivity: str

class FundPlaybook(BaseModel):
    playbook_id: str
    playbook_name: str
    playbook_type: str  # demo/custom/default
    fund_archetype: str
    investment_philosophy: InvestmentPhilosophy
    stage_strategies: List[StageStrategy]
    sector_playbooks: List[SectorPlaybook]
    decision_gates: DecisionGateConfig
    memo_template: MemoTemplateConfig
    ic_process: ICProcessConfig
    partner_preferences: List[PartnerPreference]
    scoring_profile: ScoringProfile
    metadata: Dict[str, Any]

class PlaybookSimulationResult(BaseModel):
    company_name: str
    playbook_id: str
    playbook_name: str
    base_score: int
    playbook_adjusted_score: int
    recommendation: str
    gates_triggered: List[str]
    biggest_blocker: str
    required_next_action: str
