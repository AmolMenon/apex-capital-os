from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, Boolean, Enum, Table, UniqueConstraint
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
    
    decisions_assigned = relationship("DecisionAssignment", back_populates="user", cascade="all, delete-orphan")

class DomainPack(Base):
    __tablename__ = "domain_packs"
    id = Column(String, primary_key=True, index=True) # e.g. "venture_capital", "mergers_acquisitions"
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    config_json = Column(Text) # Templates, prompts, evaluation criteria
    created_at = Column(DateTime, default=datetime.utcnow)
    
    reasoning_agents = relationship("ReasoningAgent", back_populates="domain_pack", cascade="all, delete-orphan")
    decision_frameworks = relationship("DecisionFramework", back_populates="domain_pack", cascade="all, delete-orphan")

class ReasoningAgent(Base):
    __tablename__ = "reasoning_agents"
    id = Column(String, primary_key=True, index=True)
    domain_pack_id = Column(String, ForeignKey("domain_packs.id", ondelete="CASCADE"), index=True)
    name = Column(String) # e.g. "Devil's Advocate", "Strategy Consultant"
    system_prompt = Column(Text)
    capabilities_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    domain_pack = relationship("DomainPack", back_populates="reasoning_agents")

class DecisionFramework(Base):
    __tablename__ = "decision_frameworks"
    id = Column(String, primary_key=True, index=True)
    domain_pack_id = Column(String, ForeignKey("domain_packs.id", ondelete="CASCADE"), index=True)
    name = Column(String)
    stages_json = Column(Text) # Array of stages like ["Framing", "Evidence", "Debate", "Execution"]
    created_at = Column(DateTime, default=datetime.utcnow)
    
    domain_pack = relationship("DomainPack", back_populates="decision_frameworks")

class DecisionSubject(Base):
    __tablename__ = "decision_subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    metadata_json = Column(Text) # Catch-all for domain-specific fields (e.g. website, sector)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    decisions = relationship("Decision", back_populates="subject", cascade="all, delete-orphan")

class Decision(Base):
    __tablename__ = "decisions"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), index=True, nullable=True)
    subject_id = Column(Integer, ForeignKey("decision_subjects.id", ondelete="CASCADE"), index=True)
    domain_pack_id = Column(String, ForeignKey("domain_packs.id", ondelete="SET NULL"), nullable=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="Framing", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Economics Tracking
    base_analysis_calls = Column(Integer, default=0)
    challenge_calls = Column(Integer, default=0)
    synthesis_calls = Column(Integer, default=0)
    grader_calls = Column(Integer, default=0)
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    latency_ms = Column(Integer, default=0)
    escalation_reason = Column(String, nullable=True)
    avoided_full_deliberation_estimate = Column(Integer, default=0) # Estimated tokens saved
    
    subject = relationship("DecisionSubject", back_populates="decisions")
    assignments = relationship("DecisionAssignment", back_populates="decision", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="decision", cascade="all, delete-orphan")
    scenario_simulations = relationship("ScenarioSimulation", back_populates="decision", cascade="all, delete-orphan")
    action_plans = relationship("ActionPlan", back_populates="decision", cascade="all, delete-orphan")

class DecisionAssignment(Base):
    __tablename__ = "decision_assignments"
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    role = Column(String)
    
    decision = relationship("Decision", back_populates="assignments")
    user = relationship("User", back_populates="decisions_assigned")

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    title = Column(String)
    content = Column(Text, nullable=True)
    source_url = Column(String, nullable=True)
    evidence_type = Column(String)
    metadata_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_modified_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    version = Column(Integer, default=1)
    deck_version = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime, nullable=True)
    uploaded_by = Column(String, nullable=True)
    previous_version_id = Column(Integer, ForeignKey("evidence.id", ondelete="SET NULL"), nullable=True)
    is_stale = Column(Boolean, default=False)
    
    decision = relationship("Decision", back_populates="evidence")

