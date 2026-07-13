import json
import datetime
from sqlalchemy.orm import Session
from db.models import Decision, Claim, Assumption, EvidenceConflict, InvestorMeeting, InvestorQuestion, DomainEvent
from services.llm_provider import LLMProvider, BaseLLMProvider

class MeetingService:
    def __init__(self, db: Session, llm_provider: BaseLLMProvider = None):
        self.db = db
        self.llm_provider = llm_provider or LLMProvider()

    def generate_meeting_brief(self, decision_id: int):
        """
        Dynamically generates an ephemeral meeting brief based on the current canonical state.
        This is never persisted to the DB to prevent duplicating analytical state.
        """
        decision = self.db.query(Decision).filter(Decision.id == decision_id).first()
        claims = self.db.query(Claim).filter(Claim.decision_id == decision_id).all()
        assumptions = self.db.query(Assumption).filter(Assumption.decision_id == decision_id, Assumption.status != "Verified").all()
        conflicts = self.db.query(EvidenceConflict).filter(EvidenceConflict.decision_id == decision_id, EvidenceConflict.status != "RESOLVED").all()

        claims_text = "\n".join([f"- [ID: {c.id}] {c.statement}" for c in claims])
        assumptions_text = "\n".join([f"- [ID: {a.id}] {a.statement} (Confidence: {a.confidence})" for a in assumptions])
        conflicts_text = "\n".join([f"- [ID: {c.id}] Conflict between {c.claim_a_id} and {c.claim_b_id}: {c.resolution_rationale}" for c in conflicts])

        system_prompt = """
        You are an expert venture capitalist preparing a founder for a partner meeting.
        Generate a comprehensive, actionable Meeting Brief based ONLY on the provided canonical data.
        DO NOT invent risks or assumptions that are not present in the data.
        Every suggestion must reference canonical evidence IDs.
        """

        user_prompt = f"""
        Company: {decision.title}
        
        CURRENT CANONICAL STATE:
        Claims: {claims_text}
        Weak/Unverified Assumptions: {assumptions_text}
        Unresolved Conflicts: {conflicts_text}
        """

        schema = {
            "type": "object",
            "properties": {
                "likely_investor_questions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "question": {"type": "string"},
                            "why_they_will_ask": {"type": "string"},
                            "related_assumption_ids": {"type": "array", "items": {"type": "integer"}},
                            "suggested_response": {"type": "string"}
                        }
                    }
                },
                "highest_risk_claims": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "claim_id": {"type": "integer"},
                            "risk_reason": {"type": "string"},
                            "slides_to_revisit": {"type": "string"}
                        }
                    }
                },
                "likely_objections": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "questions_founder_should_ask": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "meeting_checklist": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "required": ["likely_investor_questions", "highest_risk_claims", "likely_objections", "questions_founder_should_ask", "meeting_checklist"]
        }

        response, _ = self.llm_provider.generate_structured(system_prompt, user_prompt, schema)
        
        # Emit Domain Event indicating brief generation (Fundraising Memory)
        event = DomainEvent(
            decision_id=decision_id,
            event_type="MeetingBriefGenerated",
            entity_type="Meeting",
            actor="Founder",
            metadata_json=json.dumps({"ephemeral": True})
        )
        self.db.add(event)
        self.db.commit()

        return response

    def capture_meeting_feedback(self, decision_id: int, meeting_data: dict, feedback_text: str):
        """
        Parses raw founder notes, extracts structural data, persists it to the canonical graph,
        and logs the meeting in the Fundraising Memory.
        """
        # 1. Create the Meeting record
        meeting = InvestorMeeting(
            decision_id=decision_id,
            investor_name=meeting_data.get("investor_name"),
            fund_name=meeting_data.get("fund_name"),
            stage=meeting_data.get("stage"),
            meeting_date=meeting_data.get("meeting_date", datetime.datetime.utcnow()),
            founder_notes=feedback_text
        )
        self.db.add(meeting)
        self.db.commit()
        self.db.refresh(meeting)

        # 2. Extract structured data from feedback using LLM
        system_prompt = """
        You are a structural parser. Extract specific investor questions, new assumptions, and requested evidence 
        from the founder's meeting notes. Do not hallucinate. If the note is vague, extract what is explicitly stated.
        """
        user_prompt = f"Meeting Notes:\n{feedback_text}"
        
        schema = {
            "type": "object",
            "properties": {
                "investor_questions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "question_text": {"type": "string"},
                            "category": {"type": "string", "enum": ["Market", "Team", "Traction", "Product", "Financials", "Other"]}
                        }
                    }
                },
                "new_assumptions": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "evidence_requests": {
                    "type": "array",
                    "items": {"type": "string"}
                }
            }
        }
        
        response, _ = self.llm_provider.generate_structured(system_prompt, user_prompt, schema)
        
        # 3. Persist Extracted Investor Questions
        questions = response.get("investor_questions", [])
        for q in questions:
            question_record = InvestorQuestion(
                meeting_id=meeting.id,
                decision_id=decision_id,
                question_text=q.get("question_text"),
                category=q.get("category", "Other")
            )
            self.db.add(question_record)
            
        # 4. Persist New Assumptions directly into canonical graph
        new_assumptions = response.get("new_assumptions", [])
        for a_text in new_assumptions:
            assumption = Assumption(
                decision_id=decision_id,
                category="Investor Request",
                statement=a_text,
                confidence=50,
                status="Unverified"
            )
            self.db.add(assumption)
            
        # 5. Emit DomainEvent for Fundraising Memory
        event = DomainEvent(
            decision_id=decision_id,
            event_type="InvestorMeetingLogged",
            entity_type="InvestorMeeting",
            entity_id=meeting.id,
            actor="Founder",
            metadata_json=json.dumps({
                "investor_name": meeting.investor_name,
                "questions_extracted": len(questions),
                "assumptions_extracted": len(new_assumptions)
            })
        )
        self.db.add(event)
        self.db.commit()
        
        return {
            "meeting_id": meeting.id,
            "extracted_data": response
        }
