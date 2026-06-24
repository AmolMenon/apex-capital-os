from typing import List
import re
from deck_engine.deck_schemas import DeckClaimOutput, ExtractedDeckSection

class ClaimExtractor:
    """
    Extracts key claims from the deck text.
    """
    
    @staticmethod
    def extract(sections: List[ExtractedDeckSection]) -> List[DeckClaimOutput]:
        claims = []
        
        for sec in sections:
            text = sec.extracted_text
            lower_text = text.lower()
            
            # Simple regex/heuristic extraction
            
            # 1. Market Size Claim
            if "$" in text and ("billion" in lower_text or "b" in lower_text or "trillion" in lower_text):
                claims.append(DeckClaimOutput(
                    claim_text="Claims a multi-billion dollar market opportunity.",
                    claim_type="Market Size",
                    evidence_level="Weak",
                    verification_required=True,
                    diligence_question="How is this TAM calculated? Is it top-down or bottom-up?"
                ))
                
            # 2. Growth Claim
            if "%" in text and ("growth" in lower_text or "mom" in lower_text or "yoy" in lower_text):
                claims.append(DeckClaimOutput(
                    claim_text="Claims strong percentage growth.",
                    claim_type="Growth",
                    evidence_level="Medium",
                    verification_required=True,
                    diligence_question="Can we see cohort retention and raw historical revenue data?"
                ))
                
            # 3. Product / Tech Claim
            if "proprietary" in lower_text or "patent" in lower_text or "10x" in lower_text:
                claims.append(DeckClaimOutput(
                    claim_text="Claims proprietary technology or 10x improvement.",
                    claim_type="Technology",
                    evidence_level="Unsupported",
                    verification_required=True,
                    diligence_question="Need technical diligence to verify the 'proprietary' nature of the tech stack."
                ))
                
            # 4. Customer Claim
            if "enterprise" in lower_text and ("customers" in lower_text or "pilots" in lower_text):
                claims.append(DeckClaimOutput(
                    claim_text="Claims enterprise customer traction or pilots.",
                    claim_type="Customer",
                    evidence_level="Medium",
                    verification_required=True,
                    diligence_question="Are these paid pilots? What is the conversion rate to full contracts?"
                ))
                
        # Deduplicate generic claims for mock purposes
        unique_claims = {c.claim_text: c for c in claims}
        return list(unique_claims.values())
