from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from db.database import Base

class RoleEnum(str, enum.Enum):
    ADMIN = "Admin"
    PARTNER = "Partner"
    PRINCIPAL = "Principal"
    ASSOCIATE = "Associate"
    ANALYST = "Analyst"
    FOUNDER = "Founder"
    VIEWER = "Viewer"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default=RoleEnum.VIEWER.value)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    deals_assigned = relationship("DealAssignment", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="user", cascade="all, delete-orphan")

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    website = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    sector = Column(String, nullable=True)
    geography = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    founders = relationship("Founder", back_populates="company", cascade="all, delete-orphan")
    deals = relationship("Deal", back_populates="company", cascade="all, delete-orphan")
    portfolio_record = relationship("PortfolioCompany", back_populates="company", uselist=False, cascade="all, delete-orphan")

class Founder(Base):
    __tablename__ = "founders"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True) # If they have an account
    name = Column(String)
    email = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    background = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    company = relationship("Company", back_populates="founders")
    user = relationship("User")

class Deal(Base):
    __tablename__ = "deals"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), index=True)
    status = Column(String, default="New", index=True)
    stage = Column(String, nullable=True) # Seed, Series A, etc
    funding_asking = Column(Float, nullable=True)
    valuation = Column(Float, nullable=True)
    source = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    company = relationship("Company", back_populates="deals")
    assignments = relationship("DealAssignment", back_populates="deal", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="deal", cascade="all, delete-orphan")
    memos = relationship("InvestmentMemo", back_populates="deal", cascade="all, delete-orphan")
    research_reports = relationship("ResearchReport", back_populates="deal", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="deal", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="deal", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="deal", cascade="all, delete-orphan")

class DealAssignment(Base):
    __tablename__ = "deal_assignments"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    role = Column(String) # e.g. Lead, Analyst
    
    deal = relationship("Deal", back_populates="assignments")
    user = relationship("User", back_populates="deals_assigned")

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    uploaded_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    filename = Column(String)
    file_url = Column(String)
    doc_type = Column(String) # Pitch Deck, Financials, etc
    extracted_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="documents")
    uploader = relationship("User")

class InvestmentMemo(Base):
    __tablename__ = "investment_memos"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    content_json = Column(Text)
    status = Column(String, default="Draft") # Draft, Ready for IC, Approved, Rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="memos")
    author = relationship("User")

class ResearchReport(Base):
    __tablename__ = "research_reports"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    generated_by = Column(String) # AI agent id or User id
    report_type = Column(String) # Market, Competitor, Diligence
    content_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="research_reports")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    assignee_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    status = Column(String, default="Pending") # Pending, In Progress, Done
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="tasks")
    assignee = relationship("User")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    content = Column(Text)
    context_type = Column(String, nullable=True) # General, Diligence, Memo
    created_at = Column(DateTime, default=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="comments")
    user = relationship("User", back_populates="comments")

class Vote(Base):
    __tablename__ = "votes"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    decision = Column(String) # Invest, Pass, Abstain
    rationale = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="votes")
    user = relationship("User", back_populates="votes")

class PortfolioCompany(Base):
    __tablename__ = "portfolio_companies"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), unique=True)
    investment_date = Column(DateTime)
    amount_invested = Column(Float)
    equity_percentage = Column(Float, nullable=True)
    status = Column(String, default="Active") # Active, Exited, Written Off
    created_at = Column(DateTime, default=datetime.utcnow)
    
    company = relationship("Company", back_populates="portfolio_record")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String, index=True)
    entity_type = Column(String)
    entity_id = Column(Integer, nullable=True)
    details_json = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")

class AIAnalysisMemory(Base):
    """
    Stores historical memory of AI decisions and conviction scores for a specific deal.
    """
    __tablename__ = "ai_analysis_memory"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    conviction_score = Column(Float)
    risk_score = Column(Float)
    recommendation = Column(String)
    analysis_json = Column(Text) # The full synthesized output
    created_at = Column(DateTime, default=datetime.utcnow)
    
    deal = relationship("Deal")

