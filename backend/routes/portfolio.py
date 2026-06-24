from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from pydantic import BaseModel
import json
from portfolio_intelligence_engine.portfolio_orchestrator import portfolio_orchestrator

router = APIRouter(prefix="/portfolio", tags=["Portfolio Intelligence"])

class DealConversionPayload(BaseModel):
    company_name: str
    sector: str

class FounderUpdatePayload(BaseModel):
    update_text: str

class BoardDeckPayload(BaseModel):
    deck_text: str

@router.get("/status")
def get_status():
    return portfolio_orchestrator.get_portfolio_status()

@router.get("/companies")
def get_companies():
    return portfolio_orchestrator.get_portfolio_companies()

@router.get("/companies/{company_id}")
def get_company(company_id: str):
    company = portfolio_orchestrator.get_portfolio_company(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.post("/companies/from-deal/{deal_id}")
def create_portfolio_company_from_deal(deal_id: str, payload: DealConversionPayload):
    return portfolio_orchestrator.convert_deal_to_portfolio(deal_id, payload.dict())

@router.get("/companies/{company_id}/kpis")
def get_company_kpis(company_id: str):
    kpis = portfolio_orchestrator.get_kpis(company_id)
    if not kpis:
        raise HTTPException(status_code=404, detail="KPIs not found")
    return kpis

@router.post("/companies/{company_id}/founder-update")
def add_founder_update(company_id: str, payload: FounderUpdatePayload):
    return portfolio_orchestrator.add_founder_update(company_id, payload.dict())

@router.get("/companies/{company_id}/founder-updates")
def get_founder_updates(company_id: str):
    return portfolio_orchestrator.get_founder_updates(company_id)

@router.post("/companies/{company_id}/analyze-board-deck")
def analyze_board_deck(company_id: str, payload: BoardDeckPayload):
    return portfolio_orchestrator.analyze_board_deck(company_id, payload.dict())

@router.get("/companies/{company_id}/board-deck-analysis")
def get_board_deck_analysis(company_id: str):
    analysis = portfolio_orchestrator.get_board_deck_analysis(company_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Board deck analysis not found")
    return analysis

@router.get("/companies/{company_id}/health")
def get_company_health(company_id: str):
    health = portfolio_orchestrator.get_health(company_id)
    if not health:
        raise HTTPException(status_code=404, detail="Health score not found")
    return health

@router.get("/companies/{company_id}/follow-on")
def get_follow_on(company_id: str):
    recommendation = portfolio_orchestrator.get_follow_on_recommendation(company_id)
    if not recommendation:
        raise HTTPException(status_code=404, detail="Follow-on recommendation not found")
    return recommendation

@router.get("/companies/{company_id}/value-creation")
def get_value_creation(company_id: str):
    return portfolio_orchestrator.get_value_creation_plan(company_id)

@router.get("/health")
def get_portfolio_health():
    return portfolio_orchestrator.get_portfolio_health_summary()

@router.get("/risks")
def get_portfolio_risks():
    return portfolio_orchestrator.get_portfolio_risks()

@router.get("/reserves")
def get_portfolio_reserves():
    return portfolio_orchestrator.get_portfolio_reserves()

@router.get("/follow-on-candidates")
def get_follow_on_candidates():
    return portfolio_orchestrator.get_follow_on_candidates()

@router.get("/lp-report")
def get_lp_report():
    return portfolio_orchestrator.generate_lp_report()
