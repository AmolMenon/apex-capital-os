from .fund_os_schemas import FundPerformanceSummary
from .fund_os_fixtures import MOCK_FUND_PERFORMANCE

def get_fund_performance() -> FundPerformanceSummary:
    """
    Returns the core performance metrics (TVPI, DPI, MOIC) of the fund.
    Disclaimer: Fund performance figures are demo calculations unless connected to verified fund accounting data.
    """
    return FundPerformanceSummary(**MOCK_FUND_PERFORMANCE)
