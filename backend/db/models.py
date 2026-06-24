from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default="viewer") # owner, admin, analyst, viewer
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    workspaces = relationship("WorkspaceMember", back_populates="user")

class Workspace(Base):
    __tablename__ = "workspaces"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    slug = Column(String, unique=True, index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    members = relationship("WorkspaceMember", back_populates="workspace")
    deals = relationship("Deal", back_populates="workspace")

class WorkspaceMember(Base):
    __tablename__ = "workspace_members"
    
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    role = Column(String, default="member")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    workspace = relationship("Workspace", back_populates="members")
    user = relationship("User", back_populates="workspaces")

class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
    startup_name = Column(String, index=True)
    sector = Column(String)
    sub_sector = Column(String, nullable=True)
    geography = Column(String)
    stage = Column(String)
    business_model = Column(String)
    description = Column(Text)
    website = Column(String, nullable=True)
    
    # Source & Meta
    source = Column(String, nullable=True)
    source_type = Column(String, nullable=True)
    why_interesting = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    tags = Column(String, nullable=True)
    active_playbook_id = Column(String, nullable=True)
    
    # Public Benchmark Mode
    deal_type = Column(String, default="user") # user, demo, real_benchmark
    is_public_benchmark = Column(Boolean, default=False)
    public_profile_json = Column(Text, nullable=True)
    
    # Founder
    founder_name = Column(String, nullable=True)
    founder_email = Column(String, nullable=True)
    founder_background = Column(Text, nullable=True)
    
    # Market
    market_size = Column(Float, nullable=True) # in millions or billions
    growth_rate = Column(Float, nullable=True) # percentage
    
    # Traction
    revenue = Column(Float, nullable=True)
    mrr = Column(Float, nullable=True)
    arr = Column(Float, nullable=True)
    users = Column(Integer, nullable=True)
    customers = Column(Integer, nullable=True)
    retention_rate = Column(Float, nullable=True)
    churn_rate = Column(Float, nullable=True)
    gross_margin = Column(Float, nullable=True)
    cac = Column(Float, nullable=True)
    ltv = Column(Float, nullable=True)
    
    # Text-based claims/summaries for early stage
    traction_summary = Column(Text, nullable=True)
    customer_summary = Column(Text, nullable=True)
    revenue_summary = Column(Text, nullable=True)
    
    # Fundraising
    funding_raised = Column(Float, nullable=True)
    valuation = Column(Float, nullable=True)
    round_size = Column(String, nullable=True)
    fundraising_status = Column(String, nullable=True)
    
    # Competition & Risks
    competitors = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = Column(String, default="New", index=True) # New, Screening, Diligence, Watchlist, Passed, Invested
    recommendation = Column(String, nullable=True)
    evidence_confidence = Column(String, nullable=True)
    trust_score = Column(Integer, nullable=True)
    ic_readiness = Column(String, nullable=True)
    is_demo = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="deals")
    analysis = relationship("Analysis", back_populates="deal", uselist=False, cascade="all, delete-orphan")
    research_brief = relationship("ResearchBriefModel", back_populates="deal", uselist=False, cascade="all, delete-orphan")
    deck_analysis = relationship("DeckAnalysisModel", back_populates="deal", uselist=False, cascade="all, delete-orphan")
    diligence_plan = relationship("DiligencePlanModel", back_populates="deal", uselist=False, cascade="all, delete-orphan")
    ic_decision_logs = relationship("ICDecisionLogModel", back_populates="deal", cascade="all, delete-orphan")
    fund_fit_assessment = relationship("FundFitAssessmentModel", back_populates="deal", uselist=False, cascade="all, delete-orphan")
    web_research_brief = relationship("WebResearchBriefModel", back_populates="deal", uselist=False, cascade="all, delete-orphan")
    war_room = relationship("DealWarRoomModel", back_populates="deal", uselist=False, cascade="all, delete-orphan")


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
    full_analysis_json = Column(Text) # Store the structured FullAnalysisOutput as JSON string
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="analysis")

class ResearchBriefModel(Base):
    __tablename__ = "research_briefs"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
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
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="research_brief")

