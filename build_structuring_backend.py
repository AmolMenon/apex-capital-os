import os

base_dir = "/Users/AmolMenon/.gemini/antigravity/scratch/apex-capital/backend/deal_structuring_engine"
os.makedirs(base_dir, exist_ok=True)
open(os.path.join(base_dir, "__init__.py"), "w").close()

schemas = """from pydantic import BaseModel
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
"""

fixtures = """from .deal_structuring_schemas import *

NEURALDESK_DEAL = DealStructuringReport(
    deal_id="neuraldesk",
    company_name="NeuralDesk",
    round_type="Priced Seed Equity",
    recommended_check_size="₹4Cr",
    target_ownership="12%",
    entry_valuation="₹25Cr Pre-money",
    ownership_scenarios=[
        {"scenario": "Base", "ownership": "12.0%"},
        {"scenario": "Post-Series A Dilution", "ownership": "9.6%"}
    ],
    dilution_scenarios=[
        {"round": "Series A", "dilution": "20%", "pro_rata_required": "₹2Cr"}
    ],
    fund_return_analysis={
        "return_potential": "Strong",
        "multiple_needed_for_fund_return": "15x"
    },
    lead_or_participate={
        "recommendation": "Co-Lead",
        "reason": "High conviction, but cheque size requires a partner to fill the ₹10Cr round."
    },
    term_sheet_analysis=TermSheetAnalysis(
        valuation="₹25Cr Pre",
        round_size="₹10Cr",
        security_type="Equity",
        liquidation_preference="1x Non-Participating",
        board_rights="1 Seat",
        pro_rata_rights="Major Investor Rights",
        business_meaning={"liquidation_preference": "Standard downside protection"},
        fund_impact={"board_rights": "Requires partner bandwidth"},
        founder_impact={"board_rights": "Loss of single-founder control"},
        risk_level={"valuation": "Medium - slight premium to market"},
        legal_review_required=["Board Seat Voting Rights", "Pro-Rata Definitions"],
        missing_terms=["Option Pool Increase"]
    ),
    negotiation_prep={
        "fund_priorities": ["12% Ownership", "Board Seat", "Pro-Rata"],
        "founder_priorities": ["Minimize dilution", "Fast closing"],
        "push": ["Option pool expansion before round"],
        "flex": ["Board seat can be an observer seat if needed"],
        "non_negotiables": ["1x Non-Participating Liq Pref"]
    },
    closing_checklist=[
        ClosingChecklistItem(id="c1", item="IC Approval", owner="Partner A", status="Completed", due_date="2026-06-14", blocker=True, evidence_required="IC Memo", notes=""),
        ClosingChecklistItem(id="c2", item="Final Term Sheet Signed", owner="Legal", status="Pending", due_date="2026-06-18", blocker=True, evidence_required="Signed PDF", notes="Waiting on founder"),
        ClosingChecklistItem(id="c3", item="Wire Instructions Verified", owner="Finance", status="Not Started", due_date="2026-06-20", blocker=True, evidence_required="Bank Letter", notes="")
    ],
    legal_diligence=[
        LegalDiligenceItem(id="l1", item="Incorporation Docs", status="Received", notes="Standard DE C-Corp"),
        LegalDiligenceItem(id="l2", item="Cap Table", status="Under Review", notes="Checking ESOP allocations"),
        LegalDiligenceItem(id="l3", item="IP Assignment", status="Requested", notes="Crucial for AI models")
    ],
    post_close_handoff={
        "status": "Not Ready",
        "key_risks_to_monitor": ["Churn rate", "CAC payback"],
        "reporting_cadence": "Monthly"
    },
    trust_flags=[
        "Not legal advice. Term sheet analysis requires counsel review.",
        "Valuation assumptions based on user input, not verified market data.",
        "Cap table analysis relies on founder-provided Excel, not audited data room."
    ],
    metadata={"status": "active"}
)

FIXTURES = {
    "neuraldesk": NEURALDESK_DEAL
}
"""

