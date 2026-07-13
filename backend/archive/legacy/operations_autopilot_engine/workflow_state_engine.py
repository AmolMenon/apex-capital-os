from typing import List, Dict, Any
from .operations_fixtures import MOCK_WORKFLOWS

class WorkflowStateEngine:
    @staticmethod
    def get_all_workflows() -> List[Dict[str, Any]]:
        return MOCK_WORKFLOWS
        
    @staticmethod
    def update_workflow_stage(entity_id: str, new_stage: str) -> bool:
        for wf in MOCK_WORKFLOWS:
            if wf["entity_id"] == entity_id:
                wf["current_stage"] = new_stage
                return True
        return False
