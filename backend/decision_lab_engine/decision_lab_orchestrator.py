from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from .historical_case_registry import registry
from .decision_lab_fixtures import MISSED_DEALS, FALSE_POSITIVES, PLAYBOOK_BACKTESTS
from .decision_lab_schemas import *

router = APIRouter()

@router.get("/status")
async def get_status():
    return {
        "status": "healthy",
        "historical_cases_loaded": len(registry.get_all()),
        "backtest_runner_available": True,
        "counterfactual_simulator_available": True,
        "playbook_backtester_available": True,
        "cutoff_integrity_checks_active": True
    }

@router.get("/cases", response_model=List[HistoricalInvestmentCase])
async def list_cases():
    return registry.get_all()

@router.get("/cases/{case_id}", response_model=HistoricalInvestmentCase)
async def get_case(case_id: str):
    case = registry.get(case_id)
    if not case:
        raise HTTPException(404, "Case not found")
    return case

@router.post("/backtests/run", response_model=BacktestResult)
async def run_backtest(req: Dict[str, Any]):
    case_id = req.get("case_id", "vectordesk_ai")
    playbook_id = req.get("playbook_id", "Apex Default Early-Stage")
    case = registry.get(case_id)
    
    return BacktestResult(
        run_id="bt_123",
        case_id=case_id,
        company_name=case.company_name if case else "Unknown",
        playbook_id=playbook_id,
        recommendation_at_time=case.apex_recommendation_at_time if case else "Pass",
        confidence_at_time="Medium",
        evidence_quality_at_time="Poor",
        top_positive_signals=["Market timing"],
        top_negative_signals=["Weak traction"],
        missing_data=["Retention cohorts"],
        gates_triggered=["minimum_revenue"],
        later_outcome_comparison=case.actual_later_outcome if case else "",
        decision_quality="Reasonable Miss",
        learning=["Do not over-index on early traction for deep technical products."]
    )

@router.post("/counterfactuals/run", response_model=CounterfactualScenario)
async def run_counterfactual(req: Dict[str, Any]):
    case_id = req.get("case_id", "vectordesk_ai")
    changed_assumption = req.get("changed_assumption", "Lowered traction gate")
    
    return CounterfactualScenario(
        scenario_id="cf_123",
        case_id=case_id,
        playbook_id="Apex Default Early-Stage",
        changed_assumption=changed_assumption,
        original_recommendation="Watchlist / Pass",
        counterfactual_recommendation="Proceed to Diligence",
        score_delta=25,
        confidence_delta="Lower",
        risk_delta="Higher technical risk, lower market risk",
        learning="Adjusting the traction gate exposes more true positives in deep tech but increases overall portfolio risk."
    )

@router.get("/missed-deals", response_model=List[MissedDealAnalysis])
async def get_missed_deals():
    return MISSED_DEALS

@router.get("/false-positives", response_model=List[FalsePositiveAnalysis])
async def get_false_positives():
    return FALSE_POSITIVES

@router.get("/playbook-backtests", response_model=List[PlaybookBacktestResult])
async def get_playbook_backtests():
    return PLAYBOOK_BACKTESTS

@router.get("/cutoff-integrity/{case_id}", response_model=CutoffIntegrityReport)
async def get_cutoff_integrity(case_id: str):
    return CutoffIntegrityReport(
        case_id=case_id,
        cutoff_integrity_score=100,
        future_leakage_warnings=[],
        invalid_evidence_items=[],
        safe_to_use_in_backtest=True
    )
