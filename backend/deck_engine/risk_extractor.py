from typing import List
from deck_engine.deck_schemas import DeckRiskOutput, ExtractedDeckSection

class RiskExtractor:
    @staticmethod
    def extract(sections: List[ExtractedDeckSection], financials: dict, claims: list) -> List[DeckRiskOutput]:
        risks = []
        
        # Explicit risks
        for sec in sections:
            if sec.section_type == "Risks":
                risks.append(DeckRiskOutput(
                    risk="Self-identified risk from deck.",
                    type="Explicit",
                    severity="Medium",
                    explanation=sec.extracted_text[:100] + "...",
                    diligence_action="Discuss mitigation strategy with founder."
                ))
                
        # Implicit risks based on extracted data
        if not financials.get("burn_rate") or financials.get("burn_rate") == "Unknown":
            risks.append(DeckRiskOutput(
                risk="Missing Burn Rate",
                type="Implicit",
                severity="High",
                explanation="The deck does not explicitly state the current monthly burn rate, making it impossible to calculate runway accurately.",
                diligence_action="Request current P&L and burn rate immediately."
            ))
            
        unsupported_claims = [c for c in claims if c.evidence_level == "Unsupported"]
        if len(unsupported_claims) > 0:
            risks.append(DeckRiskOutput(
                risk="Unsupported Major Claims",
                type="Implicit",
                severity="High",
                explanation=f"Found {len(unsupported_claims)} claims without sufficient backing evidence in the deck.",
                diligence_action="Request data room access to verify specific claims."
            ))
            
        return risks