class ScenarioSimulation(Base):
    __tablename__ = "scenario_simulations"
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    scenario_type = Column(String) # Best Case, Worst Case, Base Case
    parameters_json = Column(Text)
    forecast_results_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    decision = relationship("Decision", back_populates="scenario_simulations")

class InstitutionalMemory(Base):
    __tablename__ = "institutional_memory"
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    predicted_outcome = Column(Text)
    actual_outcome = Column(Text, nullable=True)
    lessons_learned_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ActionPlan(Base):
    __tablename__ = "action_plans"
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    title = Column(String)
    status = Column(String, default="Pending")
    milestones_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    decision = relationship("Decision", back_populates="action_plans")

# Keep the remaining models that are still useful globally
class Workspace(Base):
    __tablename__ = "workspaces"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class WorkspaceMembership(Base):
    __tablename__ = "workspace_memberships"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    role = Column(String, default="Member")
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
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    status = Column(String)
    config_json = Column(Text)
    report_json = Column(Text)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PlatformSignalModel(Base):
    __tablename__ = "platform_signals"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    signal_type = Column(String)
    content = Column(Text)
    metadata_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==========================================
# PHASE 4: KNOWLEDGE GRAPH & INSTITUTIONAL MEMORY
# ==========================================

class GraphNode(Base):
    __tablename__ = "graph_nodes"
    id = Column(String, primary_key=True, index=True) # e.g. "claim_123", "evidence_456"
    node_type = Column(String, index=True) # "Claim", "Evidence", "Assumption", etc.
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), nullable=True)
    content = Column(Text)
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class GraphEdge(Base):
    __tablename__ = "graph_edges"
    id = Column(Integer, primary_key=True, autoincrement=True)
    source_node_id = Column(String, ForeignKey("graph_nodes.id", ondelete="CASCADE"), index=True)
    target_node_id = Column(String, ForeignKey("graph_nodes.id", ondelete="CASCADE"), index=True)
    relationship = Column(String, index=True) # "SUPPORTS", "CONTRADICTS", "DEPENDS_ON"
    weight = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Assumption(Base):
    __tablename__ = "assumptions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    category = Column(String, index=True) # "Market", "Financial", etc.
    statement = Column(Text)
    confidence = Column(Integer, default=50) # 0-100
    status = Column(String, default="Unverified") # "Verified", "Unverified", "Invalidated"
    accuracy_score = Column(Float, nullable=True) # populated after postmortem
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AssumptionClaimLink(Base):
    __tablename__ = "assumption_claim_links"
    id = Column(Integer, primary_key=True, autoincrement=True)
    assumption_id = Column(Integer, ForeignKey("assumptions.id", ondelete="CASCADE"), index=True)
    claim_id = Column(Integer, ForeignKey("claims.id", ondelete="CASCADE"), index=True)
    relationship = Column(String) # SUPPORTS, CONTRADICTS, CONTEXT
    provenance_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    agent_id = Column(String, nullable=True) # If made by an AI agent
    target_metric = Column(String)
    expected_value = Column(String)
    confidence = Column(Integer) # 0-100
    expected_date = Column(DateTime, nullable=True)
    actual_result = Column(String, nullable=True)
    error_magnitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Postmortem(Base):
    __tablename__ = "postmortems"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), unique=True)
    expected_outcome = Column(Text)
    actual_outcome = Column(Text)
    decision_quality_score = Column(Integer) # 0-100
    outcome_quality_score = Column(Integer) # 0-100
    went_right = Column(Text)
    went_wrong = Column(Text)
    lessons_json = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Pattern(Base):
    __tablename__ = "patterns"
    id = Column(Integer, primary_key=True, autoincrement=True)
    domain_pack_id = Column(String, nullable=True)
    pattern_type = Column(String) # "Blind Spot", "Success Pattern", "Bias"
    statement = Column(Text)
    confidence = Column(Integer, default=80)
    supporting_decisions_json = Column(Text) # array of decision IDs
    created_at = Column(DateTime, default=datetime.utcnow)

