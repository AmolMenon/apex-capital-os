from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from auth.dependencies import require_decision_access
from db.models import Decision
from services.investor_review_service import InvestorReviewService
from services.llm_provider import DeterministicTestProvider, LLMProvider
from core.config import settings

router = APIRouter()

@router.post("/{decision_id}/investor_review")
def run_investor_review(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    provider = LLMProvider() if settings.APEX_LLM_MODE == "live" else DeterministicTestProvider()
    service = InvestorReviewService(db=db, llm_provider=provider)
    
    try:
        result = service.generate_review(decision_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