class DeckAnalysisModel(Base):
    __tablename__ = "deck_analyses"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
    deck_name = Column(String)
    file_type = Column(String)
    raw_text = Column(Text, nullable=True)
    
    extracted_sections_json = Column(Text)
    key_claims_json = Column(Text)
    traction_json = Column(Text)
    financials_json = Column(Text)
    risks_json = Column(Text)
    missing_sections_json = Column(Text)
    deck_quality_json = Column(Text)
    readiness_breakdown_json = Column(Text)
    recommended_follow_up_questions_json = Column(Text)
    
    deck_summary = Column(Text)
    deck_quality_score = Column(Integer)
    investor_readiness_score = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="deck_analysis")

class DiligencePlanModel(Base):
    __tablename__ = "diligence_plans"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
    ic_readiness_score = Column(Integer, default=0)
    diligence_status = Column(String, default="Not Started")
    final_diligence_verdict = Column(String, nullable=True)
    
    priority_tasks_json = Column(Text, default="[]")
    claim_verifications_json = Column(Text, default="[]")
    founder_followups_json = Column(Text, default="[]")
    customer_reference_questions_json = Column(Text, default="[]")
    data_room_requests_json = Column(Text, default="[]")
    risk_resolution_plan_json = Column(Text, default="[]")
    evidence_items_json = Column(Text, default="[]")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="diligence_plan")

class ICDecisionLogModel(Base):
    __tablename__ = "ic_decision_logs"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
    decision_date = Column(DateTime, default=datetime.utcnow)
    decision = Column(String, index=True) # Invest, Pass, More Diligence, Revisit Later
    decision_rationale = Column(Text)
    conditions = Column(Text, nullable=True)
    partner_concerns = Column(Text, nullable=True)
    next_step = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="ic_decision_logs")

class FundFitAssessmentModel(Base):
    __tablename__ = "fund_fit_assessments"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
    fund_size = Column(Integer)
    initial_check_size = Column(Integer)
    target_ownership = Column(Float)
    required_exit_value_for_1x_fund = Column(Integer)
    fund_return_potential = Column(String)
    thesis_fit_score = Column(Integer)
    portfolio_concentration_risk = Column(String)
    recommendation = Column(String, index=True)
    
    key_constraints_json = Column(Text, default="[]")
    thesis_fit_json = Column(Text, default="{}")
    ownership_scenarios_json = Column(Text, default="{}")
    reserve_strategy_json = Column(Text, default="{}")
    power_law_simulation_json = Column(Text, default="{}")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="fund_fit_assessment")

class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), nullable=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
    filename = Column(String)
    original_filename = Column(String)
    content_type = Column(String)
    size = Column(Integer)
    storage_provider = Column(String) # local, s3
    file_path = Column(String) # relative path or S3 key
    
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
    action = Column(String, index=True)
    resource_type = Column(String)
    resource_id = Column(String, nullable=True)
    details_json = Column(Text, default="{}")
    ip_address = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class WebResearchBriefModel(Base):
    __tablename__ = "web_research_briefs"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
    company_name = Column(String)
    research_mode = Column(String)
    source_quality_score = Column(Integer)
    public_data_confidence = Column(String)
    
    queries_json = Column(Text, default="[]")
    sources_json = Column(Text, default="[]")
    claims_json = Column(Text, default="[]")
    evidence_graph_json = Column(Text, default="[]")
    conflicts_json = Column(Text, default="[]")
    unknown_metrics_json = Column(Text, default="[]")
    synthesis_json = Column(Text, default="{}")
    citations_json = Column(Text, default="[]")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="web_research_brief")

class WebSourceModel(Base):
    __tablename__ = "web_sources"

    id = Column(Integer, primary_key=True, index=True)
    research_id = Column(Integer, ForeignKey("web_research_briefs.id", ondelete="CASCADE"), index=True)
    url = Column(String)
    title = Column(String)
    domain = Column(String)
    source_type = Column(String)
    confidence = Column(String)
    fetched_at = Column(String)
    content_hash = Column(String)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class AgentWorkflowRunModel(Base):
    __tablename__ = "agent_workflow_runs"

    run_id = Column(String, primary_key=True, index=True)
    deal_id = Column(String, index=True)
    company_name = Column(String)
    workflow_mode = Column(String)
    status = Column(String)
    agents_run = Column(String)  # JSON list
    trace = Column(String)       # JSON string of trace steps
    final_report = Column(String) # JSON
    metadata_blob = Column(String) # JSON
    created_at = Column(DateTime, default=datetime.utcnow)

