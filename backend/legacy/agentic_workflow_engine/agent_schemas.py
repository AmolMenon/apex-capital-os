from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class AgentOutput(BaseModel):
    agent_name: str
    task: str
    input_summary: str
    output: Any
    confidence: str
    sources_used: List[str]
    assumptions: List[str]
    unknowns: List[str]
    next_actions: List[str]
    metadata: Dict[str, Any]

class AgentTraceStep(BaseModel):
    step_id: str
    agent_name: str
    status: str
    started_at: str
    completed_at: Optional[str] = None
    output: Optional[AgentOutput] = None
    error: Optional[str] = None

class AgentFinding(BaseModel):
    finding_type: str
    content: str
    confidence: str
    source_reference: Optional[str] = None

class AgentQuestion(BaseModel):
    question: str
    reason: str
    target: str

class AgentCritique(BaseModel):
    objection: str
    severity: str
    evidence_missing: str

class AgentDecisionImpact(BaseModel):
    recommendation_cap: str
    reason: str
    blockers: List[str]

class AgenticResearchReport(BaseModel):
    public_benchmark_conclusion: str
    private_diligence_required: List[str]
    fund_fit_summary: str
    ic_readiness_status: str
    recommended_next_step: str
    key_findings: List[AgentFinding]

class AgentWorkflowMetadata(BaseModel):
    provider_used: str
    fallback_used: bool
    sources_reviewed: int
    claims_verified: int
    assumptions_created: int
    unknown_metrics: int
    created_at: str
    completed_at: Optional[str] = None

class AgentWorkflowRun(BaseModel):
    run_id: str
    deal_id: str
    company_name: str
    workflow_mode: str
    status: str
    agents_run: List[str]
    trace: List[AgentTraceStep]
    final_report: Optional[AgenticResearchReport] = None
    metadata: AgentWorkflowMetadata
