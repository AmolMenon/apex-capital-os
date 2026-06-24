from typing import List, Dict, Any
from portfolio_intelligence_engine.portfolio_company_registry import registry
from portfolio_intelligence_engine.portfolio_fixtures import (
    get_mock_health, get_mock_founder_updates, get_mock_board_deck_analysis,
    get_mock_follow_on_recommendation, get_mock_reserve_allocation,
    get_mock_value_creation_plan, get_mock_kpi_timeseries
)
from portfolio_intelligence_engine.portfolio_schemas import (
    PortfolioSummary, LPReport, PortfolioRisk, PortfolioCompany
)

class PortfolioOrchestrator:
    def __init__(self):
        self.registry = registry

    def get_portfolio_status(self) -> Dict[str, Any]:
        companies = self.registry.get_all_companies()
        return {
            "status": "online",
            "portfolio_companies_loaded": len(companies),
            "kpi_fixtures_loaded": True,
            "founder_update_parser_status": "online",
            "board_deck_intelligence_status": "online",
            "follow_on_engine_status": "online",
            "reserve_engine_status": "online",
            "lp_report_engine_status": "online",
            "feature_health": {
                "Portfolio HQ": "Healthy",
                "Portfolio Company Page": "Healthy",
                "Follow-On Decision": "Healthy",
                "Reserves": "Healthy",
                "Value Creation": "Healthy",
                "LP Report": "Healthy"
            }
        }

    def get_portfolio_companies(self) -> List[PortfolioCompany]:
        return self.registry.get_all_companies()

    def get_portfolio_company(self, company_id: str):
        return self.registry.get_company(company_id)

    def convert_deal_to_portfolio(self, deal_id: str, deal_data: dict):
        return self.registry.convert_deal_to_portfolio_company(deal_id, deal_data)

    def get_kpis(self, company_id: str):
        return get_mock_kpi_timeseries(company_id)

    def get_founder_updates(self, company_id: str):
        return get_mock_founder_updates(company_id)

    def add_founder_update(self, company_id: str, payload: dict):
        # Mocking the ingestion of a new founder update
        return {"status": "success", "message": "Founder update parsed and stored."}

    def get_board_deck_analysis(self, company_id: str):
        return get_mock_board_deck_analysis(company_id)

    def analyze_board_deck(self, company_id: str, payload: dict):
        # Mocking board deck analysis
        return {"status": "success", "message": "Board deck analyzed."}

    def get_health(self, company_id: str):
        return get_mock_health(company_id)

    def get_follow_on_recommendation(self, company_id: str):
        return get_mock_follow_on_recommendation(company_id)

    def get_value_creation_plan(self, company_id: str):
        return get_mock_value_creation_plan(company_id)

    def get_reserve_allocation(self, company_id: str):
        return get_mock_reserve_allocation(company_id)

    def get_portfolio_health_summary(self) -> PortfolioSummary:
        companies = self.registry.get_all_companies()
        
        active = sum(1 for c in companies if c.portfolio_status == "active")
        follow_on = sum(1 for c in companies if c.portfolio_status == "follow_on_candidate")
        watchlist = sum(1 for c in companies if c.portfolio_status == "watchlist")
        support = sum(1 for c in companies if c.portfolio_status == "needs_support")
        
        total_health = 0
        for c in companies:
            health = get_mock_health(c.company_id)
            if health:
                total_health += health.overall_score
                
        avg_health = int(total_health / len(companies)) if companies else 0

        return PortfolioSummary(
            total_companies=len(companies),
            active_companies=active,
            follow_on_candidates=follow_on,
            watchlist_companies=watchlist,
            companies_needing_support=support,
            average_health_score=avg_health,
            reserve_availability="$12M remaining"
        )

    def get_portfolio_risks(self) -> List[PortfolioRisk]:
        return [
            PortfolioRisk(
                risk_type="Runway Risk",
                companies_affected=["comp-paynest", "comp-vetpulse"],
                severity="High",
                trend="Deteriorating",
                evidence="PayNest runway < 8 months with high burn.",
                recommended_action="Initiate burn reduction plans immediately.",
                partner_owner="Sarah"
            ),
            PortfolioRisk(
                risk_type="Margin Compression",
                companies_affected=["comp-carbonloop", "comp-gridsense"],
                severity="Medium",
                trend="Stable",
                evidence="CarbonLoop margins dipped to 42% due to manual fulfillment.",
                recommended_action="Audit unit economics before Series A term sheets.",
                partner_owner="Elena"
            )
        ]

    def get_portfolio_reserves(self) -> Dict[str, Any]:
        return {
            "total_reserves": "$40M",
            "allocated": "$28M",
            "remaining": "$12M",
            "allocations": [
                get_mock_reserve_allocation("comp-neuraldesk"),
                get_mock_reserve_allocation("comp-carbonloop"),
                get_mock_reserve_allocation("comp-paynest")
            ],
            "over_reserved": ["comp-paynest"],
            "under_reserved": ["comp-carbonloop"]
        }

    def get_follow_on_candidates(self) -> List[Any]:
        return [
            get_mock_follow_on_recommendation("comp-carbonloop"),
            get_mock_follow_on_recommendation("comp-neuraldesk")
        ]

    def generate_lp_report(self) -> LPReport:
        return LPReport(
            report_id="lp-q2-2024",
            period="Q2 2024",
            portfolio_summary="The portfolio saw strong revenue growth (average +45% YoY) primarily driven by enterprise AI and Climate Tech. However, we are actively managing runway risks in the fintech segment.",
            top_performers=["CarbonLoop", "NeuralDesk"],
            companies_needing_support=["VetPulse AI"],
            follow_on_candidates=["CarbonLoop"],
            portfolio_risks=["Runway risk in PayNest", "Margin compression in CarbonLoop"],
            reserve_allocation_view="Re-allocating $5M from PayNest reserves toward CarbonLoop Series A.",
            key_metrics_summary="Total Portfolio ARR: $42M. Total Enterprise Value: $850M.",
            value_creation_work="Focusing Q3 on GTM support for VetPulse and enterprise introductions for NeuralDesk.",
            market_commentary="AI infrastructure continues to command high premiums. We are advising founders to secure 24-30 months of runway.",
            next_quarter_priorities=["CarbonLoop Series A", "VetPulse GTM Reboot"],
            markdown_content="# LP Report Q2 2024\n\n*Mock portfolio data for demo purposes.*\n\n## Summary\nStrong quarter driven by CarbonLoop."
        )

portfolio_orchestrator = PortfolioOrchestrator()
