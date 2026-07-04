from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any
from db.database import get_db
from auth.dependencies import get_current_active_user
import database.crud as crud
from schemas.domain import DomainPackResponse, ReasoningAgentResponse, DecisionFrameworkResponse

router = APIRouter()

@router.get("/{id}", response_model=DomainPackResponse)
def read_domain_pack(
    id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_user)
):
    domain = crud.get_domain_pack(db, id)
    if not domain:
        raise HTTPException(status_code=404, detail="Domain Pack not found")
    return domain

@router.get("/{id}/agents", response_model=List[ReasoningAgentResponse])
def read_domain_agents(
    id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_user)
):
    agents = crud.get_reasoning_agents(db, id)
    return agents

@router.get("/{id}/framework", response_model=DecisionFrameworkResponse)
def read_domain_framework(
    id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_user)
):
    framework = crud.get_decision_framework(db, id)
    if not framework:
        raise HTTPException(status_code=404, detail="Decision Framework not found")
    return framework
