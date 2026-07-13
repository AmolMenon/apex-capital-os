from typing import List, Dict
from portfolio_intelligence_engine.portfolio_schemas import PortfolioCompany
from portfolio_intelligence_engine.portfolio_fixtures import MOCK_PORTFOLIO_COMPANIES

class PortfolioCompanyRegistry:
    def __init__(self):
        # Default to loading the mock fixtures into memory
        self.companies: Dict[str, PortfolioCompany] = {}
        self.load_mocks()

    def load_mocks(self):
        for company_id, company in MOCK_PORTFOLIO_COMPANIES.items():
            self.companies[company_id] = company

    def get_all_companies(self) -> List[PortfolioCompany]:
        return list(self.companies.values())

    def get_company(self, company_id: str) -> PortfolioCompany:
        return self.companies.get(company_id)

    def convert_deal_to_portfolio_company(self, deal_id: str, deal_data: dict) -> PortfolioCompany:
        """
        In a real app, this would query the deals DB, extract the valuation, check size, etc.
        For now, we create a mock conversion.
        """
        company_id = f"comp-{deal_id}"
        new_company = PortfolioCompany(
            company_id=company_id,
            deal_id=deal_id,
            company_name=deal_data.get("company_name", "Unknown Co"),
            sector=deal_data.get("sector", "Technology"),
            stage_at_entry="Seed",
            entry_date="2024-06-12",
            entry_valuation="TBD",
            initial_check_size="TBD",
            initial_ownership="TBD",
            current_ownership="TBD",
            reserve_allocated="TBD",
            lead_partner="Analyst",
            portfolio_status="active",
            latest_health_score=80,
            metadata={}
        )
        self.companies[company_id] = new_company
        return new_company

# Global registry instance
registry = PortfolioCompanyRegistry()
