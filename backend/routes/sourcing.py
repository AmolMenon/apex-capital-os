from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

from sourcing_engine.sourcing_orchestrator import (
    SourcingOrchestrator, ThesisEngine, MarketRadarEngine, 
    CompanyDiscoveryEngine, SourcingScoreEngine, FounderOutreachEngine,
    SourcingPipelineEngine, MarketMapBuilder
)

router = APIRouter()

@router.get("/status")
def get_sourcing_status() -> Dict[str, Any]:
    return SourcingOrchestrator.get_status()

# Thesis Routes
@router.get("/theses")
def get_theses() -> List[Dict[str, Any]]:
    return ThesisEngine.get_theses()

@router.post("/theses")
def create_thesis(payload: Dict[str, Any]) -> Dict[str, Any]:
    return {"status": "success", "message": "Thesis created."}

@router.get("/theses/{thesis_id}")
def get_thesis(thesis_id: str) -> Dict[str, Any]:
    thesis = ThesisEngine.get_thesis(thesis_id)
    if not thesis:
        raise HTTPException(status_code=404, detail="Thesis not found")
    return thesis

@router.put("/theses/{thesis_id}")
def update_thesis(thesis_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    return {"status": "success", "message": "Thesis updated."}

# Market Radar Routes
@router.get("/market-radar")
def get_market_radar() -> List[Dict[str, Any]]:
    return MarketRadarEngine.get_market_radar()

@router.post("/market-radar/refresh")
def refresh_market_radar() -> List[Dict[str, Any]]:
    return MarketRadarEngine.refresh_market_radar()

# Discovery Routes
@router.post("/discover")
def discover_companies(payload: Dict[str, Any] = {}) -> List[Dict[str, Any]]:
    thesis_id = payload.get("thesis_id")
    return CompanyDiscoveryEngine.discover_companies(thesis_id)

@router.get("/discovered-companies")
def get_discovered_companies() -> List[Dict[str, Any]]:
    return CompanyDiscoveryEngine.get_discovered_companies()

# Sourced Company Routes
@router.get("/companies/{company_id}")
def get_sourced_company(company_id: str) -> Dict[str, Any]:
    company = CompanyDiscoveryEngine.get_sourced_company(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.post("/companies/{company_id}/score")
def score_company(company_id: str) -> Dict[str, Any]:
    return SourcingScoreEngine.score_company(company_id)

@router.post("/companies/{company_id}/outreach")
def generate_outreach(company_id: str) -> Dict[str, str]:
    return FounderOutreachEngine.generate_outreach(company_id)

@router.post("/companies/{company_id}/convert-to-deal")
def convert_to_deal(company_id: str) -> Dict[str, Any]:
    return SourcingPipelineEngine.convert_to_deal(company_id)

# Pipeline Routes
@router.get("/pipeline")
def get_pipeline() -> List[Dict[str, Any]]:
    return SourcingPipelineEngine.get_pipeline()

@router.put("/pipeline/{item_id}")
def update_pipeline_item(item_id: str, payload: Dict[str, str]) -> Dict[str, Any]:
    status = payload.get("status", "Researching")
    res = SourcingPipelineEngine.update_pipeline_item(item_id, status)
    if not res:
        raise HTTPException(status_code=404, detail="Pipeline item not found")
    return res

# Market Map Routes
@router.get("/market-map/{thesis_id}")
def get_market_map(thesis_id: str) -> Dict[str, Any]:
    return MarketMapBuilder.get_market_map(thesis_id)
