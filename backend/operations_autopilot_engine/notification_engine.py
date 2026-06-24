from typing import List, Dict, Any
from .operations_fixtures import MOCK_NOTIFICATIONS

class NotificationEngine:
    @staticmethod
    def get_notifications() -> List[Dict[str, Any]]:
        return MOCK_NOTIFICATIONS
