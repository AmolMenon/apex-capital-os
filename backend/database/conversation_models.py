from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from datetime import datetime
from db.database import Base

class ConversationIntelligenceModel(Base):
    __tablename__ = "conversation_intelligence"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), unique=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
    founder_response_quality_score = Column(Integer, default=0)
    clarity_score = Column(Integer, default=0)
    responsiveness_score = Column(Integer, default=0)
    credibility_score = Column(Integer, default=0)
    evidence_provided_score = Column(Integer, default=0)
    contradiction_risk_score = Column(Integer, default=0)
    overall_conversation_score = Column(Integer, default=0)
    
    scorecard_json = Column(JSON, default={})
    founder_analysis_json = Column(JSON, default={})
    investor_questions_json = Column(JSON, default=[])
    
    positive_signals_json = Column(JSON, default=[])
    negative_signals_json = Column(JSON, default=[])
    contradictions_json = Column(JSON, default=[])
    evidence_extracted_json = Column(JSON, default=[])
    open_followups_json = Column(JSON, default=[])
    decision_impact_json = Column(JSON, default={})
    
    recommendation_adjustment = Column(String, default="No Change")
    summary = Column(Text, default="")
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ConversationRoundModel(Base):
    __tablename__ = "conversation_rounds"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
    round_id = Column(String, default="")
    title = Column(String, default="")
    conversation_type = Column(String, default="")
    date = Column(String, default="")
    participants_json = Column(JSON, default=[])
    raw_text = Column(Text, default="")
    parsed_messages_json = Column(JSON, default=[])
    round_score = Column(Integer, default=0)
    key_signal = Column(String, default="")
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