class AIEvidence(Base):
    """
    Strict mapping table that links an AI claim to a specific source document.
    """
    __tablename__ = "ai_evidence"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    claim_text = Column(Text)
    source_document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=True)
    source_url = Column(String, nullable=True) # If it came from a live API
    confidence_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class AIScenario(Base):
    """
    Stores generated scenarios (Bear, Base, Bull) for a deal.
    """
    __tablename__ = "ai_scenarios"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    scenario_type = Column(String, index=True) # Bear, Base, Bull, Shock
    description = Column(Text)
    recommendation_impact = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class AIOverrideLog(Base):
    """
    Tracks when a Partner overrides an AI recommendation for learning.
    """
    __tablename__ = "ai_override_logs"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    ai_recommendation = Column(String)
    partner_decision = Column(String)
    override_reason = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Analysis(Base):
    __tablename__ = "deal_analysis"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    full_analysis_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class ResearchBriefModel(Base):
    __tablename__ = "research_briefs"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    market_research_json = Column(Text)
    competitor_research_json = Column(Text)
    customer_personas_json = Column(Text)
    pricing_research_json = Column(Text)
    gtm_research_json = Column(Text)
    tam_sam_som_json = Column(Text)
    evidence_grade_json = Column(Text)
    source_registry_json = Column(Text)
    research_gaps_json = Column(Text)
    source_confidence = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class DeckAnalysisModel(Base):
    __tablename__ = "deck_analyses"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    deck_name = Column(String)
    file_type = Column(String)
    deck_summary = Column(Text)
    deck_quality_score = Column(Integer)
    investor_readiness_score = Column(Integer)
    extracted_sections_json = Column(Text)
    key_claims_json = Column(Text)
    financials_json = Column(Text)
    traction_json = Column(Text)
    risks_json = Column(Text)
    missing_sections_json = Column(Text)
    deck_quality_json = Column(Text)
    readiness_breakdown_json = Column(Text)
    recommended_follow_up_questions_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class DiligencePlanModel(Base):
    __tablename__ = "diligence_plans"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    ic_readiness_score = Column(Integer)
    diligence_status = Column(String)
    final_diligence_verdict = Column(String)
    priority_tasks_json = Column(Text)
    claim_verifications_json = Column(Text)
    founder_followups_json = Column(Text)
    customer_reference_questions_json = Column(Text)
    data_room_requests_json = Column(Text)
    risk_resolution_plan_json = Column(Text)
    evidence_items_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class ICDecisionLogModel(Base):
    __tablename__ = "ic_decision_logs"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    decision = Column(String)
    decision_rationale = Column(Text)
    conditions = Column(Text)
    partner_concerns = Column(Text)
    next_step = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class FundFitAssessmentModel(Base):
    __tablename__ = "fund_fit_assessments"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    fund_size = Column(Integer)
    initial_check_size = Column(Integer)
    target_ownership = Column(Float)
    required_exit_value_for_1x_fund = Column(Integer)
    fund_return_potential = Column(String)
    thesis_fit_score = Column(Integer)
    portfolio_concentration_risk = Column(String)
    recommendation = Column(String)
    key_constraints_json = Column(Text)
    thesis_fit_json = Column(Text)
    ownership_scenarios_json = Column(Text)
    reserve_strategy_json = Column(Text)
    power_law_simulation_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class DealWarRoomModel(Base):
    __tablename__ = "deal_war_rooms"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    company_name = Column(String)
    war_room_status = Column(String)
    thesis_json = Column(Text)
    anti_thesis_json = Column(Text)
    what_must_be_true_json = Column(Text)
    partner_personas_json = Column(Text)
    partner_questions_json = Column(Text)
    ic_simulation_json = Column(Text)
    conviction_score_json = Column(Text)
    conviction_deltas_json = Column(Text)
    valuation_sensitivity_json = Column(Text)
    ownership_scenarios_json = Column(Text)
    fund_return_scenarios_json = Column(Text)
    change_our_mind_json = Column(Text)
    decision_gates_json = Column(Text)
    final_recommendation_json = Column(Text)
    metadata_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class PlatformSourceModel(Base):
    __tablename__ = "platform_sources"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    mode = Column(String)
    is_enabled = Column(Boolean, default=True)

class PlatformDiligenceRunModel(Base):
    __tablename__ = "platform_diligence_runs"
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    status = Column(String)
    config_json = Column(Text)
    report_json = Column(Text)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PlatformSignalModel(Base):
    __tablename__ = "platform_signals"
    id = Column(Integer, primary_key=True, autoincrement=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    signal_type = Column(String)
    content = Column(Text)
    metadata_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class DealDataRoomReport(Base):
    __tablename__ = "deal_data_room_reports"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    report_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class DealDocument(Base):
    __tablename__ = "deal_documents"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    file_name = Column(String)
    file_type = Column(String)
    document_category = Column(String)
    status = Column(String, default="uploaded")
    metadata_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class InvestmentThesis(Base):
    __tablename__ = "investment_theses"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    thesis_statement = Column(Text)
    key_risks = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class DecisionAuditLog(Base):
    __tablename__ = "decision_audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    action = Column(String)
    user_id = Column(Integer, nullable=True)
    details = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class WebResearchBriefModel(Base):
    __tablename__ = "web_research_briefs"
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    content_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class AgentWorkflowRunModel(Base):
    __tablename__ = "agent_workflow_runs"
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    workflow_type = Column(String)
    status = Column(String)
    result_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class DiligenceRunModel(Base):
    __tablename__ = "diligence_runs"
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    status = Column(String)
    config_json = Column(Text)
    result_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class DiligenceRunStepModel(Base):
    __tablename__ = "diligence_run_steps"
    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String, ForeignKey("diligence_runs.id", ondelete="CASCADE"), index=True)
    step_name = Column(String)
    status = Column(String)
    result_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Workspace(Base):
    __tablename__ = "workspaces"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
