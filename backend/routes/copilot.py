from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from partner_copilot_engine.copilot_orchestrator import CopilotOrchestrator
from pydantic import BaseModel

router = APIRouter()

class AskCopilotRequest(BaseModel):
    question: str

@router.get("/status")
def copilot_status():
    return CopilotOrchestrator.get_status()

@router.post("/deals/{deal_id}/ask")
def ask_deal_copilot(deal_id: str, payload: AskCopilotRequest, db: Session = Depends(get_db)):
    try:
        did = str(deal_id).replace("deal-", "")
        answer = CopilotOrchestrator.ask_deal_question(db, did, payload.question)
        return answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/deals/{deal_id}/suggested-questions")
def suggested_questions(deal_id: str):
    did = str(deal_id).replace("deal-", "")
    return CopilotOrchestrator.get_suggested_questions(did)

@router.get("/deals/{deal_id}/session")
def get_session(deal_id: str):
    did = str(deal_id).replace("deal-", "")
    session = CopilotOrchestrator.get_session(did)
    if not session:
        return {"session_id": None, "messages": []}
    return session

@router.post("/deals/{deal_id}/clear-session")
def clear_session(deal_id: str):
    did = str(deal_id).replace("deal-", "")
    CopilotOrchestrator.clear_session(did)
    return {"status": "cleared"}

@router.post("/ask")
def ask_cross_deal_copilot(payload: AskCopilotRequest, db: Session = Depends(get_db)):
    # Cross deal summary fallback logic
    from database import crud
    deals = crud.get_deals(db)
    deal_names = [d.startup_name for d in deals]
    
    mock_answer = {
        "answer": f"This is a high-level cross-deal summary. I currently see {len(deals)} deals in the pipeline: {', '.join(deal_names)}. In this deterministic pass, cross-deal retrieval is simulated.",
        "short_answer": "Cross-deal mock response.",
        "question_intent": "Cross-Deal Query",
        "evidence_used": [],
        "source_references": ["Apex Capital CRM"],
        "assumptions": [],
        "unknowns": [],
        "decision_impact": "Neutral",
        "recommended_next_action": "Select a specific deal to review in detail.",
        "confidence": {
            "level": "Medium",
            "score": 60,
            "reason": "Summarizing active deal names."
        },
        "guardrail_flags": ["mock_mode", "cross_deal_mode"],
        "metadata": {
            "deal_id": None,
            "company_name": "Apex Workspace",
            "mode": "mock",
            "provider_used": "mock",
            "fallback_used": True,
            "generated_at": "2026-06-11T00:00:00Z"
        },
        "follow_up_questions": [
            {"question": "Which deal is closest to IC?", "reason": "Pipeline triage."}
        ]
    }
    
    return mock_answer
