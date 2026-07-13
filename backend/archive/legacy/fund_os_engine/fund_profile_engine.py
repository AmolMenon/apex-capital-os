from .fund_os_schemas import FundProfile
from .fund_os_fixtures import MOCK_FUND_PROFILE

def get_fund_profile() -> FundProfile:
    """
    Returns the core strategy and metadata of the fund.
    Currently backed by static MOCK_FUND_PROFILE for demo purposes.
    """
    return FundProfile(**MOCK_FUND_PROFILE)
