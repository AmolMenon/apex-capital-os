from .fund_os_schemas import CapitalCallPlan

def generate_capital_call_plan(payload: dict = None) -> CapitalCallPlan:
    """
    Generates a mock capital call plan.
    Disclaimer: Not legal, tax, or accounting advice.
    """
    return CapitalCallPlan(
        suggested_amount=200000000.0, # 20 Cr
        reason="Q3 Deployment and Follow-on Reserves",
        timing="Expected Q3 2026",
        use_of_proceeds=["NeuralDesk Series A Pro-rata", "3 new seed checks in DeepTech"],
        companies_supported=["NeuralDesk", "TBD DeepTech 1", "TBD DeepTech 2", "TBD DeepTech 3"],
        dry_powder_after_call=150000000.0,
        lp_communication_draft="Dear LPs, we are issuing a capital call for 20 Cr to fund upcoming pro-rata allocations in our highest performing assets...",
        is_mock_plan=True
    )
