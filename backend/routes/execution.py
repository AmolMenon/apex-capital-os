from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any
from db.database import get_db
from auth.dependencies import get_current_active_user, require_decision_access
from db.models import Decision
import database.crud as crud
import db.models as db_models
import json

router = APIRouter()

@router.post("/{decision_id}/action-plans")
def generate_action_plan(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
        
    # MOCK AI: Generate an action plan based on the domain pack
    plan = db_models.ActionPlan(
        decision_id=decision_id,
        title=f"Execution Plan for {decision.title}",
        status="Pending",
        milestones_json=json.dumps([
            {"task": "Finalize terms", "owner": "Partner", "status": "Pending"},
            {"task": "Sign documents", "owner": "Legal", "status": "Pending"}
        ])
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    
    return plan

@router.post("/{decision_id}/archive")
def archive_decision_and_learn(
    decision_id: int,
    actual_outcome: str,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
        
    memory = db_models.InstitutionalMemory(
        decision_id=decision_id,
        predicted_outcome="Investigate further (from Debate)",
        actual_outcome=actual_outcome,
        lessons_learned_json=json.dumps(["Initial assumptions were correct."])
    )
    db.add(memory)
    
    decision.status = "Archived"
    
    db.commit()
    db.refresh(memory)
    
    return memory