# ==========================================
# PHASE 5: REALITY, PROVENANCE & OBSERVABILITY
# ==========================================

class ProvenanceType(str, enum.Enum):
    SOURCE_FACT = "Source Fact"
    EXTRACTED_CLAIM = "Extracted Claim"
    AI_INFERENCE = "AI Inference"
    ASSUMPTION = "Assumption"
    PREDICTION = "Prediction"
    RECOMMENDATION = "Recommendation"
    HUMAN_JUDGMENT = "Human Judgment"
    # Apex 5.0 Calibration Types
    HARD_EVIDENCE = "Hard Evidence"
    SOFT_EVIDENCE = "Soft Evidence"
    MARKETING_CLAIM = "Marketing Claim"
    FORWARD_LOOKING = "Forward Looking Statement"
    UNKNOWN = "Unknown"

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    filename = Column(String)
    file_type = Column(String) # pdf, txt, docx
    content_hash = Column(String, nullable=True)
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    chunks = relationship("Chunk", back_populates="document", cascade="all, delete-orphan")

class Chunk(Base):
    __tablename__ = "chunks"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    chunk_index = Column(Integer)
    content = Column(Text)
    canonical_content = Column(Text, nullable=True) # Normalized text for deterministic provenance
    page_number = Column(Integer, nullable=True)
    metadata_json = Column(Text, nullable=True)
    
    document = relationship("Document", back_populates="chunks")
    
