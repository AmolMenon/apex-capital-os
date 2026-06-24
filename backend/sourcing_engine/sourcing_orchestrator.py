from typing import List, Dict, Any, Optional
from .sourcing_schemas import MarketRadarSignal, SourcedCompany, SourcingPipelineItem, FounderOutreachDraft
from .thesis_schemas import InvestmentThesis
from .sourcing_fixtures import MOCK_THESES, MOCK_MARKET_RADAR, MOCK_SOURCED_COMPANIES, MOCK_PIPELINE

class ThesisEngine:
    @staticmethod
    def get_theses() -> List[Dict[str, Any]]:
        return MOCK_THESES
    
    @staticmethod
    def get_thesis(thesis_id: str) -> Optional[Dict[str, Any]]:
        return next((t for t in MOCK_THESES if t["thesis_id"] == thesis_id), None)

class MarketRadarEngine:
    @staticmethod
    def get_market_radar() -> List[Dict[str, Any]]:
        return MOCK_MARKET_RADAR
        
    @staticmethod
    def refresh_market_radar() -> List[Dict[str, Any]]:
        # In live mode this hits Web Research API
        return MOCK_MARKET_RADAR

class CompanyDiscoveryEngine:
    @staticmethod
    def discover_companies(thesis_id: str = None) -> List[Dict[str, Any]]:
        if thesis_id:
            return [c for c in MOCK_SOURCED_COMPANIES if c.get("metadata", {}).get("thesis_id") == thesis_id]
        return MOCK_SOURCED_COMPANIES
        
    @staticmethod
    def get_discovered_companies() -> List[Dict[str, Any]]:
        return MOCK_SOURCED_COMPANIES
        
    @staticmethod
    def get_sourced_company(company_id: str) -> Optional[Dict[str, Any]]:
        return next((c for c in MOCK_SOURCED_COMPANIES if c["company_id"] == company_id), None)

class SourcingScoreEngine:
    @staticmethod
    def score_company(company_id: str) -> Dict[str, Any]:
        company = CompanyDiscoveryEngine.get_sourced_company(company_id)
        if company and company.get("sourcing_score"):
            return company["sourcing_score"]
        return {"total_score": 50, "sourcing_priority": "Research Required"}

class FounderOutreachEngine:
    @staticmethod
    def generate_outreach(company_id: str) -> Dict[str, str]:
        company = CompanyDiscoveryEngine.get_sourced_company(company_id)
        if not company:
            return {}
        
        name = company["company_name"]
        sector = company["sector"]
        signal = company["signals"][0]["signal"] if company["signals"] else "your recent progress"
        
        return {
            "linkedin_message": f"Hi Founders, I've been tracking the {sector} space closely and {name} stood out. {signal} is a strong signal. Would love to connect and learn more.",
            "warm_intro_ask": f"Hi [Connector], could you intro me to the founders of {name}? We're building a thesis around {sector} and they are a top priority based on {signal}.",
            "email_draft": f"Hi team at {name},\n\nI lead {sector} investments at Apex Capital. Your work caught my eye, specifically {signal}.\n\nAre you open to a brief chat next week? We are currently mapping this market and {name} seems highly relevant to our thesis.\n\nBest,\nApex",
            "follow_up_message": f"Hi again, bumping this. Would love 15 minutes whenever you have a moment.",
            "call_prep_notes": f"Goal: Understand revenue trajectory and verify {signal}. Ask about their main challenges in {sector}."
        }

class SourcingPipelineEngine:
    _pipeline = list(MOCK_PIPELINE)

    @staticmethod
    def get_pipeline() -> List[Dict[str, Any]]:
        return SourcingPipelineEngine._pipeline

    @staticmethod
    def update_pipeline_item(item_id: str, status: str) -> Optional[Dict[str, Any]]:
        for item in SourcingPipelineEngine._pipeline:
            if item["item_id"] == item_id:
                item["status"] = status
                return item
        return None

    @staticmethod
    def convert_to_deal(company_id: str) -> Dict[str, Any]:
        company = CompanyDiscoveryEngine.get_sourced_company(company_id)
        if not company:
            return {"success": False, "error": "Company not found"}
        
        # In a real app, this would write to the main deals database.
        # We will mock the success response.
        for item in SourcingPipelineEngine._pipeline:
            if item["company_id"] == company_id:
                item["status"] = "Converted to Deal"
                
        return {"success": True, "deal_id": "new_" + company_id, "message": "Successfully converted to full Apex Deal."}

class MarketMapBuilder:
    @staticmethod
    def get_market_map(thesis_id: str) -> Dict[str, Any]:
        thesis = ThesisEngine.get_thesis(thesis_id)
        if not thesis:
            return {"categories": []}
            
        companies = CompanyDiscoveryEngine.discover_companies(thesis_id)
        
        return {
            "thesis_id": thesis_id,
            "categories": [
                {
                    "category_name": "Primary Targets",
                    "companies": [c["company_name"] for c in companies],
                    "benchmark_companies": thesis.get("benchmark_companies", []),
                    "public_signals": ["High developer traction", "New funding rounds"],
                    "funding_signals": ["Seed rounds increasing"],
                    "risks": thesis.get("red_flags", []),
                    "open_questions": thesis.get("diligence_questions", []),
                    "maturity": "Early",
                    "signal_strength": "High",
                    "white_space": "Enterprise readiness",
                    "fund_relevance": "Strong"
                }
            ]
        }

class SourcingOrchestrator:
    @staticmethod
    def get_status() -> Dict[str, Any]:
        return {
            "status": "healthy",
            "theses_loaded": len(MOCK_THESES),
            "market_radar_status": "active",
            "discovered_companies_count": len(MOCK_SOURCED_COMPANIES),
            "sourcing_pipeline_count": len(SourcingPipelineEngine.get_pipeline()),
            "mock_fixtures_loaded": True,
            "live_search_enabled": False,
            "provider_fallback": "mock"
        }
