import json
from db.models import (
    ResearchBriefModel,
    DeckAnalysisModel,
    DiligencePlanModel,
    FundFitAssessmentModel,
    Deal
)

def seed_autonomous_pipeline(db, deal_id: int):
    # Check if already seeded
    if db.query(ResearchBriefModel).filter(ResearchBriefModel.deal_id == deal_id).first():
        return
        
    try:
        # 1. Research Brief
        research = ResearchBriefModel(
            deal_id=deal_id,
            market_research_json=json.dumps({"tam": "$50B", "growth": "20% YoY", "trends": ["AI adoption", "Automation"]}),
            competitor_research_json=json.dumps([{"name": "Legacy Corp", "threat": "High"}, {"name": "Startup X", "threat": "Medium"}]),
            customer_personas_json=json.dumps([{"role": "VP Eng", "pain_point": "Slow deployment"}]),
            pricing_research_json=json.dumps({"model": "SaaS", "acv": "$50k"}),
            gtm_research_json=json.dumps({"strategy": "PLG + Enterprise Sales"}),
            tam_sam_som_json=json.dumps({"tam": 50000000000, "sam": 10000000000, "som": 500000000}),
            evidence_grade_json=json.dumps({"grade": "A-", "confidence": 85}),
            source_registry_json=json.dumps([{"url": "techcrunch.com", "relevance": "High"}]),
            research_gaps_json=json.dumps(["Lack of customer retention data"])
        )
        db.add(research)
        
        # 2. Deck Analysis
        deck = DeckAnalysisModel(
            deal_id=deal_id,
            deck_name="Series A Pitch Deck",
            file_type="pdf",
            deck_summary="Strong AI team targeting enterprise workflows.",
            deck_quality_score=90,
            investor_readiness_score=85,
            extracted_sections_json=json.dumps(["Problem", "Solution", "Traction", "Team"]),
            key_claims_json=json.dumps([{"claim": "$1M ARR", "verified": False}]),
            risks_json=json.dumps(["High burn rate"]),
            financials_json=json.dumps({"revenue": 1000000}),
            traction_json=json.dumps({"users": 50000}),
            missing_sections_json=json.dumps(["Competition"]),
            deck_quality_json=json.dumps({"score": 90})
        )
        db.add(deck)
        
        # 3. Diligence Plan
        diligence = DiligencePlanModel(
            deal_id=deal_id,
            ic_readiness_score=75,
            identified_risks_json=json.dumps([{"risk": "Market saturation", "severity": "Medium"}]),
            diligence_questions_json=json.dumps(["What is the churn rate?"]),
            diligence_modules_json=json.dumps(["Financial", "Technical", "Legal"]),
            expert_network_queries_json=json.dumps(["Need AI enterprise sales expert"])
        )
        db.add(diligence)
        
        # 4. Fund Fit
        fund_fit = FundFitAssessmentModel(
            deal_id=deal_id,
            fit_score=88,
            portfolio_conflict_json=json.dumps({"conflict": False, "notes": "Synergistic with Co X"}),
            thesis_alignment_json=json.dumps({"aligned": True, "reason": "Matches AI infrastructure thesis"}),
            power_law_potential_json=json.dumps({"potential": "High", "multiple": "20x"}),
            check_size_fit_json=json.dumps({"fit": True, "target": "$5M"})
        )
        db.add(fund_fit)
        
        db.commit()
    except Exception as e:
        print(f"Error seeding autonomous pipeline: {e}")
        db.rollback()
