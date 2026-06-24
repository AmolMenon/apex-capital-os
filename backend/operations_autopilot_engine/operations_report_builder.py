class OperationsReportBuilder:
    @staticmethod
    def build_summary(tasks, actions, alerts, approvals) -> dict:
        critical_tasks = [t for t in tasks if t.get("blocking_ic") or t.get("priority") == "critical"]
        return {
            "top_priorities": tasks[:5],
            "critical_blockers": critical_tasks,
            "next_actions": actions,
            "active_alerts": alerts,
            "pending_approvals": approvals
        }
