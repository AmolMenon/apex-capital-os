from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import Deal, WebResearchBriefModel
import json
from web_research_engine.web_research_orchestrator import WebResearchOrchestrator

router = APIRouter()

@router.post("/company")
def research_company(payload: dict):
    company_name = payload.get("company_name")
    if not company_name:
        raise HTTPException(status_code=400, detail="Missing company_name")
    brief = WebResearchOrchestrator.run_research(company_name, payload)
    return brief

@router.post("/deals/{deal_id}/run")
def run_deal_research(deal_id: str, db: Session = Depends(get_db)):
    try:
        deal_id = int(deal_id)
    except:
        deal_id = 1000
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    company_name = deal.company.name if deal.company else "Unknown Company"
    brief_data = WebResearchOrchestrator.run_research(company_name, {
        "sector": deal.company.sector if deal.company else None,
        "description": deal.company.description if deal.company else None,
        "public_profile_json": "{}"
    })
    
    # Save to DB
    existing = db.query(WebResearchBriefModel).filter_by(deal_id=deal.id).first()
    if not existing:
        existing = WebResearchBriefModel(deal_id=deal.id)
        db.add(existing)
        
    existing.company_name = brief_data.get("company_name", company_name)
    existing.research_mode = brief_data.get("research_mode", "mock")
    existing.source_quality_score = brief_data.get("source_quality_score", 0)
    existing.public_data_confidence = brief_data.get("public_data_confidence", "Unknown")
    existing.queries_json = json.dumps(brief_data.get("queries_used", []))
    existing.sources_json = json.dumps(brief_data.get("sources_reviewed", []))
    existing.claims_json = json.dumps(brief_data.get("claims_extracted", []))
    existing.evidence_graph_json = json.dumps(brief_data.get("evidence_graph", []))
    existing.conflicts_json = json.dumps(brief_data.get("source_conflicts", []))
    existing.unknown_metrics_json = json.dumps(brief_data.get("unknown_private_metrics", []))
    existing.synthesis_json = json.dumps(brief_data.get("vc_synthesis", {}))
    existing.citations_json = json.dumps(brief_data.get("citations", []))
    
    db.commit()
    return {"status": "success", "message": "Research completed"}

@router.get("/deals/{deal_id}")
def get_deal_research(deal_id: str, db: Session = Depends(get_db)):
    try:
        deal_id = int(deal_id)
    except:
        deal_id = 1000
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    company_name = deal.company.name if deal.company else "Unknown Company"
    return WebResearchOrchestrator.run_research(company_name, {
        "sector": deal.company.sector if deal.company else None,
        "description": deal.company.description if deal.company else None,
        "public_profile_json": "{}"
    })

@router.post("/deals/{deal_id}/refresh")
def refresh_deal_research(deal_id: str, db: Session = Depends(get_db)):
    try:
        deal_id = int(deal_id)
    except:
        deal_id = 1000
    return run_deal_research(deal_id, db)

@router.get("/deals/{deal_id}/sources")
def get_deal_sources(deal_id: str, db: Session = Depends(get_db)):
    try:
        deal_id = int(deal_id)
    except:
        deal_id = 1000
    brief = db.query(WebResearchBriefModel).filter_by(deal_id=deal_id).first()
    if not brief:
        return []
    return json.loads(brief.sources_json)

@router.get("/deals/{deal_id}/claims")
def get_deal_claims(deal_id: str, db: Session = Depends(get_db)):
    try:
        deal_id = int(deal_id)
    except:
        deal_id = 1000
    brief = db.query(WebResearchBriefModel).filter_by(deal_id=deal_id).first()
    if not brief:
        return []
    return json.loads(brief.claims_json)

@router.get("/deals/{deal_id}/evidence-graph")
def get_deal_evidence(deal_id: str, db: Session = Depends(get_db)):
    try:
        deal_id = int(deal_id)
    except:
        deal_id = 1000
    brief = db.query(WebResearchBriefModel).filter_by(deal_id=deal_id).first()
    if not brief:
        return []
    return json.loads(brief.evidence_graph_json)

@router.get("/status")
def get_research_status():
    import os
    return {
        "web_research_enabled": os.getenv("ENABLE_WEB_RESEARCH", "false") == "true",
        "research_mode": os.getenv("WEB_RESEARCH_MODE", "mock"),
        "search_provider": os.getenv("SEARCH_PROVIDER", "mock"),
        "max_sources": int(os.getenv("WEB_RESEARCH_MAX_SOURCES", "12")),
        "cache_ttl_hours": int(os.getenv("WEB_RESEARCH_CACHE_TTL_HOURS", "24")),
        "mock_fallback_active": True
    }
