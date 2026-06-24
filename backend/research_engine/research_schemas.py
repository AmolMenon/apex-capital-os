from pydantic import BaseModel
from typing import List, Optional

class MarketResearchOutput(BaseModel):
    category: str
    maturity: str
    drivers: List[str]
    constraints: List[str]
    why_now_analysis: List[str]
    attractiveness_score: int

class TAMSAMSOMOutput(BaseModel):
    tam: str
    sam: str
    som: str
    assumptions: List[str]
    sensitivity_analysis: str
    confidence_level: str

class CompetitorResearchOutput(BaseModel):
    competitors: List[dict]  # Name, type, scale, strengths, weaknesses, pricing, distribution, threat_level
    competitive_intensity_score: int
    white_space_analysis: str
    defensibility_assessment: str
    incumbent_response_risk: str

class CustomerPersonaOutput(BaseModel):
    name: str
    role: str
    company_type: str
    pain_points: List[str]
    current_workaround: str
    willingness_to_pay: str
    buying_trigger: str
    buying_objections: List[str]
    decision_making_process: str
    sales_cycle_estimate: str
    why_adopt: str
    why_not_adopt: str

class GTMExperiment(BaseModel):
    experiment: str
    objective: str
    metric: str
    expected_signal: str
    timeline: str

class GTMResearchOutput(BaseModel):
    primary_motion: str
    best_early_segment: str
    first_wedge: str
    distribution_channels: List[str]
    sales_cycle_estimate: str
    cac_risk: str
    repeatability_score: int
    gtm_risks: List[str]
    next_90_days_proof: str
    recommended_experiments: List[GTMExperiment]

class PricingResearchOutput(BaseModel):
    current_model: str
    suggested_model: str
    willingness_to_pay_logic: str
    gross_margin_implication: str
    expansion_revenue_potential: str
    pricing_risk: str
    benchmark_pricing: str
    recommended_experiments: List[str]

class EvidenceGradeOutput(BaseModel):
    categories: List[dict] # category, grade, explanation, missing_evidence, how_to_validate
    overall_score: int
    confidence_level: str
    narrative_warning: Optional[str]

class SourceOutput(BaseModel):
    module: str
    source_type: str
    confidence: str
    last_updated: str
    verification_status: str

class ResearchBrief(BaseModel):
    deal_id: int
    company_name: str
    market_research: MarketResearchOutput
    competitor_research: CompetitorResearchOutput
    customer_personas: List[CustomerPersonaOutput]
    pricing_research: PricingResearchOutput
    gtm_research: GTMResearchOutput
    tam_sam_som: TAMSAMSOMOutput
    evidence_grade: EvidenceGradeOutput
    source_registry: List[SourceOutput]
    research_gaps: List[str]
    research_backed_recommendation: str
