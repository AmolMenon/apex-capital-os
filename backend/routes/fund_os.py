from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from fund_os_engine.fund_os_orchestrator import FundOSOrchestrator

router = APIRouter(prefix="/fund-os", tags=["Fund OS"])

@router.get("/status")
def get_status():
    return FundOSOrchestrator.get_status()

@router.get("/profile")
def get_profile():
    return FundOSOrchestrator.get_profile()

@router.get("/construction")
def get_construction():
    return FundOSOrchestrator.get_construction()

@router.get("/performance")
def get_performance():
    return FundOSOrchestrator.get_performance()

@router.get("/concentration")
def get_concentration():
    return FundOSOrchestrator.get_concentration()

@router.get("/risks")
def get_risks():
    return FundOSOrchestrator.get_risks()

@router.get("/gp-cockpit")
def get_cockpit():
    return FundOSOrchestrator.get_cockpit()

@router.get("/lps")
def get_lps():
    return FundOSOrchestrator.get_lps()

@router.get("/lps/{lp_id}")
def get_lp(lp_id: str):
    try:
        return FundOSOrchestrator.get_lp(lp_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/fundraising-pipeline")
def get_pipeline():
    return FundOSOrchestrator.get_pipeline()

@router.put("/fundraising-pipeline/{item_id}")
def update_pipeline(item_id: str, payload: Dict[str, Any]):
    try:
        return FundOSOrchestrator.update_pipeline(item_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/lp-questions")
def get_lp_questions():
    return FundOSOrchestrator.get_lp_questions()

@router.get("/lp-report")
def get_lp_report():
    return FundOSOrchestrator.get_lp_report()

@router.get("/data-room")
def get_data_room():
    return FundOSOrchestrator.get_data_room()

@router.put("/data-room/{item_id}")
def update_data_room(item_id: str, payload: Dict[str, Any]):
    try:
        return FundOSOrchestrator.update_data_room(item_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/capital-calls")
def get_capital_calls():
    return FundOSOrchestrator.get_capital_calls()

@router.post("/capital-calls/plan")
def plan_capital_call(payload: Dict[str, Any] = None):
    return FundOSOrchestrator.plan_capital_call(payload)

@router.get("/distributions")
def get_distributions():
    return FundOSOrchestrator.get_distributions()

@router.get("/narrative")
def get_narrative():
    return FundOSOrchestrator.get_narrative()

@router.post("/narrative/generate")
def generate_narrative():
    # In real app, this might trigger a background task.
    return FundOSOrchestrator.get_narrative()
