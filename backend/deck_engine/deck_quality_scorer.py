from typing import List, Tuple
from deck_engine.deck_schemas import (
    DeckQualityOutput, 
    InvestorReadinessOutput,
    ExtractedDeckSection,
    MissingDeckSectionOutput
)

class DeckQualityScorer:
    @staticmethod
    def score(sections: List[ExtractedDeckSection], missing: List[MissingDeckSectionOutput], claims: list) -> Tuple[DeckQualityOutput, InvestorReadinessOutput]:
        
        found_sections = {sec.section_type: sec for sec in sections}
        
        # Base scores (max 10, except traction 15, fundraising 5)
        scores = {
            "problem_clarity": 10 if "Problem" in found_sections else 2,
            "customer_specificity": 10 if "Market" in found_sections else 4,
            "solution_sharpness": 10 if "Solution" in found_sections else 2,
            "market_logic": 10 if "Market" in found_sections else 3,
            "traction_evidence": 15 if "Traction" in found_sections else 0,
            "business_model_clarity": 10 if "Business Model" in found_sections else 2,
            "competitive_positioning": 10 if "Competition" in found_sections else 3,
            "team_credibility": 10 if "Team" in found_sections else 4,
            "financial_clarity": 10 if "Financials" in found_sections else 2,
            "fundraising_ask_clarity": 5 if "Fundraising" in found_sections else 1
        }
        
        # Penalties for unsupported claims
        unsupported = len([c for c in claims if c.evidence_level == "Unsupported"])
        if unsupported > 0:
            scores["solution_sharpness"] = max(0, scores["solution_sharpness"] - (unsupported * 2))
            
        quality_breakdown = DeckQualityOutput(**scores)
        
        total_score = sum(scores.values())
        
        # Readiness metrics
        evidence_strength = 100 - (unsupported * 15) - (len([m for m in missing if m.severity == "High"]) * 10)
        evidence_strength = max(0, min(100, evidence_strength))
        
        narrative_clarity = 100 - (len(missing) * 10)
        narrative_clarity = max(0, min(100, narrative_clarity))
        
        diligence_burden = 20 + (len(missing) * 10) + (unsupported * 15)
        diligence_burden = max(0, min(100, diligence_burden))
        
        # Verdict
        if total_score >= 85:
            verdict = "Investor-Ready"
        elif total_score >= 70:
            verdict = "Strong but needs refinement"
        elif total_score >= 55:
            verdict = "Promising but incomplete"
        else:
            verdict = "Not investor-ready"
            
        readiness_breakdown = InvestorReadinessOutput(
            deck_quality_score=total_score,
            investor_readiness_score=int((total_score + evidence_strength + narrative_clarity) / 3),
            evidence_strength_score=evidence_strength,
            narrative_clarity_score=narrative_clarity,
            diligence_burden_score=diligence_burden,
            verdict=verdict
        )
        
        return quality_breakdown, readiness_breakdown
