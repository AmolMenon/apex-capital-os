from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from operations_autopilot_engine.operations_orchestrator import OperationsOrchestrator

router = APIRouter()

@router.get("/status")
def get_operations_status() -> Dict[str, Any]:
    return OperationsOrchestrator.get_status()

# Tasks
@router.get("/tasks")
def get_tasks() -> List[Dict[str, Any]]:
    return OperationsOrchestrator.get_tasks()

@router.post("/tasks/generate")
def generate_tasks() -> List[Dict[str, Any]]:
    return OperationsOrchestrator.get_tasks()

@router.get("/tasks/{task_id}")
def get_task(task_id: str) -> Dict[str, Any]:
    tasks = OperationsOrchestrator.get_tasks()
    for t in tasks:
        if t["task_id"] == task_id:
            return t
    raise HTTPException(status_code=404, detail="Task not found")

@router.put("/tasks/{task_id}")
def update_task(task_id: str, payload: dict) -> Dict[str, Any]:
    return {"status": "updated", "task_id": task_id}

@router.post("/tasks/{task_id}/complete")
def complete_task(task_id: str) -> Dict[str, Any]:
    success = OperationsOrchestrator.complete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"status": "completed"}

@router.post("/tasks/{task_id}/block")
def block_task(task_id: str) -> Dict[str, Any]:
    success = OperationsOrchestrator.block_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"status": "blocked"}

# Workflows
@router.get("/workflows")
def get_workflows() -> List[Dict[str, Any]]:
    return OperationsOrchestrator.get_workflows()

@router.get("/workflows/{entity_type}/{entity_id}")
def get_workflow(entity_type: str, entity_id: str) -> Dict[str, Any]:
    wfs = OperationsOrchestrator.get_workflows()
    for wf in wfs:
        if wf["entity_type"] == entity_type and wf["entity_id"] == entity_id:
            return wf
    raise HTTPException(status_code=404, detail="Workflow not found")

@router.put("/workflows/{entity_type}/{entity_id}/stage")
def update_workflow_stage(entity_type: str, entity_id: str, payload: dict) -> Dict[str, Any]:
    stage = payload.get("stage")
    success = OperationsOrchestrator.update_workflow(entity_type, entity_id, stage)
    return {"status": "updated" if success else "not_found"}

# Next Actions
@router.get("/next-actions")
def get_next_actions() -> List[Dict[str, Any]]:
    return OperationsOrchestrator.get_next_actions()

@router.get("/next-actions/deals/{deal_id}")
def get_deal_next_actions(deal_id: str) -> List[Dict[str, Any]]:
    return [a for a in OperationsOrchestrator.get_next_actions() if a["entity_type"] == "deal" and a["entity_id"] == deal_id]

@router.get("/next-actions/portfolio/{company_id}")
def get_portfolio_next_actions(company_id: str) -> List[Dict[str, Any]]:
    return [a for a in OperationsOrchestrator.get_next_actions() if a["entity_type"] == "portfolio_company" and a["entity_id"] == company_id]

@router.get("/next-actions/fund")
def get_fund_next_actions() -> List[Dict[str, Any]]:
    return [a for a in OperationsOrchestrator.get_next_actions() if a["entity_type"] == "lp"]

# Alerts
@router.get("/alerts")
def get_alerts() -> List[Dict[str, Any]]:
    return OperationsOrchestrator.get_alerts()

@router.post("/alerts/refresh")
def refresh_alerts() -> Dict[str, Any]:
    OperationsOrchestrator.refresh_alerts()
    return {"status": "refreshed"}

# Notifications
@router.get("/notifications")
def get_notifications() -> List[Dict[str, Any]]:
    return OperationsOrchestrator.get_notifications()

@router.post("/notifications/draft")
def draft_notification(payload: dict) -> Dict[str, Any]:
    return {"status": "draft_created"}

# Approvals
@router.get("/approvals")
def get_approvals() -> List[Dict[str, Any]]:
    return OperationsOrchestrator.get_approvals()

@router.post("/approvals")
def create_approval(payload: dict) -> Dict[str, Any]:
    return {"status": "created"}

@router.post("/approvals/{approval_id}/approve")
def approve_request(approval_id: str) -> Dict[str, Any]:
    return {"status": "approved"}

@router.post("/approvals/{approval_id}/reject")
def reject_request(approval_id: str) -> Dict[str, Any]:
    return {"status": "rejected"}

# Cadence
@router.get("/cadence/daily")
def get_daily_cadence() -> Dict[str, Any]:
    return OperationsOrchestrator.get_cadence("daily")

@router.get("/cadence/weekly-partner")
def get_weekly_partner_cadence() -> Dict[str, Any]:
    return OperationsOrchestrator.get_cadence("weekly_partner")

@router.get("/cadence/sourcing")
def get_sourcing_cadence() -> Dict[str, Any]:
    return OperationsOrchestrator.get_cadence("sourcing")

@router.get("/cadence/portfolio")
def get_portfolio_cadence() -> Dict[str, Any]:
    return OperationsOrchestrator.get_cadence("portfolio")

@router.get("/cadence/lp-update")
def get_lp_update_cadence() -> Dict[str, Any]:
    return OperationsOrchestrator.get_cadence("lp_update")

# Audit
@router.get("/audit-log")
def get_audit_log() -> List[Dict[str, Any]]:
    return OperationsOrchestrator.get_audit_logs()
