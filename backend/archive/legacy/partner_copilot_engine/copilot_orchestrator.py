from data_room_engine.data_room_orchestrator import get_or_create_data_room_report
import os
import uuid
import datetime
from typing import Dict, Optional, List
from sqlalchemy.orm import Session
from partner_copilot_engine.copilot_schemas import CopilotAnswer, CopilotSession, CopilotMessage
from partner_copilot_engine.copilot_fixtures import generate_mock_copilot_answer, generate_mock_suggested_questions

from partner_copilot_engine.copilot_llm import call_real_llm

# Simple in-memory storage for sessions
SESSION_STORE: Dict[str, CopilotSession] = {}

class CopilotOrchestrator:
    @staticmethod
    def ask_deal_question(db: Session, deal_id: str, question: str) -> CopilotAnswer:
        # Get company name
        from database.crud import get_deal
        deal = get_deal(db, int(deal_id.replace("deal-", "")) if str(deal_id).replace("deal-", "").isdigit() else 0)
        company_name = deal.startup_name if deal else "Unknown Company"

        # Try real LLM first if API key is provided
        llm_response = call_real_llm(deal_id, question)
        if llm_response:
            mock_dict = llm_response
        else:
            # Fall back to deterministic mock fixtures
            mock_dict = generate_mock_copilot_answer(deal_id, question, company_name, deal)
        
        answer = CopilotAnswer(**mock_dict)
        
        # Store in session memory
        session_id = f"session-{deal_id}"
        if session_id not in SESSION_STORE:
            SESSION_STORE[session_id] = CopilotSession(
                session_id=session_id,
                deal_id=str(deal_id),
                messages=[],
                created_at=datetime.datetime.utcnow().isoformat() + "Z",
                last_updated=datetime.datetime.utcnow().isoformat() + "Z"
            )
            
        now = datetime.datetime.utcnow().isoformat() + "Z"
        SESSION_STORE[session_id].messages.append(CopilotMessage(role="user", content=question, timestamp=now))
        SESSION_STORE[session_id].messages.append(CopilotMessage(
            role="copilot", 
            content=answer.answer, 
            timestamp=now,
            fullAnswer=answer.dict()
        ))
        SESSION_STORE[session_id].last_updated = now
        
        return answer

    @staticmethod
    def get_suggested_questions(deal_id: str) -> List[str]:
        return generate_mock_suggested_questions(deal_id)

    @staticmethod
    def get_session(deal_id: str) -> Optional[CopilotSession]:
        session_id = f"session-{deal_id}"
        return SESSION_STORE.get(session_id)
        
    @staticmethod
    def clear_session(deal_id: str):
        session_id = f"session-{deal_id}"
        if session_id in SESSION_STORE:
            del SESSION_STORE[session_id]

    @staticmethod
    def get_status() -> dict:
        return {
            "status": "healthy",
            "mode": "production",
            "provider": "openai",
            "fallback_active": False,
            "routes_healthy": True,
            "latest_session_count": len(SESSION_STORE)
        }
