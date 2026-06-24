from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import Deal
from database.conversation_models import ConversationRoundModel, ConversationIntelligenceModel
from conversation_engine.conversation_schemas import (
    ConversationIntelligenceOutput,
    TranscriptUploadInput,
    ConversationRoundOutput
)
from conversation_engine.conversation_orchestrator import ConversationOrchestrator
import uuid
import json

router = APIRouter()
orchestrator = ConversationOrchestrator()

@router.get("/{deal_id}", response_model=ConversationIntelligenceOutput)
async def get_conversation_intelligence(deal_id: str, db: Session = Depends(get_db)):
    """
    Fetch the combined conversation intelligence across all rounds for a deal.
    """
    deal_id_int = int(str(deal_id).replace("deal-", ""))
    deal = db.query(Deal).filter(Deal.id == deal_id_int).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    intel_model = db.query(ConversationIntelligenceModel).filter(ConversationIntelligenceModel.deal_id == deal_id_int).first()
    
    if not intel_model:
        # Generate generic mock if not seeded
        return await orchestrator.generate_intelligence(str(deal_id_int), deal.startup_name, [])
        
    rounds_models = db.query(ConversationRoundModel).filter(ConversationRoundModel.deal_id == deal_id_int).all()
    rounds = [
        ConversationRoundOutput(
            round_id=r.round_id,
            title=r.title,
            conversation_type=r.conversation_type,
            date=r.date,
            participants=r.participants_json,
            raw_text=r.raw_text,
            parsed_messages=r.parsed_messages_json,
            round_score=r.round_score,
            key_signal=r.key_signal
        ) for r in rounds_models
    ]

    return ConversationIntelligenceOutput(
        deal_id=str(deal_id_int),
        company_name=deal.startup_name,
        conversation_rounds=rounds,
        founder_response_quality_score=intel_model.founder_response_quality_score,
        clarity_score=intel_model.clarity_score,
        responsiveness_score=intel_model.responsiveness_score,
        credibility_score=intel_model.credibility_score,
        evidence_provided_score=intel_model.evidence_provided_score,
        contradiction_risk_score=intel_model.contradiction_risk_score,
        overall_conversation_score=intel_model.overall_conversation_score,
        scorecard=intel_model.scorecard_json,
        founder_analysis=intel_model.founder_analysis_json,
        investor_questions=intel_model.investor_questions_json,
        positive_signals=intel_model.positive_signals_json,
        negative_signals=intel_model.negative_signals_json,
        contradictions=intel_model.contradictions_json,
        evidence_extracted=intel_model.evidence_extracted_json,
        open_followups=intel_model.open_followups_json,
        decision_impact=intel_model.decision_impact_json,
        recommendation_adjustment=intel_model.recommendation_adjustment,
        summary=intel_model.summary
    )

@router.post("/{deal_id}", response_model=ConversationIntelligenceOutput)
async def upload_transcript(deal_id: str, transcript: TranscriptUploadInput, db: Session = Depends(get_db)):
    """
    Creates a new conversation round, parses it, and then triggers a re-analysis of the entire Conversation Intelligence output.
    """
    deal_id_int = int(str(deal_id).replace("deal-", ""))
    deal = db.query(Deal).filter(Deal.id == deal_id_int).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    round_output = await orchestrator.analyze_transcript(str(deal_id_int), deal.startup_name, transcript.raw_text, transcript.title)
    
    new_round = ConversationRoundModel(
        deal_id=deal_id_int,
        round_id=str(uuid.uuid4()),
        title=transcript.title,
        conversation_type=transcript.conversation_type,
        date=transcript.date,
        participants_json=[transcript.participants],
        raw_text=transcript.raw_text,
        parsed_messages_json=[m.model_dump() for m in round_output.parsed_messages],
        round_score=round_output.round_score,
        key_signal=round_output.key_signal
    )
    db.add(new_round)
    db.commit()

    # Re-fetch all rounds
    rounds_models = db.query(ConversationRoundModel).filter(ConversationRoundModel.deal_id == deal_id_int).all()
    rounds = [
        ConversationRoundOutput(
            round_id=r.round_id,
            title=r.title,
            conversation_type=r.conversation_type,
            date=r.date,
            participants=r.participants_json,
            raw_text=r.raw_text,
            parsed_messages=r.parsed_messages_json,
            round_score=r.round_score,
            key_signal=r.key_signal
        ) for r in rounds_models
    ]

    intel_output = await orchestrator.generate_intelligence(str(deal_id_int), deal.startup_name, rounds)

    # Upsert intelligence model
    intel_model = db.query(ConversationIntelligenceModel).filter(ConversationIntelligenceModel.deal_id == deal_id_int).first()
    if not intel_model:
        intel_model = ConversationIntelligenceModel(deal_id=deal_id_int)
        db.add(intel_model)
    
    intel_model.founder_response_quality_score = intel_output.founder_response_quality_score
    intel_model.clarity_score = intel_output.clarity_score
    intel_model.responsiveness_score = intel_output.responsiveness_score
    intel_model.credibility_score = intel_output.credibility_score
    intel_model.evidence_provided_score = intel_output.evidence_provided_score
    intel_model.contradiction_risk_score = intel_output.contradiction_risk_score
    intel_model.overall_conversation_score = intel_output.overall_conversation_score
    
    intel_model.scorecard_json = intel_output.scorecard.model_dump()
    intel_model.founder_analysis_json = intel_output.founder_analysis.model_dump()
    intel_model.investor_questions_json = [q.model_dump() for q in intel_output.investor_questions]
    intel_model.positive_signals_json = intel_output.positive_signals
    intel_model.negative_signals_json = intel_output.negative_signals
    intel_model.contradictions_json = [c.model_dump() for c in intel_output.contradictions]
    intel_model.evidence_extracted_json = [e.model_dump() for e in intel_output.evidence_extracted]
    intel_model.open_followups_json = [f.model_dump() for f in intel_output.open_followups]
    intel_model.decision_impact_json = intel_output.decision_impact.model_dump()
    intel_model.recommendation_adjustment = intel_output.recommendation_adjustment
    intel_model.summary = intel_output.summary

    db.commit()

    return intel_output
