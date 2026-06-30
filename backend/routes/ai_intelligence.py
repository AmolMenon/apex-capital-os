from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any
from db.database import get_db
from db.models import Deal, User, RoleEnum
from auth.dependencies import get_current_active_user, require_roles
from core.config import settings

# In a real app we'd inject these, but initializing here for simplicity in Epic 3
from services.ai.committee_orchestrator import AICommitteeOrchestrator, CommitteeDecision
from services.ai.contradiction_detector import ContradictionDetector, ContradictionReport
from services.ai.scenario_engine import ScenarioEngine, ScenarioSimulationReport

router = APIRouter()

# Note: Using a dummy key if env var is missing to avoid crashing on import
api_key = getattr(settings, "GEMINI_API_KEY", "dummy_key")
orchestrator = AICommitteeOrchestrator(api_key=api_key)
contradiction_detector = ContradictionDetector(api_key=api_key)
scenario_engine = ScenarioEngine(api_key=api_key)


@router.post("/{deal_id}/committee/run", response_model=CommitteeDecision)
async def run_investment_committee(
    deal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    # In a real system, we'd fetch all documents and memos related to the deal.
    deal_context = f"Company ID: {deal.company_id}. Status: {deal.status}. Stage: {deal.stage}"
    
    # Run the committee
    decision = await orchestrator.run_committee(deal_context=deal_context)
    
    # Normally we would save this to AIAnalysisMemory here
    return decision

@router.post("/{deal_id}/contradictions/detect", response_model=ContradictionReport)
async def detect_contradictions(
    deal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    # Dummy document payload for demonstration
    docs = {
        "Pitch Deck": "We have 200 enterprise customers.",
        "Financial Model": "Total revenue is derived from 35 paying customers."
    }
    
    report = await contradiction_detector.detect(docs)
    return report

@router.post("/{deal_id}/scenarios/simulate", response_model=ScenarioSimulationReport)
async def simulate_scenarios(
    deal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    report = await scenario_engine.simulate(
        deal_financials="Burning 100k/mo. 1M ARR.",
        market_context="Highly competitive AI sector."
    )
    return report
