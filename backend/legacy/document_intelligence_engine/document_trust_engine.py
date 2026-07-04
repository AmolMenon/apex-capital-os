from typing import List
from document_intelligence_engine.document_schemas import DocumentTrustStatus, ExtractedDocumentClaim

class DocumentTrustEngine:
    
    @staticmethod
    def evaluate_trust(document_type: str, claims: List[ExtractedDocumentClaim]) -> DocumentTrustStatus:
        trust = DocumentTrustStatus()
        
        # Base labels on document type
        if document_type in ["pitch_deck", "financial_model", "cap_table", "kpi_sheet"]:
            trust.trust_labels.append("Company-Provided")
            trust.trust_labels.append("Needs Verification")
        elif document_type == "customer_reference":
            trust.trust_labels.append("Company-Provided")
        
        # Check claims confidence
        low_confidence = [c for c in claims if c.confidence.lower() == "low"]
        if low_confidence:
            trust.trust_labels.append("Parsed Low Confidence")
            
        if "cap_table" == document_type:
            trust.trust_labels.append("Cap Table Needs Review")
            
        trust.provenance_notes = f"Document parsed automatically. {len(claims)} claims extracted."
        
        # Deduplicate
        trust.trust_labels = list(set(trust.trust_labels))
        return trust
