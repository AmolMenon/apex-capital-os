from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
from .playbook_registry import playbook_registry
from .playbook_schemas import FundPlaybook, PlaybookSimulationResult
from .playbook_simulation_engine import simulate_deal

router = APIRouter()

@router.get("/status")
async def get_status():
    active = playbook_registry.get_active()
    return {
        "status": "healthy",
        "active_playbook_id": active.playbook_id if active else None,
        "active_playbook_name": active.playbook_name if active else None,
        "playbooks_loaded": len(playbook_registry.get_all())
    }

@router.get("", response_model=List[FundPlaybook])
async def list_playbooks():
    return playbook_registry.get_all()

@router.get("/defaults", response_model=List[FundPlaybook])
async def list_default_playbooks():
    return playbook_registry.get_all()

@router.get("/{playbook_id}", response_model=FundPlaybook)
async def get_playbook(playbook_id: str):
    playbook = playbook_registry.get(playbook_id)
    if not playbook:
        raise HTTPException(status_code=404, detail="Playbook not found")
    return playbook

class ActivateRequest(BaseModel):
    playbook_id: str

@router.post("/activate")
async def activate_playbook(req: ActivateRequest):
    playbook_registry.set_active(req.playbook_id)
    return {"status": "success", "active_playbook": playbook_registry.active_playbook_id}

@router.post("/simulate/deal/{deal_id}")
async def simulate_deal_endpoint(deal_id: str):
    # Fetch company name from db
    from database.crud import get_deal
    from database.database import SessionLocal
    db = SessionLocal()
    deal = get_deal(db, int(deal_id.replace("deal-", "")) if str(deal_id).replace("deal-", "").isdigit() else 0)
    company_name = deal.startup_name if deal else "Unknown Company"
    db.close()
    
    results = []
    # Simulate against a few key playbooks
    for pid in ["apex_default", "ai_native", "evidence_heavy"]:
        pb = playbook_registry.get(pid)
        if pb:
            results.append(simulate_deal(deal, company_name, pb))
            
    return {"results": results}

@router.post("/compare")
async def compare_playbooks(req: Dict[str, str]):
    pb_a = playbook_registry.get(req.get("playbookA"))
    pb_b = playbook_registry.get(req.get("playbookB"))
    if not pb_a or not pb_b:
        raise HTTPException(status_code=404, detail="Playbooks not found")
        
    return {
        "differences": [
            {"dimension": "Market Size Threshold", "a": pb_a.investment_philosophy.market_size_threshold, "b": pb_b.investment_philosophy.market_size_threshold},
            {"dimension": "Evidence Strictness", "a": pb_a.investment_philosophy.capital_efficiency_preference, "b": pb_b.investment_philosophy.capital_efficiency_preference},
            {"dimension": "Min Evidence Score", "a": pb_a.decision_gates.min_evidence_score_for_ic, "b": pb_b.decision_gates.min_evidence_score_for_ic}
        ]
    }
