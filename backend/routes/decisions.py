from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from db.database import get_db
from auth.dependencies import get_current_active_user, require_decision_access
import database.crud as crud
from schemas.decision import DecisionResponse, DecisionCreate, DecisionUpdate
from db.models import Decision, WorkspaceMembership

router = APIRouter()

@router.get("/", response_model=List[DecisionResponse])
def read_decisions(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Any = Depends(get_current_active_user)
):
    decisions = db.query(Decision).join(
        WorkspaceMembership,
        (WorkspaceMembership.workspace_id == Decision.workspace_id) & (WorkspaceMembership.user_id == current_user.id)
    ).offset(skip).limit(limit).all()
    return decisions

@router.post("/", response_model=DecisionResponse)
def create_decision(
    decision: DecisionCreate,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_user)
):
    membership = db.query(WorkspaceMembership).filter(WorkspaceMembership.user_id == current_user.id).first()
    if not membership:
        raise HTTPException(status_code=400, detail="User has no workspace")
    decision_dict = decision.model_dump()
    decision_dict['workspace_id'] = membership.workspace_id
    return crud.create_decision(db, decision_dict)

@router.get("/{decision_id}", response_model=DecisionResponse)
def read_decision(
    decision_id: int,
    decision: Decision = Depends(require_decision_access)
):
    return decision

@router.patch("/{decision_id}/status", response_model=DecisionResponse)
def update_decision_status(
    decision_id: int,
    status: str,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    return crud.update_decision_status(db, decision_id, status)

from pydantic import BaseModel
from typing import Optional

class HumanDecisionInput(BaseModel):
    human_final_decision: str
    human_rationale: str
    override_reason: Optional[str] = None
    approvers_json: Optional[str] = None
    conditions_json: Optional[str] = None

@router.post("/{decision_id}/human_decision")
def record_human_decision(
    decision_id: int,
    decision_input: HumanDecisionInput,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    import json
    
    run = db.query(db_models.ReasoningRun).filter_by(decision_id=decision_id).order_by(db_models.ReasoningRun.start_time.desc()).first()
    ai_recommendation = ""
    ai_confidence = 0
    rec_id = None
    if run and run.output_json:
        out = json.loads(run.output_json)
        synth = out.get("synthesis", {})
        ai_recommendation = synth.get("recommendation", "")
        ai_confidence = synth.get("model_confidence", 0)
        rec_id = out.get("recommendation_id")
        
    record = db_models.HumanDecisionRecord(
        decision_id=decision_id,
        recommendation_id=rec_id,
        ai_recommendation=ai_recommendation,
        ai_confidence=ai_confidence,
        human_final_decision=decision_input.human_final_decision,
        human_rationale=decision_input.human_rationale,
        override_reason=decision_input.override_reason,
        approvers_json=decision_input.approvers_json,
        conditions_json=decision_input.conditions_json
    )
    db.add(record)
    db.commit()
    return {"status": "success", "record_id": record.id}

@router.get("/{decision_id}/human_decision")
def get_human_decision(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    record = db.query(db_models.HumanDecisionRecord).filter_by(decision_id=decision_id).order_by(db_models.HumanDecisionRecord.created_at.desc()).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Human decision not found")
        
    return {
        "id": record.id,
        "decision_id": record.decision_id,
        "ai_recommendation": record.ai_recommendation,
        "ai_confidence": record.ai_confidence,
        "human_final_decision": record.human_final_decision,
        "human_rationale": record.human_rationale,
        "override_reason": record.override_reason,
        "approvers_json": record.approvers_json,
        "conditions_json": record.conditions_json,
        "created_at": record.created_at
    }