class Claim(Base):
    __tablename__ = "claims"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    statement = Column(Text)
    provenance_type = Column(String, default=ProvenanceType.EXTRACTED_CLAIM.value)
    source_chunk_id = Column(Integer, ForeignKey("chunks.id", ondelete="SET NULL"), nullable=True)
    quoted_evidence_span = Column(Text, nullable=True) # Exact substring required
    character_offsets_json = Column(Text, nullable=True) # [start, end]
    confidence = Column(Integer, default=100)
    extraction_rationale = Column(Text, nullable=True)
    verification_status = Column(String, default="Unverified")
    related_assertions_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ReasoningRun(Base):
    __tablename__ = "reasoning_runs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    experiment_batch_id = Column(String, index=True, nullable=True)
    grading_status = Column(String, default="PENDING")
    grader_failure_reason = Column(String, nullable=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    evaluation_run_id = Column(String, nullable=True, index=True)
    run_key = Column(String, unique=True, index=True, nullable=True) # Deterministic logical evaluation execution identity
    case_id = Column(String, nullable=True)
    domain_pack_id = Column(String, nullable=True)
    execution_mode = Column(String) # test | live
    evaluation_path = Column(String) # full_pipeline | controlled_reasoning
    execution_topology = Column(String) # single | parallel | deliberative
    provider = Column(String)
    model = Column(String)
    prompt_version = Column(String, nullable=True)
    status = Column(String, default="Running")
    stage_status = Column(String, default="STARTED") # INGESTION_COMPLETE, EXTRACTION_COMPLETE, etc.
    accumulated_cost = Column(Float, default=0.0)
    
    # Detailed config
    temperature = Column(Float, nullable=True)
    reasoning_config_json = Column(Text, nullable=True)
    memory_enabled = Column(Boolean, default=True)
    agent_config_json = Column(Text, nullable=True)
    retrieval_config_json = Column(Text, nullable=True)
    git_commit_hash = Column(String, nullable=True)
    intermediate_state_json = Column(Text, nullable=True) # stores round 1 and 2 outputs for resumability
    
    # Economics and latency
    latency_ms_json = Column(Text, nullable=True) # { "extraction": 120, "r1": 450... }
    cost_json = Column(Text, nullable=True) # { "extraction": 0.001 ... }
    token_usage_json = Column(Text, nullable=True) # { "input": 1200, "output": 450 }
    
    memory_objects_used_json = Column(Text, nullable=True)
    claims_used_json = Column(Text, nullable=True)
    
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    errors_json = Column(Text, nullable=True)
    output_json = Column(Text, nullable=True)

class Assertion(Base):
    __tablename__ = "assertions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    assertion_id = Column(String, index=True)
    evaluation_run_id = Column(String, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    stage = Column(String)
    source_type = Column(String)
    source_agent = Column(String, nullable=True)
    assertion_text = Column(Text)
    assertion_type = Column(String)
    cited_claim_ids_json = Column(Text, nullable=True)
    cited_assumption_ids_json = Column(Text, nullable=True)
    classification = Column(String, nullable=True)
    validation_method = Column(String, nullable=True)
    validation_rationale = Column(Text, nullable=True)

class EvidenceConflict(Base):
    __tablename__ = "evidence_conflicts"
    id = Column(Integer, primary_key=True, autoincrement=True)
    relationship_id = Column(String, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    claim_a_id = Column(Integer, ForeignKey("claims.id", ondelete="CASCADE"))
    claim_b_id = Column(Integer, ForeignKey("claims.id", ondelete="CASCADE"))
    relationship_type = Column(String)
    confidence = Column(Integer, nullable=True)
    status = Column(String, default="OPEN") # OPEN, INVESTIGATING, RESOLVED, CONFIRMED_CONTRADICTION
    origin = Column(String, default="SYSTEM_DETECTED") # SYSTEM_DETECTED, ANALYST_LOGGED
    resolution_status = Column(String, nullable=True) # Deprecated loosely in favor of status, but keep for compat
    resolution_rationale = Column(Text, nullable=True)

class ModelTelemetry(Base):
    __tablename__ = "model_telemetry"
    id = Column(Integer, primary_key=True, autoincrement=True)
    evaluation_run_id = Column(String, index=True)
    decision_id = Column(Integer, index=True)
    stage = Column(String)
    provider = Column(String)
    model = Column(String)
    input_tokens = Column(Integer, nullable=True)
    output_tokens = Column(Integer, nullable=True)
    latency_ms = Column(Integer)
    estimated_cost = Column(Float)
    retry_count = Column(Integer)
    structured_output_validity = Column(Boolean)
    timestamp = Column(DateTime, default=datetime.utcnow)

class EscalationSignal(Base):
    __tablename__ = "escalation_signals"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    evaluation_run_id = Column(String, index=True)
    signal_type = Column(String, index=True) # EXPLICIT_EVIDENCE_CONFLICT, UNSUPPORTED_MATERIAL_CLAIM, etc.
    severity = Column(String)
    
    # Deterministic Source ID Relationships (Phase 2 Hardening)
    evidence_conflict_id = Column(Integer, ForeignKey("evidence_conflicts.id", ondelete="SET NULL"), nullable=True)
    assumption_id = Column(Integer, ForeignKey("assumptions.id", ondelete="SET NULL"), nullable=True)
    
    # Retained temporarily for backward compatibility
    source_claim_ids_json = Column(Text, nullable=True)
    source_assumption_ids_json = Column(Text, nullable=True)
    source_conflict_ids_json = Column(Text, nullable=True)
    reason = Column(Text)
    recommended_challenge_type = Column(String)
    priority = Column(String)
    status = Column(String, default="DETECTED") # DETECTED, ASSIGNED, RESOLVED, IGNORED
    created_at = Column(DateTime, default=datetime.utcnow)

class ChallengeTask(Base):
    __tablename__ = "challenge_tasks"
    __table_args__ = (UniqueConstraint('decision_id', 'trigger_fingerprint', name='uq_decision_fingerprint'),)
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    evaluation_run_id = Column(String, index=True)
    
    # Deterministic Relationship (Phase 2 Hardening)
    escalation_signal_id = Column(Integer, ForeignKey("escalation_signals.id", ondelete="SET NULL"), nullable=True)
    
    target_type = Column(String) # Claim, Assumption, EvidenceConflict, Risk
    target_id = Column(String)
    challenge_question = Column(Text)
    why_material = Column(Text)
    supporting_evidence_ids_json = Column(Text, nullable=True)
    contradicting_evidence_ids_json = Column(Text, nullable=True)
    missing_information = Column(Text, nullable=True)
    challenge_mode = Column(String) # FALSIFICATION, CONTRADICTION_RESOLUTION, etc.
    trigger_fingerprint = Column(String, nullable=True, index=True) # Deterministic deduplication key
    status = Column(String, default="PENDING")
    challenge_findings_json = Column(Text, nullable=True) # Stores the LLM challenge response
    created_at = Column(DateTime, default=datetime.utcnow)

class HumanDecisionRecord(Base):
    __tablename__ = "human_decision_records"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), unique=True)
    recommendation_id = Column(Integer, ForeignKey("recommendations.id", ondelete="CASCADE"), nullable=True)
    ai_recommendation = Column(String)
    ai_confidence = Column(Integer)
    escalation_signals_json = Column(Text, nullable=True)
    challenges_performed_json = Column(Text, nullable=True)
    material_position_changes_json = Column(Text, nullable=True)
    unresolved_conflicts_json = Column(Text, nullable=True)
    human_final_decision = Column(String)
    human_rationale = Column(Text)
    override_reason = Column(Text, nullable=True)
    approvers_json = Column(Text, nullable=True)
    conditions_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChallengeFinding(Base):
    __tablename__ = "challenge_findings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    challenge_task_id = Column(Integer, ForeignKey("challenge_tasks.id", ondelete="CASCADE"), index=True, unique=True)
    position_changed = Column(Boolean, default=False)
    position_before = Column(String, nullable=True)
    position_after = Column(String, nullable=True)
    confidence_before = Column(Integer, nullable=True)
    confidence_after = Column(Integer, nullable=True)
    new_evidence_relationships_json = Column(Text, nullable=True)
    unresolved_questions = Column(Text, nullable=True)
    conditions_for_reversal = Column(Text, nullable=True)
    resolution_effect = Column(String, nullable=True) # SUPPORTS_CLAIM_A, SUPPORTS_CLAIM_B, RECONCILES_BOTH, INSUFFICIENT_EVIDENCE, CONFLICT_REMAINS
    assumption_effect = Column(String, nullable=True) # SUPPORTS, WEAKENS, INVALIDATES, NO_CHANGE
    strength = Column(String, nullable=True) # LIMITED, MATERIAL, DECISION_CRITICAL
    recommendation_impact = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    reasoning_run_id = Column(Integer, ForeignKey("reasoning_runs.id", ondelete="CASCADE"), index=True, nullable=True)
    recommendation_value = Column(String)
    recommendation_type = Column(String)
    model_confidence = Column(Integer)
    status = Column(String, default="FINALIZED") # DRAFT, BLOCKED_PENDING_REVIEW, CRITICAL_REVIEW_REQUIRED, FINALIZED
    key_risks_json = Column(Text, nullable=True)
    missing_information_json = Column(Text, nullable=True)
    
    # Autonomous Engine Additions
    version = Column(Integer, default=1)
    reasons_confidence_increased_json = Column(Text, nullable=True)
    reasons_confidence_decreased_json = Column(Text, nullable=True)
    triggering_event_id = Column(Integer, ForeignKey("domain_events.id", ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

# DecisionIntegrityEnvelope Association Tables
envelope_hard_conflicts = Table(
    'envelope_hard_conflicts', Base.metadata,
    Column('envelope_id', Integer, ForeignKey('decision_integrity_envelopes.id', ondelete="CASCADE"), primary_key=True),
    Column('conflict_id', Integer, ForeignKey('evidence_conflicts.id', ondelete="CASCADE"), primary_key=True)
)

envelope_critical_assumptions = Table(
    'envelope_critical_assumptions', Base.metadata,
    Column('envelope_id', Integer, ForeignKey('decision_integrity_envelopes.id', ondelete="CASCADE"), primary_key=True),
    Column('assumption_id', Integer, ForeignKey('assumptions.id', ondelete="CASCADE"), primary_key=True)
)

envelope_unresolved_signals = Table(
    'envelope_unresolved_signals', Base.metadata,
    Column('envelope_id', Integer, ForeignKey('decision_integrity_envelopes.id', ondelete="CASCADE"), primary_key=True),
    Column('signal_id', Integer, ForeignKey('escalation_signals.id', ondelete="CASCADE"), primary_key=True)
)

class DecisionIntegrityEnvelope(Base):
    __tablename__ = "decision_integrity_envelopes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    recommendation_id = Column(Integer, ForeignKey("recommendations.id", ondelete="CASCADE"), index=True)
    reasoning_run_id = Column(Integer, ForeignKey("reasoning_runs.id", ondelete="CASCADE"), index=True)
    
    # Relationally Strong Deterministic Associations
    hard_conflicts = relationship("EvidenceConflict", secondary=envelope_hard_conflicts)
    critical_assumptions = relationship("Assumption", secondary=envelope_critical_assumptions)
    unresolved_signals = relationship("EscalationSignal", secondary=envelope_unresolved_signals)
    
    # COMPATIBILITY_PROJECTION_NOT_AUTHORITY
    hard_conflicts_json = Column(Text) 
    critical_assumptions_json = Column(Text)
    unresolved_high_severity_signals_json = Column(Text)
    
    mandatory_human_review = Column(Boolean, default=False)
    blocking_conditions_json = Column(Text)
    required_next_actions_json = Column(Text)
    integrity_status = Column(String) # CLEAR, CONDITIONAL, BLOCKED_PENDING_REVIEW, CRITICAL_REVIEW_REQUIRED
    generated_at = Column(DateTime, default=datetime.utcnow)
    formula_version = Column(String)

class ReviewRun(Base):
    __tablename__ = "review_runs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    deck_version = Column(Integer)
    status = Column(String, default="Running")
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    duration_ms = Column(Integer, nullable=True)
    token_usage_json = Column(Text, nullable=True)
    provider = Column(String, nullable=True)
    model = Column(String, nullable=True)

class ActionItem(Base):
    __tablename__ = "action_items"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    title = Column(String)
    priority = Column(String)
    status = Column(String, default="TODO")
    problem = Column(Text, nullable=True)
    why_investors_care = Column(Text, nullable=True)
    missing_evidence = Column(Text, nullable=True)
    definition_of_done = Column(Text, nullable=True)
    estimated_effort = Column(String, nullable=True)
    expected_impact = Column(String, nullable=True)
    verification_criteria = Column(Text, nullable=True)
    linked_assumption_id = Column(Integer, ForeignKey("assumptions.id", ondelete="SET NULL"), nullable=True)
    linked_conflict_id = Column(Integer, ForeignKey("evidence_conflicts.id", ondelete="SET NULL"), nullable=True)
    linked_claim_id = Column(Integer, ForeignKey("claims.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class DomainEvent(Base):
    __tablename__ = "domain_events"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    event_type = Column(String, index=True)
    entity_type = Column(String)
    entity_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    actor = Column(String, nullable=True)
    metadata_json = Column(Text, nullable=True)

class InvestorMeeting(Base):
    __tablename__ = "investor_meetings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    investor_name = Column(String)
    fund_name = Column(String, nullable=True)
    stage = Column(String, nullable=True)
    meeting_date = Column(DateTime)
    founder_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    questions = relationship("InvestorQuestion", back_populates="meeting", cascade="all, delete-orphan")

class InvestorQuestion(Base):
    __tablename__ = "investor_questions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    meeting_id = Column(Integer, ForeignKey("investor_meetings.id", ondelete="CASCADE"), index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id", ondelete="CASCADE"), index=True)
    question_text = Column(Text)
    category = Column(String) # Market, Team, Traction, etc.
    frequency = Column(Integer, default=1)
    related_assumption_ids_json = Column(Text, nullable=True)
    related_claim_ids_json = Column(Text, nullable=True)
    related_evidence_ids_json = Column(Text, nullable=True)
    related_risks_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    meeting = relationship("InvestorMeeting", back_populates="questions")
