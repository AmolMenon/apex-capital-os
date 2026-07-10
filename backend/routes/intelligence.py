from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models
from db.database import SessionLocal
from pydantic import BaseModel
from typing import List, Optional
import json

from services.investment_case_read_service import InvestmentCaseReadService
from services.orchestrator_service import InvestmentCaseOrchestrator
from auth.dependencies import require_decision_access

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AssumptionCreate(BaseModel):
    statement: str
    category: str = "Other"
    
class AssumptionUpdate(BaseModel):
    statement: Optional[str] = None
    category: Optional[str] = None
    
class AssumptionClaimLinkCreate(BaseModel):
    claim_id: int
    relationship: str # SUPPORTS, CONTRADICTS, CONTEXT
    provenance_notes: Optional[str] = None
    
class AnalystConflictCreate(BaseModel):
    claim_a_id: int
    claim_b_id: int

@router.get("/{decision_id}/investment-case")
def get_investment_case(decision_id: int, db: Session = Depends(get_db), decision: models.Decision = Depends(require_decision_access)):
    data = InvestmentCaseReadService.get_investment_case(db, decision_id)
    if not data:
        raise HTTPException(status_code=404, detail="Decision not found")
        
    h = db.query(models.HumanDecisionRecord).filter_by(decision_id=decision_id).order_by(models.HumanDecisionRecord.id.desc()).first()
    if h:
        data["human_decision"] = {
            "value": h.human_final_decision,
            "rationale": h.human_rationale,
            "conditions_json": h.conditions_json,
            "override_reason": h.override_reason
        }
    else:
        data["human_decision"] = None
        
    return data

@router.get("/{decision_id}/assumptions")
def get_assumptions(decision_id: int, db: Session = Depends(get_db), decision: models.Decision = Depends(require_decision_access)):
    assumptions = db.query(models.Assumption).filter(models.Assumption.decision_id == decision_id).all()
    return assumptions

@router.post("/{decision_id}/assumptions")
def create_assumption(decision_id: int, payload: AssumptionCreate, db: Session = Depends(get_db), decision: models.Decision = Depends(require_decision_access)):
    assumption = models.Assumption(
        decision_id=decision_id,
        statement=payload.statement,
        category=payload.category,
        status="Unverified"
    )
    db.add(assumption)
    db.commit()
    db.refresh(assumption)
    return {"status": "success", "id": assumption.id}

@router.patch("/{decision_id}/assumptions/{assumption_id}")
def update_assumption(decision_id: int, assumption_id: int, payload: AssumptionUpdate, db: Session = Depends(get_db), decision: models.Decision = Depends(require_decision_access)):
    assumption = db.query(models.Assumption).filter(models.Assumption.id == assumption_id, models.Assumption.decision_id == decision_id).first()
    if not assumption:
        raise HTTPException(status_code=404, detail="Assumption not found")
    if payload.statement:
        assumption.statement = payload.statement
    if payload.category:
        assumption.category = payload.category
    db.commit()
    return {"status": "success"}

@router.post("/{decision_id}/assumptions/{assumption_id}/claim-links")
def link_claim(decision_id: int, assumption_id: int, payload: AssumptionClaimLinkCreate, db: Session = Depends(get_db), decision: models.Decision = Depends(require_decision_access)):
    # Validate deal isolation
    assumption = db.query(models.Assumption).filter(models.Assumption.id == assumption_id, models.Assumption.decision_id == decision_id).first()
    if not assumption:
        raise HTTPException(status_code=404, detail="Assumption not found on this deal")
    claim = db.query(models.Claim).filter(models.Claim.id == payload.claim_id, models.Claim.decision_id == decision_id).first()
    if not claim:
        raise HTTPException(status_code=400, detail="Claim does not exist or does not belong to this deal")
        
    link = models.AssumptionClaimLink(
        assumption_id=assumption_id,
        claim_id=payload.claim_id,
        relationship=payload.relationship,
        provenance_notes=payload.provenance_notes
    )
    db.add(link)
    db.commit()
    
    # Trigger recompute
    InvestmentCaseOrchestrator.recompute_assumption_state(db, assumption_id)
    return {"status": "success", "id": link.id}

@router.get("/{decision_id}/conflicts")
def get_conflicts(decision_id: int, db: Session = Depends(get_db), decision: models.Decision = Depends(require_decision_access)):
    return db.query(models.EvidenceConflict).filter(models.EvidenceConflict.decision_id == decision_id).all()

@router.post("/{decision_id}/conflicts")
def create_conflict(decision_id: int, payload: AnalystConflictCreate, db: Session = Depends(get_db), decision: models.Decision = Depends(require_decision_access)):
    claim_a = db.query(models.Claim).filter(models.Claim.id == payload.claim_a_id, models.Claim.decision_id == decision_id).first()
    claim_b = db.query(models.Claim).filter(models.Claim.id == payload.claim_b_id, models.Claim.decision_id == decision_id).first()
    if not claim_a or not claim_b:
        raise HTTPException(status_code=400, detail="Claims do not exist or do not belong to this deal")
        
    conflict = InvestmentCaseOrchestrator.log_conflict(db, decision_id, payload.claim_a_id, payload.claim_b_id)
    return {"status": "success", "id": conflict.id}

@router.get("/{decision_id}/diligence/tasks")
def get_tasks(decision_id: int, db: Session = Depends(get_db), decision: models.Decision = Depends(require_decision_access)):
    return db.query(models.ChallengeTask).filter(models.ChallengeTask.decision_id == decision_id).all()

@router.get("/{decision_id}/diligence/findings")
def get_findings(decision_id: int, db: Session = Depends(get_db), decision: models.Decision = Depends(require_decision_access)):
    return db.query(models.ChallengeFinding).filter(models.ChallengeFinding.decision_id == decision_id).all()
