from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ApexTask(BaseModel):
    task_id: str
    title: str
    description: str
    source_module: str
    source_entity_type: str
    source_entity_id: str
    owner: str
    priority: str
    status: str
    due_date: str
    task_type: str
    blocking_ic: bool = False
    blocking_follow_on: bool = False
    blocking_lp_report: bool = False
    dependencies: List[str] = []
    recommended_action: str
    evidence_reference: str
    created_at: str
    updated_at: str
    metadata: Dict[str, Any] = {}

class WorkflowStage(BaseModel):
    entity_id: str
    entity_type: str
    current_stage: str
    next_stage: Optional[str] = None
    completion_percentage: int
    blockers: List[str] = []
    required_tasks: List[str] = []

class NextBestAction(BaseModel):
    action_id: str
    entity_id: str
    entity_type: str
    action: str
    why_now: str
    owner: str
    due_date: str
    related_tasks: List[str] = []
    expected_impact: str
    open_blockers: List[str] = []

class ApexAlert(BaseModel):
    alert_id: str
    title: str
    severity: str
    source_module: str
    entity_id: str
    entity_type: str
    reason: str
    recommended_action: str
    owner: str
    due_date: str
    status: str = "active"

class NotificationDraft(BaseModel):
    notification_id: str
    subject: str
    message: str
    recipient_role: str
    urgency: str
    send_channel: str
    status: str = "draft"
    related_entity_id: str
    related_entity_type: str

class ApprovalRequest(BaseModel):
    approval_id: str
    action: str
    requester: str
    approver_role: str
    risk: str
    reason: str
    related_entity_id: str
    related_entity_type: str
    evidence: str
    status: str = "pending"

class OperatingCadence(BaseModel):
    cadence_type: str
    title: str
    agenda: List[str]
    required_prep: List[str]
    suggested_attendees: List[str]
    open_tasks: List[str]
    meeting_notes_draft: str

class WorkflowAuditLog(BaseModel):
    log_id: str
    actor: str
    action: str
    entity_id: str
    entity_type: str
    source_module: str
    timestamp: str
    details: str

class OperationsSummary(BaseModel):
    top_priorities: List[ApexTask]
    critical_blockers: List[ApexTask]
    next_actions: List[NextBestAction]
    active_alerts: List[ApexAlert]
    pending_approvals: List[ApprovalRequest]