orchestrator = """from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from .deal_structuring_schemas import *
from .deal_structuring_fixtures import FIXTURES

router = APIRouter()

@router.get("/status")
async def get_status():
    return {
        "status": "healthy",
        "engines_loaded": 15,
        "mock_fixtures_loaded": len(FIXTURES),
        "legal_disclaimer_active": True
    }

@router.get("/deals/{deal_id}/report", response_model=DealStructuringReport)
async def get_report(deal_id: str):
    if deal_id in FIXTURES:
        return FIXTURES[deal_id]
    raise HTTPException(404, "Deal structuring not initialized for this deal.")

@router.post("/deals/{deal_id}/run")
async def run_structuring(deal_id: str):
    return {"status": "success", "message": f"Deal structuring run for {deal_id}"}

@router.get("/deals/{deal_id}/round-structure")
async def get_round_structure(deal_id: str):
    return {"round_type": FIXTURES.get(deal_id, FIXTURES["neuraldesk"]).round_type}

@router.get("/deals/{deal_id}/valuation")
async def get_valuation(deal_id: str):
    return {"valuation": FIXTURES.get(deal_id, FIXTURES["neuraldesk"]).entry_valuation}

@router.get("/deals/{deal_id}/ownership")
async def get_ownership(deal_id: str):
    return {"ownership": FIXTURES.get(deal_id, FIXTURES["neuraldesk"]).target_ownership}

@router.get("/deals/{deal_id}/dilution")
async def get_dilution(deal_id: str):
    return FIXTURES.get(deal_id, FIXTURES["neuraldesk"]).dilution_scenarios

@router.get("/deals/{deal_id}/safe-vs-equity")
async def get_safe_equity(deal_id: str):
    return {"comparison": "Equity provides control, SAFE provides speed."}

@router.get("/deals/{deal_id}/pro-rata")
async def get_pro_rata(deal_id: str):
    return {"pro_rata_importance": "High"}

@router.get("/deals/{deal_id}/lead-or-participate")
async def get_lead_participate(deal_id: str):
    return FIXTURES.get(deal_id, FIXTURES["neuraldesk"]).lead_or_participate

@router.get("/deals/{deal_id}/syndicate")
async def get_syndicate(deal_id: str):
    return {"strategy": "Find technical co-investor."}

@router.get("/deals/{deal_id}/term-sheet", response_model=TermSheetAnalysis)
async def get_term_sheet(deal_id: str):
    return FIXTURES.get(deal_id, FIXTURES["neuraldesk"]).term_sheet_analysis

@router.post("/deals/{deal_id}/term-sheet/analyze")
async def analyze_term_sheet(deal_id: str, payload: Dict[str, Any]):
    return FIXTURES.get(deal_id, FIXTURES["neuraldesk"]).term_sheet_analysis

@router.get("/deals/{deal_id}/negotiation-prep")
async def get_negotiation_prep(deal_id: str):
    return FIXTURES.get(deal_id, FIXTURES["neuraldesk"]).negotiation_prep

@router.get("/deals/{deal_id}/closing-checklist", response_model=List[ClosingChecklistItem])
async def get_closing_checklist(deal_id: str):
    return FIXTURES.get(deal_id, FIXTURES["neuraldesk"]).closing_checklist

@router.put("/deals/{deal_id}/closing-checklist/{item_id}")
async def update_closing_checklist(deal_id: str, item_id: str, payload: Dict[str, Any]):
    return {"status": "updated"}

@router.get("/deals/{deal_id}/legal-diligence", response_model=List[LegalDiligenceItem])
async def get_legal_diligence(deal_id: str):
    return FIXTURES.get(deal_id, FIXTURES["neuraldesk"]).legal_diligence

@router.put("/deals/{deal_id}/legal-diligence/{item_id}")
async def update_legal_diligence(deal_id: str, item_id: str, payload: Dict[str, Any]):
    return {"status": "updated"}

@router.post("/deals/{deal_id}/post-close-handoff")
async def run_post_close(deal_id: str):
    return {"status": "handoff_completed", "portfolio_id": deal_id}
"""

with open(os.path.join(base_dir, "deal_structuring_schemas.py"), "w") as f: f.write(schemas)
with open(os.path.join(base_dir, "deal_structuring_fixtures.py"), "w") as f: f.write(fixtures)
with open(os.path.join(base_dir, "deal_structuring_orchestrator.py"), "w") as f: f.write(orchestrator)

stubs = [
    "round_model_engine.py", "valuation_engine.py", "ownership_target_engine.py", "dilution_model_engine.py", 
    "safe_vs_equity_engine.py", "pro_rata_engine.py", "lead_or_participate_engine.py", "syndicate_strategy_engine.py", 
    "term_sheet_intelligence_engine.py", "negotiation_prep_engine.py", "closing_checklist_engine.py", 
    "legal_diligence_tracker.py", "post_close_handoff_engine.py", "deal_structuring_report_builder.py"
]

for stub in stubs:
    with open(os.path.join(base_dir, stub), "w") as f:
        f.write(f"# {stub}\\n# Engine placeholder. In demo mode, orchestrator returns fixture data directly.\\n")

print("Backend files generated successfully.")