class AgentTraceModel(Base):
    __tablename__ = "agent_traces"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    run_id = Column(String, index=True)
    agent_name = Column(String)
    status = Column(String)
    output = Column(String) # JSON
    created_at = Column(DateTime, default=datetime.utcnow)

class DealWarRoomModel(Base):
    __tablename__ = "deal_war_rooms"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id", ondelete="CASCADE"), index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True, index=True)
    
    company_name = Column(String)
    war_room_status = Column(String) # draft/running/completed/completed_with_fallback
    
    # Store nested Pydantic models as JSON strings
    thesis_json = Column(Text, default="{}")
    anti_thesis_json = Column(Text, default="{}")
    what_must_be_true_json = Column(Text, default="[]")
    partner_personas_json = Column(Text, default="[]")
    partner_questions_json = Column(Text, default="[]")
    ic_simulation_json = Column(Text, default="{}")
    conviction_score_json = Column(Text, default="{}")
    conviction_deltas_json = Column(Text, default="[]")
    valuation_sensitivity_json = Column(Text, default="{}")
    ownership_scenarios_json = Column(Text, default="[]")
    fund_return_scenarios_json = Column(Text, default="[]")
    change_our_mind_json = Column(Text, default="[]")
    decision_gates_json = Column(Text, default="[]")
    final_recommendation_json = Column(Text, default="{}")
    metadata_json = Column(Text, default="{}")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    deal = relationship("Deal", back_populates="war_room", uselist=False)


class DealDocument(Base):
    __tablename__ = "deal_documents"
    
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id"))
    file_name = Column(String)
    original_file_name = Column(String)
    file_type = Column(String)
    mime_type = Column(String)
    file_size = Column(Integer)
    document_type = Column(String)
    processing_status = Column(String, default="uploaded")
    storage_path = Column(String)
    summary = Column(Text, nullable=True)
    parser_confidence = Column(String, nullable=True)
    trust_status = Column(String, default="unverified")
    is_archived = Column(Boolean, default=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    uploaded_by = Column(String)
    metadata_json = Column(Text, default="{}")

class DealDataRoomReport(Base):
    __tablename__ = "deal_data_room_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id"), unique=True)
    report_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DiligenceRunModel(Base):
    __tablename__ = "diligence_runs"
    
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(Integer, index=True)
    company_name = Column(String)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String, default="queued") # queued, running, completed, failed, completed_with_warnings
    mode = Column(String, default="mock")
    final_recommendation = Column(String, nullable=True)
    evidence_confidence = Column(String, nullable=True)
    trust_score = Column(Integer, nullable=True)
    ic_readiness = Column(String, nullable=True)
    
    # Stored as JSON strings
    missing_information_json = Column(String, default="[]")
    critical_blockers_json = Column(String, default="[]")
    next_actions_json = Column(String, default="[]")
    report_json = Column(String, default="{}")
    metadata_json = Column(String, default="{}")

class DiligenceRunStepModel(Base):
    __tablename__ = "diligence_run_steps"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    run_id = Column(String, index=True)
    step_id = Column(String)
    name = Column(String)
    status = Column(String, default="pending") # pending, running, completed, failed, skipped, warning
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    summary = Column(String, nullable=True)
    
    # Stored as JSON strings
    outputs_json = Column(String, default="{}")
    warnings_json = Column(String, default="[]")
    errors_json = Column(String, default="[]")


