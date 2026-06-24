from .decision_lab_fixtures import HISTORICAL_CASES
from typing import List

class HistoricalCaseRegistry:
    def get_all(self):
        return HISTORICAL_CASES
        
    def get(self, case_id: str):
        for c in HISTORICAL_CASES:
            if c.case_id == case_id:
                return c
        return None

registry = HistoricalCaseRegistry()
