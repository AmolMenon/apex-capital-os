from typing import List
from .fund_os_schemas import LPProfile
from .fund_os_fixtures import MOCK_LPS

def get_lps() -> List[LPProfile]:
    """
    Returns all LP profiles (Family Offices, Institutionals, etc).
    These are mock LPs for the demo.
    """
    return [LPProfile(**lp) for lp in MOCK_LPS]

def get_lp_by_id(lp_id: str) -> LPProfile:
    for lp in MOCK_LPS:
        if lp["lp_id"] == lp_id:
            return LPProfile(**lp)
    raise ValueError(f"LP with id {lp_id} not found.")
