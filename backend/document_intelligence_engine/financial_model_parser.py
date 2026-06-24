from typing import Dict, List, Any
from document_intelligence_engine.document_schemas import ExtractedDocumentClaim

class FinancialModelParser:
    @staticmethod
    def extract_claims(text: str, document_id: str) -> List[ExtractedDocumentClaim]:
        claims = []
        text_lower = text.lower()
        if "revenue" in text_lower and "projected" in text_lower:
            claims.append(ExtractedDocumentClaim(
                claim_text="Financial model contains revenue projections",
                source_document_id=document_id,
                claim_category="projection",
                confidence="High",
                verification_status="needs_verification",
                decision_impact="medium"
            ))
        if "burn" in text_lower or "runway" in text_lower:
            claims.append(ExtractedDocumentClaim(
                claim_text="Financial model contains burn/runway metrics",
                source_document_id=document_id,
                claim_category="financial claim",
                confidence="High",
                verification_status="needs_verification",
                decision_impact="high"
            ))
        return claims

    @staticmethod
    def get_summary(text: str) -> str:
        return "Financial model parsed. Contains historicals or projections."
