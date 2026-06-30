from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime
import json
from pydantic import BaseModel
from typing import Optional

from db.database import SessionLocal
from database import crud
from db.models import InvestmentThesis, DecisionAuditLog, Deal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def normalize_deal_id(deal_id: str) -> int:
    d_id = str(deal_id).replace("deal-", "").replace("src_", "").lower()
    if d_id == "active": return 1000
    if d_id == "zepto": return 1002
    if d_id == "mistral": return 5
    if d_id == "bharatvector": return 999
    if d_id == "neuraldesk": return 1000
    if d_id == "sarvam": return 1001
    if d_id == "1": return 1000
    try:
        return int(d_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Deal not found")

class IngestEventRequest(BaseModel):
    event_type: str
    event_text: str

@router.get("/deals/{deal_id}/brain")
def get_investment_brain(deal_id: str, db: Session = Depends(get_db)):
    d_id = normalize_deal_id(deal_id)
    deal = db.query(Deal).filter(Deal.id == d_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    thesis = db.query(InvestmentThesis).filter(InvestmentThesis.deal_id == d_id).first()
    
    if not thesis:
        # Create a baseline thesis if it doesn't exist
        thesis = InvestmentThesis(
            deal_id=d_id,
            bull_case="Strong market tailwinds and exceptional founder.",
            bear_case="High valuation and unproven enterprise sales motion.",
            recommendation="Diligence Required",
            conviction="Medium",
            confidence=60,
            health_score=75,
            unknowns=json.dumps(["Enterprise NRR", "True CAC"])
        )
        db.add(thesis)
        db.commit()
        db.refresh(thesis)
        
    return {
        "deal_id": d_id,
        "thesis": {
            "bull_case": thesis.bull_case,
            "bear_case": thesis.bear_case,
            "recommendation": thesis.recommendation,
            "conviction": thesis.conviction,
            "confidence": thesis.confidence,
            "health_score": thesis.health_score,
            "unknowns": json.loads(thesis.unknowns) if thesis.unknowns else []
        }
    }

@router.get("/deals/{deal_id}/thesis-snapshots")
def get_thesis_snapshots(deal_id: str, db: Session = Depends(get_db)):
    d_id = normalize_deal_id(deal_id)
    snapshots = db.query(DecisionAuditLog).filter(DecisionAuditLog.deal_id == d_id).order_by(DecisionAuditLog.created_at.desc()).all()
    
    return {
        "deal_id": d_id,
        "snapshots": [
            {
                "id": s.id,
                "previous_recommendation": s.previous_recommendation,
                "current_recommendation": s.current_recommendation,
                "reason_changed": s.reason_changed,
                "evidence_responsible": s.evidence_responsible,
                "confidence_change": s.confidence_change,
                "previous_health_score": s.previous_health_score,
                "current_health_score": s.current_health_score,
                "health_score_change": s.health_score_change,
                "created_at": s.created_at.isoformat()
            } for s in snapshots
        ]
    }

@router.post("/deals/{deal_id}/ingest-event")
def ingest_event(deal_id: str, request: IngestEventRequest, db: Session = Depends(get_db)):
    d_id = normalize_deal_id(deal_id)
    thesis = db.query(InvestmentThesis).filter(InvestmentThesis.deal_id == d_id).first()
    
    if not thesis:
        raise HTTPException(status_code=404, detail="Thesis not found. Call /brain first.")
        
    # Simulate AI updating the thesis based on the event
    prev_health = thesis.health_score or 50
    prev_rec = thesis.recommendation
    
    # Simple mock logic based on event type
    delta = 0
    reason = f"Event ingested: {request.event_text}"
    if "revenue" in request.event_type.lower() or "growth" in request.event_text.lower():
        delta = 5
        thesis.bull_case += f"\n- {request.event_text}"
    elif "churn" in request.event_text.lower() or "competitor" in request.event_type.lower():
        delta = -5
        thesis.bear_case += f"\n- {request.event_text}"
    elif "founder" in request.event_type.lower():
        delta = 2
        thesis.confidence = min(100, (thesis.confidence or 60) + 10)
        
    thesis.health_score = max(0, min(100, prev_health + delta))
    
    if thesis.health_score > 80:
        thesis.recommendation = "Strong Invest"
        thesis.conviction = "High"
    elif thesis.health_score < 40:
        thesis.recommendation = "Pass"
        thesis.conviction = "Low"
    else:
        thesis.recommendation = "Diligence Required"
        thesis.conviction = "Medium"
        
    # Save the snapshot
    snapshot = DecisionAuditLog(
        deal_id=d_id,
        previous_recommendation=prev_rec,
        current_recommendation=thesis.recommendation,
        reason_changed=reason,
        evidence_responsible=f"Source: {request.event_type}",
        confidence_change=10 if delta > 0 else -10,
        previous_health_score=prev_health,
        current_health_score=thesis.health_score,
        health_score_change=delta,
        created_at=datetime.utcnow()
    )
    
    db.add(snapshot)
    db.commit()
    db.refresh(thesis)
    db.refresh(snapshot)
    
    return {
        "message": "Event ingested and thesis updated",
        "new_health_score": thesis.health_score,
        "delta": delta,
        "snapshot_id": snapshot.id
    }

class ScenarioParameters(BaseModel):
    revenue_drop_pct: int = 0
    cac_increase_pct: int = 0
    founder_leaves: bool = False

@router.post("/deals/{deal_id}/simulate-scenario")
def simulate_scenario(deal_id: str, params: ScenarioParameters, db: Session = Depends(get_db)):
    d_id = normalize_deal_id(deal_id)
    thesis = db.query(InvestmentThesis).filter(InvestmentThesis.deal_id == d_id).first()
    
    base_health = thesis.health_score if thesis and thesis.health_score else 50
    deal_name = "NeuralDesk" if d_id == 1000 else f"Deal {d_id}"
    
    from agents.orchestrator import AgentDebateOrchestrator
    orchestrator = AgentDebateOrchestrator(deal_name, base_health)
    
    result = orchestrator.run_simulation(params.dict())
    
    return result
