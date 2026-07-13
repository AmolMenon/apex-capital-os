from typing import List, Dict, Any
from .operations_fixtures import MOCK_AUDIT_LOGS

class AuditLogEngine:
    @staticmethod
    def get_audit_logs() -> List[Dict[str, Any]]:
        return MOCK_AUDIT_LOGS
