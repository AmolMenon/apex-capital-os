from typing import Dict, Any
from .task_generation_engine import TaskGenerationEngine
from .task_prioritization_engine import TaskPrioritizationEngine
from .workflow_state_engine import WorkflowStateEngine
from .next_best_action_engine import NextBestActionEngine
from .alert_engine import AlertEngine
from .approval_engine import ApprovalEngine
from .notification_engine import NotificationEngine
from .external_integration_router import ExternalIntegrationRouter
from .operating_cadence_engine import OperatingCadenceEngine
from .audit_log_engine import AuditLogEngine
from .operations_report_builder import OperationsReportBuilder
from .operations_fixtures import MOCK_TASKS

class OperationsOrchestrator:
    @staticmethod
    def get_status() -> Dict[str, Any]:
        return {
            "status": "healthy",
            "task_engine_loaded": True,
            "workflow_engine_loaded": True,
            "alerts_active": True,
            "notification_mode": "draft_only",
            "approvals_enabled": True,
            "audit_log_enabled": True,
            "integrations": ExternalIntegrationRouter.get_status()
        }

    @staticmethod
    def get_tasks() -> list:
        return TaskPrioritizationEngine.prioritize_tasks(TaskGenerationEngine.generate_tasks_from_insights())
        
    @staticmethod
    def complete_task(task_id: str) -> bool:
        for t in MOCK_TASKS:
            if t["task_id"] == task_id:
                t["status"] = "completed"
                return True
        return False
        
    @staticmethod
    def block_task(task_id: str) -> bool:
        for t in MOCK_TASKS:
            if t["task_id"] == task_id:
                t["status"] = "blocked"
                return True
        return False

    @staticmethod
    def get_workflows() -> list:
        return WorkflowStateEngine.get_all_workflows()

    @staticmethod
    def update_workflow(entity_type: str, entity_id: str, stage: str) -> bool:
        return WorkflowStateEngine.update_workflow_stage(entity_id, stage)

    @staticmethod
    def get_next_actions() -> list:
        return NextBestActionEngine.get_next_actions()

    @staticmethod
    def get_alerts() -> list:
        return AlertEngine.get_alerts()

    @staticmethod
    def refresh_alerts() -> bool:
        return AlertEngine.refresh_alerts()

    @staticmethod
    def get_notifications() -> list:
        return NotificationEngine.get_notifications()

    @staticmethod
    def get_approvals() -> list:
        return ApprovalEngine.get_approvals()

    @staticmethod
    def get_cadence(type: str) -> dict:
        return OperatingCadenceEngine.get_cadence(type)

    @staticmethod
    def get_audit_logs() -> list:
        return AuditLogEngine.get_audit_logs()
        
    @staticmethod
    def get_summary() -> dict:
        tasks = OperationsOrchestrator.get_tasks()
        actions = OperationsOrchestrator.get_next_actions()
        alerts = OperationsOrchestrator.get_alerts()
        approvals = OperationsOrchestrator.get_approvals()
        return OperationsReportBuilder.build_summary(tasks, actions, alerts, approvals)
