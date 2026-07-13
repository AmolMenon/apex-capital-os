from .fund_os_schemas import LPReport

def generate_lp_report() -> LPReport:
    """
    Generates the quarterly LP update report.
    """
    return LPReport(
        executive_summary="Apex Demo Fund I has deployed 25% of committed capital across 12 investments. Portfolio health remains strong with a weighted score of 85.",
        fund_overview="Fund Size: 100 Cr | Vintage: 2026 | Strategy: Early-stage AI & Deeptech",
        deployment_progress="Deployed: 25 Cr | Reserved: 40 Cr | Dry Powder: 35 Cr",
        portfolio_construction="Tracking closely to our target of 40% AI and 20% Deeptech. Currently slightly overweight in AI applications.",
        portfolio_health="Overall health is excellent. 4 follow-on candidates identified.",
        top_companies=["NeuralDesk", "Sarvam", "Zepto"],
        companies_needing_support=["Acme Analytics (High Burn)"],
        follow_on_candidates=["NeuralDesk", "Mistral"],
        reserve_strategy="Reserves are being strategically preserved for Series A pro-ratas in our top quartile assets.",
        fund_risks=["Valuation compression in AI application layer.", "Regulatory uncertainties in deeptech."],
        value_creation="Active interventions deployed in 2 companies to optimize GTM strategies.",
        market_commentary="The broader venture market is stabilizing, with a flight to quality. AI infrastructure continues to see premium valuations.",
        case_studies=["NeuralDesk: Seamless integration of Agentic AI leading to 3x ARR growth."],
        next_quarter_priorities=["Issue Q3 Capital Call", "Close 2 Seed deals in Commerce Infra"],
        appendix="Detailed financials available in the secure LP portal.",
        version="LP-facing",
        is_mock=True
    )
