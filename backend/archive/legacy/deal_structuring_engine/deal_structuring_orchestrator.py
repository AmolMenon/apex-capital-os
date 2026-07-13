from fastapi import APIRouter, HTTPException
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
