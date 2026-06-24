from typing import Dict, Any
from .operations_fixtures import MOCK_CADENCE

class OperatingCadenceEngine:
    @staticmethod
    def get_cadence(cadence_type: str) -> Dict[str, Any]:
        return MOCK_CADENCE.get(cadence_type, {})
