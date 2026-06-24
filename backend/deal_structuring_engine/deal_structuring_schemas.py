from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class TermSheetAnalysis(BaseModel):
    valuation: str
    round_size: str
    security_type: str
    liquidation_preference: str
    board_rights: str
    pro_rata_rights: str
    business_meaning: Dict[str, str]
    fund_impact: Dict[str, str]
    founder_impact: Dict[str, str]
    risk_level: Dict[str, str]
    legal_review_required: List[str]
    missing_terms: List[str]

class ClosingChecklistItem(BaseModel):
    id: str
    item: str
    owner: str
    status: str
    due_date: str
    blocker: bool
    evidence_required: str
    notes: str

class LegalDiligenceItem(BaseModel):
    id: str
    item: str
    status: str
    notes: str

class DealStructuringReport(BaseModel):
    deal_id: str
    company_name: str
    round_type: str
    recommended_check_size: str
    target_ownership: str
    entry_valuation: str
    ownership_scenarios: List[Dict[str, Any]]
    dilution_scenarios: List[Dict[str, Any]]
    fund_return_analysis: Dict[str, Any]
    lead_or_participate: Dict[str, Any]
    term_sheet_analysis: TermSheetAnalysis
    negotiation_prep: Dict[str, Any]
    closing_checklist: List[ClosingChecklistItem]
    legal_diligence: List[LegalDiligenceItem]
    post_close_handoff: Dict[str, Any]
    trust_flags: List[str]
    metadata: Dict[str, Any]
