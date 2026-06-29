from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models
from db.database import SessionLocal
from pydantic import BaseModel
from typing import List, Optional
import json

router = APIRouter(prefix="/api/deals", tags=["Intelligence"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ThesisUpdate(BaseModel):
    bull_case: Optional[str] = None
    bear_case: Optional[str] = None
    recommendation: Optional[str] = None
    conviction: Optional[str] = None
    confidence: Optional[int] = None
    unknowns: Optional[str] = None

class AssumptionCreate(BaseModel):
    description: str
    status: str = "Unvalidated"
    confidence: int = 50
    owner: Optional[str] = None

class AssumptionUpdate(BaseModel):
    status: Optional[str] = None
    confidence: Optional[int] = None
    supporting_evidence: Optional[str] = None
    contradicting_evidence: Optional[str] = None

class RedFlagCreate(BaseModel):
    severity: str
    confidence: int = 50
    reason: str
    evidence: Optional[str] = None
    suggested_diligence: Optional[str] = None

@router.get("/{deal_id}/thesis")
def get_thesis(deal_id: int, db: Session = Depends(get_db)):
    thesis = db.query(models.InvestmentThesis).filter(models.InvestmentThesis.deal_id == deal_id).first()
    if not thesis:
        # Mock initial thesis if it doesn't exist
        return {
            "bull_case": "Strong founding team with prior successful exits. Large and growing TAM. Product shows early signs of PMF.",
            "bear_case": "High burn rate and significant competition from incumbents. Go-to-market motion is unproven at scale.",
            "recommendation": "Proceed to IC",
            "conviction": "High",
            "confidence": 75,
            "unknowns": json.dumps(["Actual customer acquisition cost at scale", "Enterprise churn rate after year 1"])
        }
    return thesis

@router.put("/{deal_id}/thesis")
def update_thesis(deal_id: int, payload: ThesisUpdate, db: Session = Depends(get_db)):
    thesis = db.query(models.InvestmentThesis).filter(models.InvestmentThesis.deal_id == deal_id).first()
    if not thesis:
        thesis = models.InvestmentThesis(deal_id=deal_id)
        db.add(thesis)
    
    # Audit log the recommendation change
    if payload.recommendation and thesis.recommendation != payload.recommendation:
        audit = models.DecisionAuditLog(
            deal_id=deal_id,
            previous_recommendation=thesis.recommendation,
            current_recommendation=payload.recommendation,
            reason_changed="Partner manually updated the thesis",
            confidence_change=0
        )
        db.add(audit)
        
    for key, value in payload.dict(exclude_unset=True).items():
        setattr(thesis, key, value)
    
    db.commit()
    return {"status": "success"}

@router.get("/{deal_id}/assumptions")
def get_assumptions(deal_id: int, db: Session = Depends(get_db)):
    assumptions = db.query(models.Assumption).filter(models.Assumption.deal_id == deal_id).all()
    if not assumptions:
        # Mock data
        return [
            {"id": 1, "description": "Revenue will continue growing 20% monthly", "status": "Unvalidated", "confidence": 40, "owner": "AI Copilot"},
            {"id": 2, "description": "Customer retention will remain above 90%", "status": "Validated", "confidence": 85, "owner": "Partner"}
        ]
    return assumptions

@router.post("/{deal_id}/assumptions")
def create_assumption(deal_id: int, payload: AssumptionCreate, db: Session = Depends(get_db)):
    db_assumption = models.Assumption(deal_id=deal_id, **payload.dict())
    db.add(db_assumption)
    db.commit()
    return {"status": "success", "id": db_assumption.id}

@router.put("/{deal_id}/assumptions/{assumption_id}")
def update_assumption(deal_id: int, assumption_id: int, payload: AssumptionUpdate, db: Session = Depends(get_db)):
    assumption = db.query(models.Assumption).filter(models.Assumption.id == assumption_id, models.Assumption.deal_id == deal_id).first()
    if assumption:
        for key, value in payload.dict(exclude_unset=True).items():
            setattr(assumption, key, value)
        db.commit()
    return {"status": "success"}

@router.get("/{deal_id}/red-flags")
def get_red_flags(deal_id: int, db: Session = Depends(get_db)):
    flags = db.query(models.RedFlag).filter(models.RedFlag.deal_id == deal_id).all()
    if not flags:
        # Mock data
        return [
            {"id": 1, "severity": "High", "confidence": 80, "reason": "Founder credibility concerns", "evidence": "Inconsistencies found in past employment claims.", "suggested_diligence": "Run background check via Checkr"},
            {"id": 2, "severity": "Medium", "confidence": 60, "reason": "Competitive saturation", "evidence": "3 new well-funded startups launched in this space last month.", "suggested_diligence": "Map competitor feature parity"}
        ]
    return flags

@router.post("/{deal_id}/red-flags")
def create_red_flag(deal_id: int, payload: RedFlagCreate, db: Session = Depends(get_db)):
    flag = models.RedFlag(deal_id=deal_id, **payload.dict())
    db.add(flag)
    db.commit()
    return {"status": "success", "id": flag.id}

@router.get("/{deal_id}/audit-logs")
def get_audit_logs(deal_id: int, db: Session = Depends(get_db)):
    logs = db.query(models.DecisionAuditLog).filter(models.DecisionAuditLog.deal_id == deal_id).order_by(models.DecisionAuditLog.created_at.desc()).all()
    if not logs:
        return [
            {"id": 1, "previous_recommendation": "Monitor", "current_recommendation": "Proceed to IC", "reason_changed": "Strong cohort retention data received.", "confidence_change": 15, "created_at": "2026-06-28T10:00:00Z"}
        ]
    return logs

@router.post("/{deal_id}/run-devils-advocate")
def run_devils_advocate(deal_id: int, db: Session = Depends(get_db)):
    # Mock LLM Devil's Advocate run
    
    # 1. Update Bear Case
    thesis = db.query(models.InvestmentThesis).filter(models.InvestmentThesis.deal_id == deal_id).first()
    if thesis:
        thesis.bear_case += "\n\n[Devil's Advocate] New Risk: The core customer base is extremely concentrated. If the top 2 customers churn, revenue will drop by 45%."
        
    # 2. Add a new Red Flag
    flag = models.RedFlag(
        deal_id=deal_id,
        severity="High",
        confidence=90,
        reason="Customer Concentration Risk",
        evidence="Analysis of revenue breakdown shows Top 2 customers account for 45% of ARR.",
        suggested_diligence="Request exact revenue breakdown by customer for the last 12 months."
    )
    db.add(flag)
    
    db.commit()
    return {"status": "success", "message": "Devil's Advocate analysis complete."}
