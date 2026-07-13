from typing import List
from .fund_os_schemas import FundRisk

def get_fund_risks() -> List[FundRisk]:
    """
    Tracks risks at the fund level.
    """
    return [
        FundRisk(
            risk_id="risk_1",
            category="Concentration Risk",
            severity="Medium",
            evidence="28% of deployed capital is concentrated in top 3 assets.",
            companies_affected=["NeuralDesk", "Sarvam", "Zepto"],
            fund_impact="If AI valuations compress, TVPI could drop significantly.",
            recommended_action="Balance next 5 checks towards healthcare and commerce infrastructure.",
            owner="Managing Partner",
            timeline="Q3 2026"
        ),
        FundRisk(
            risk_id="risk_2",
            category="Reserve Risk",
            severity="High",
            evidence="Follow-on candidates outstripping allocated reserve pools.",
            companies_affected=["NeuralDesk"],
            fund_impact="Might miss pro-rata in fund returners.",
            recommended_action="Review SPV strategy for NeuralDesk Series B.",
            owner="CFO",
            timeline="Q4 2026"
        )
    ]