class EvidenceItem(Base):
    __tablename__ = "evidence_items"
    
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(Integer, index=True)
    source_type = Column(String) # manual_entry, founder_email, uploaded_document, public_research, analyst_note, meeting_transcript, mock_fixture, generated_summary
    source_id = Column(String, nullable=True)
    source_name = Column(String, nullable=True)
    claim_text = Column(Text)
    claim_category = Column(String)
    verification_status = Column(String, default="unverified")
    confidence = Column(String, default="low")
    decision_impact = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    is_assumption = Column(Boolean, default=False)
    is_unknown = Column(Boolean, default=False)
    created_by_module = Column(String, nullable=True)
    created_by_run_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MissingInfoItem(Base):
    __tablename__ = "missing_info_items"
    
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(Integer, index=True)
    field_name = Column(String)
    category = Column(String)
    severity = Column(String)
    status = Column(String, default="missing") # missing, partially_resolved, resolved, not_applicable, needs_review
    why_it_matters = Column(Text)
    source_module = Column(String, nullable=True)
    resolved_by_document_id = Column(String, nullable=True)
    resolved_by_evidence_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class OperationTask(Base):
    __tablename__ = "operation_tasks"
    
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(Integer, index=True)
    source_module = Column(String)
    source_id = Column(String, nullable=True)
    title = Column(String)
    description = Column(Text)
    owner = Column(String)
    priority = Column(String)
    status = Column(String, default="not_started") # not_started, in_progress, blocked, completed, deferred, cancelled
    due_date = Column(DateTime, nullable=True)
    blocker_status = Column(String, nullable=True)
    related_document_id = Column(String, nullable=True)
    related_evidence_id = Column(String, nullable=True)
    related_run_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ICPacket(Base):
    __tablename__ = "ic_packets"
    
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(Integer, index=True)
    created_by_run_id = Column(String, nullable=True)
    title = Column(String)
    status = Column(String) # early_draft, diligence_required, partner_review_ready, ic_draft_ready, approved, archived
    readiness_label = Column(String)
    markdown_content = Column(Text)
    version = Column(Integer, default=1)
    trust_score = Column(Integer, nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DecisionOutput(Base):
    __tablename__ = "decision_outputs"
    
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(Integer, index=True)
    created_by_run_id = Column(String, nullable=True)
    recommendation = Column(String)
    confidence = Column(String)
    supporting_points_json = Column(Text, default="[]")
    blockers_json = Column(Text, default="[]")
    deterministic_gates_json = Column(Text, default="{}")
    next_actions_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)

class TrustAudit(Base):
    __tablename__ = "trust_audits"
    
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(Integer, index=True)
    created_by_run_id = Column(String, nullable=True)
    trust_score = Column(Integer)
    trust_level = Column(String)
    grounding_status = Column(String)
    unsupported_claims_count = Column(Integer, default=0)
    assumptions_count = Column(Integer, default=0)
    unknowns_count = Column(Integer, default=0)
    safe_to_share_status = Column(String)
    review_required = Column(Boolean, default=False)
    badges_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)

class DemoSeedStatus(Base):
    __tablename__ = "demo_seed_status"
    id = Column(Integer, primary_key=True, index=True)
    seeded_at = Column(DateTime, default=datetime.utcnow)
    is_seeded = Column(Boolean, default=True)


class PlatformSourceModel(Base):
    __tablename__ = "platform_sources"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    is_enabled = Column(Boolean, default=True)
    mode = Column(String, default="mock")
    last_checked_at = Column(DateTime, nullable=True)
    setup_note = Column(String, nullable=True)

class PlatformDiligenceRunModel(Base):
    __tablename__ = "platform_diligence_runs"
    id = Column(String, primary_key=True, index=True)
    deal_id = Column(Integer, index=True)
    status = Column(String, default="pending")
    config_json = Column(Text, default="{}")
    report_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class PlatformSignalModel(Base):
    __tablename__ = "platform_signals"
    signal_id = Column(String, primary_key=True, index=True)
    run_id = Column(String, index=True)
    deal_id = Column(Integer, index=True)
    company_name = Column(String, nullable=True)
    platform = Column(String, index=True)
    source_url = Column(String, nullable=True)
    source_title = Column(String, nullable=True)
    published_at = Column(String, nullable=True)
    snippet = Column(Text)
    signal_type = Column(String)
    sentiment = Column(String)
    relevance_score = Column(Integer)
    confidence = Column(String)
    verification_status = Column(String)
    decision_impact = Column(String)
    bias_warning = Column(String, nullable=True)
    next_action = Column(String, nullable=True)
    metadata_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)
