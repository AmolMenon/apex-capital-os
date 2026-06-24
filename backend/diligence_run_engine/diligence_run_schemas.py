from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import datetime

class DiligenceRunStep(BaseModel):
    step_id: str
    name: str
    status: str  # pending/running/completed/failed/skipped/warning
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    summary: Optional[str] = None
    outputs: Dict[str, Any] = {}
    warnings: List[str] = []
    errors: List[str] = []

class DiligenceRunMetadata(BaseModel):
    user_id: Optional[str] = None
    trigger: Optional[str] = None

class DiligenceRun(BaseModel):
    run_id: str
    deal_id: str
    company_name: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    status: str  # queued/running/completed/failed/completed_with_warnings
    mode: str    # mock/real/hybrid
    steps: List[DiligenceRunStep] = []
    final_recommendation: Optional[str] = None
    evidence_confidence: Optional[str] = None
    trust_score: Optional[int] = None
    ic_readiness: Optional[str] = None
    missing_information: List[str] = []
    critical_blockers: List[str] = []
    next_actions: List[str] = []
    report: Dict[str, Any] = {}
    metadata: Dict[str, Any] = {}

class DiligenceRunRequest(BaseModel):
    include_public_research: bool = True
    include_uploaded_documents: bool = True
    include_war_room: bool = True
    generate_ic_packet: bool = True
    create_operations_tasks: bool = True
    mock_mode_fallback: bool = True

class DiligenceRunFinding(BaseModel):
    finding: str
    category: str
    confidence: str

class DiligenceRunGap(BaseModel):
    gap: str
    severity: str # Critical/High/Medium/Low
    category: str

class DiligenceRunRecommendation(BaseModel):
    recommendation: str
    confidence: str
    evidence_supporting: List[str] = []
    blockers: List[str] = []
    deterministic_gates_applied: List[str] = []
    what_would_change_recommendation: str = ""
    next_best_action: str = ""

class DiligenceRunContext(BaseModel):
    deal_id: str
    company_name: str
    sector: Optional[str] = None
    stage: Optional[str] = None
    description: Optional[str] = None
    source_type: Optional[str] = None
    
    # Internal context elements
    documents_reviewed: List[Dict[str, Any]] = []
    extracted_claims: List[Dict[str, Any]] = []
    public_research: Dict[str, Any] = {}
    missing_information: List[DiligenceRunGap] = []
    generated_questions: List[Dict[str, str]] = []
    
    # Synthesis flags
    is_diligence_ready: bool = False
    readiness_level: str = "Minimal"
