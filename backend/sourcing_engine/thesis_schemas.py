from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ThesisCriterion(BaseModel):
    name: str
    description: str
    weight: int = 1

class InvestmentThesis(BaseModel):
    thesis_id: str
    name: str
    sector_focus: List[str]
    geography: List[str]
    stage_preference: List[str]
    cheque_size: str
    ownership_target: str
    must_have_signals: List[str]
    red_flags: List[str]
    preferred_business_models: List[str]
    excluded_categories: List[str]
    benchmark_companies: List[str]
    diligence_questions: List[str]
    fund_math_constraints: str
    status: str = "active"
