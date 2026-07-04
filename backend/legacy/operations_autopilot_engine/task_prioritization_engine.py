from typing import List, Dict, Any

class TaskPrioritizationEngine:
    @staticmethod
    def prioritize_tasks(tasks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        # Sort by priority (critical > high > medium > low)
        priority_map = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        return sorted(tasks, key=lambda t: priority_map.get(t.get("priority", "low"), 4))
