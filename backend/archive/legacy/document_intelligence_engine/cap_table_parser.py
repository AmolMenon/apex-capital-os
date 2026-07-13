from typing import Dict, List, Any
from document_intelligence_engine.document_schemas import ExtractedDocumentClaim

class CapTableParser:
    @staticmethod
    def extract_claims(text: str, document_id: str) -> List[ExtractedDocumentClaim]:
        claims = []
        text_lower = text.lower()
        if "founder" in text_lower or "esop" in text_lower:
            claims.append(ExtractedDocumentClaim(
                claim_text="Cap table contains Founder / ESOP splits",
                source_document_id=document_id,
                claim_category="ownership claim",
                confidence="Medium",
                verification_status="company_provided",
                decision_impact="high"
            ))
        return claims

    @staticmethod
    def get_summary(text: str) -> str:
        return "Cap table uploaded, but ownership extraction may need manual review."
