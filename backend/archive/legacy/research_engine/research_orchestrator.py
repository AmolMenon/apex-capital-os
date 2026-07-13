import json
from ai_providers.router import router
from .research_schemas import (
    ResearchBrief,
    MarketResearchOutput,
    CompetitorResearchOutput,
    CustomerPersonaOutput,
    PricingResearchOutput,
    GTMResearchOutput,
    TAMSAMSOMOutput,
    EvidenceGradeOutput,
    SourceOutput
)
from .market_research import generate_market_research
from .competitor_research import generate_competitor_research
from .customer_research import generate_customer_personas
from .pricing_research import generate_pricing_research
from .gtm_research import generate_gtm_research
from .tam_sam_som import generate_tam_sam_som
from .evidence_grader import grade_evidence
from .source_registry import generate_source_registry

class ResearchOrchestrator:
    def __init__(self):
        self.router = router
        
    def generate_research_brief(self, deal_dict: dict) -> ResearchBrief:
        # Deterministic base
        market_data_base = generate_market_research(deal_dict)
        comp_data_base = generate_competitor_research(deal_dict)
        persona_data_base = generate_customer_personas(deal_dict)
        pricing_data = generate_pricing_research(deal_dict)
        gtm_data = generate_gtm_research(deal_dict)
        tam_data = generate_tam_sam_som(deal_dict)
        evidence_data = grade_evidence(deal_dict)
        sources = generate_source_registry()
        
        # AI Augmentation
        context = f"Company: {deal_dict.get('startup_name')} | Sector: {deal_dict.get('sector')} | Desc: {deal_dict.get('description')}"
        # Request all narratives from the router
        ai_market_raw = self.router.execute_task("market_research", context)
        ai_comp_raw = self.router.execute_task("competitor_research", context)
        ai_personas_raw = self.router.execute_task("customer_personas", context)

        ai_market = ai_market_raw.get("data", {})
        ai_comp = ai_comp_raw.get("data", {})
        ai_personas = ai_personas_raw.get("data", {})
        
        # Merge metadata
        ai_market["_ai_metadata"] = ai_market_raw.get("metadata", {})
        ai_comp["_ai_metadata"] = ai_comp_raw.get("metadata", {})
        ai_personas["_ai_metadata"] = ai_personas_raw.get("metadata", {})
        
        # Merge AI into base to ensure Pydantic doesn't break
        if ai_market and "market_attractiveness_score" in ai_market:
            market_data_base["attractiveness_score"] = ai_market["market_attractiveness_score"]
            if "market_tailwinds" in ai_market: market_data_base["drivers"] = ai_market["market_tailwinds"]
            if "market_headwinds" in ai_market: market_data_base["constraints"] = ai_market["market_headwinds"]
            
        if ai_comp and "competitive_intensity_score" in ai_comp:
            comp_data_base["competitive_intensity_score"] = ai_comp["competitive_intensity_score"]
            if "competitors" in ai_comp and len(ai_comp["competitors"]) > 0:
                # We won't fully overwrite complex objects to avoid breaking the frontend demo,
                # but we prove the integration works.
                comp_data_base["defensibility_assessment"] = ai_comp.get("competitive_intensity_reason", comp_data_base["defensibility_assessment"])
                
        # If we successfully parsed AI personas, we could swap them, but for the demo we'll stick to base for now.
        
        gaps = [
            "Lack of verified customer reference calls",
            "Unclear incumbent response strategy",
            "CAC ceiling not yet established"
        ]
        
        recommendation = "Proceed to deeper diligence" if evidence_data['overall_score'] >= 60 else "Hold until evidence gaps are closed"
        
        return ResearchBrief(
            deal_id=deal_dict['id'],
            company_name=deal_dict['startup_name'],
            market_research=MarketResearchOutput(**market_data_base),
            competitor_research=CompetitorResearchOutput(**comp_data_base),
            customer_personas=[CustomerPersonaOutput(**p) for p in persona_data_base],
            pricing_research=PricingResearchOutput(**pricing_data),
            gtm_research=GTMResearchOutput(**gtm_data),
            tam_sam_som=TAMSAMSOMOutput(**tam_data),
            evidence_grade=EvidenceGradeOutput(**evidence_data),
            source_registry=[SourceOutput(**s) for s in sources],
            research_gaps=gaps,
            research_backed_recommendation=recommendation
        )
