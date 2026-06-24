from typing import List, Dict, Any
from .operations_fixtures import MOCK_NEXT_ACTIONS

class NextBestActionEngine:
    @staticmethod
    def get_next_actions() -> List[Dict[str, Any]]:
        return MOCK_NEXT_ACTIONS
