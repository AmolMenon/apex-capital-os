from typing import List, Dict, Any
from .operations_fixtures import MOCK_ALERTS

class AlertEngine:
    @staticmethod
    def get_alerts() -> List[Dict[str, Any]]:
        return MOCK_ALERTS
        
    @staticmethod
    def refresh_alerts() -> bool:
        return True
