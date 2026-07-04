from typing import List, Dict, Any
from .operations_fixtures import MOCK_APPROVALS

class ApprovalEngine:
    @staticmethod
    def get_approvals() -> List[Dict[str, Any]]:
        return MOCK_APPROVALS
        
    @staticmethod
    def approve_request(approval_id: str) -> bool:
        for app in MOCK_APPROVALS:
            if app["approval_id"] == approval_id:
                app["status"] = "approved"
                return True
        return False
        
    @staticmethod
    def reject_request(approval_id: str) -> bool:
        for app in MOCK_APPROVALS:
            if app["approval_id"] == approval_id:
                app["status"] = "rejected"
                return True
        return False
