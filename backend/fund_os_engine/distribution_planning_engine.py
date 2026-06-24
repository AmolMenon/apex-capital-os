from .fund_os_schemas import DistributionPlan

def get_distribution_planning() -> DistributionPlan:
    """
    Mock distribution planning.
    """
    return DistributionPlan(
        realized_proceeds=0.0,
        distribution_amount=0.0,
        lp_distribution_summary="No realized exits available in current data.",
        dpi_impact="0.0x",
        remaining_unrealized_value=310000000.0,
        notes="Fund is still in active deployment phase.",
        is_mock_plan=True
    )
