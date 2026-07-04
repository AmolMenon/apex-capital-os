from typing import Dict, List, Any
from document_intelligence_engine.document_schemas import ExtractedDocumentClaim

class PitchDeckParser:
    
    @staticmethod
    def extract_claims(text: str, document_id: str) -> List[ExtractedDocumentClaim]:
        claims = []
        text_lower = text.lower()
        
        # Simple heuristic-based extraction for demonstration
        if "arr" in text_lower or "revenue" in text_lower:
            claims.append(ExtractedDocumentClaim(
                claim_text="Company reports revenue / ARR metrics in pitch deck",
                source_document_id=document_id,
                claim_category="revenue claim",
                confidence="Medium",
                verification_status="needs_verification",
                decision_impact="high"
            ))
            
        if "market size" in text_lower or "tam" in text_lower:
            claims.append(ExtractedDocumentClaim(
                claim_text="Company identifies TAM / Market Size in pitch deck",
                source_document_id=document_id,
                claim_category="market claim",
                confidence="Low",
                verification_status="company_provided",
                decision_impact="medium"
            ))
            
        if "enterprise" in text_lower and "pilot" in text_lower:
            claims.append(ExtractedDocumentClaim(
                claim_text="Company claims active enterprise pilots",
                source_document_id=document_id,
                claim_category="traction claim",
                confidence="Medium",
                verification_status="needs_verification",
                decision_impact="high"
            ))
            
        return claims

    @staticmethod
    def get_summary(text: str) -> str:
        # A very basic summary generator
        if not text:
            return "No readable text extracted from pitch deck."
        return "Pitch deck uploaded and parsed. Contains standard company overview and thesis."
