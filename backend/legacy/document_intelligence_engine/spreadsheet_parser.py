from typing import Dict, List, Any
from document_intelligence_engine.document_schemas import ExtractedDocumentClaim

class SpreadsheetParser:
    @staticmethod
    def extract_claims(text: str, document_id: str) -> List[ExtractedDocumentClaim]:
        claims = []
        text_lower = text.lower()
        if "arr" in text_lower or "mrr" in text_lower:
            claims.append(ExtractedDocumentClaim(
                claim_text="Spreadsheet contains ARR / MRR metrics",
                source_document_id=document_id,
                claim_category="revenue claim",
                confidence="High",
                verification_status="needs_verification",
                decision_impact="high"
            ))
        return claims

    @staticmethod
    def get_summary(text: str) -> str:
        return "Spreadsheet parsed. Extractable tabular data found."


