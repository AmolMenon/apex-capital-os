from .fund_os_schemas import ConcentrationAnalysis

def get_concentration_analysis() -> ConcentrationAnalysis:
    """
    Generates exposure analysis for the fund.
    """
    return ConcentrationAnalysis(
        heatmap_data={
            "AI": 45.0,
            "Healthcare": 15.0,
            "Deeptech": 25.0,
            "Commerce": 15.0
        },
        overexposure_warnings=["AI Application Layer (45% vs 40% Target)"],
        underexposure_warnings=["Healthcare Platforms (15% vs 20% Target)"],
        diversification_gaps=["No recent seed investments in core commerce infrastructure."],
        risk_clusters=["AI regulatory risks", "Deeptech commercialization timelines"],
        recommended_balancing_actions=["Prioritize sourcing healthcare platforms for Q3."]
    )
