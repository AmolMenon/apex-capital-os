class DiligenceDocumentReviewEngine:
    @staticmethod
    def review(context: dict) -> dict:
        docs = context.get("documents", [])
        types = [d.get("type") for d in docs]
        
        return {
            "documents_uploaded": len(docs),
            "pitch_deck_status": "Uploaded" if "pitch_deck" in types else "Missing",
            "financial_model_status": "Uploaded" if "financial_model" in types else "Missing",
            "cap_table_status": "Uploaded" if "cap_table" in types else "Missing",
            "customer_references_status": "Uploaded" if "customer_reference" in types else "Missing",
            "parsed_document_claims": sum(len(d.get("claims", [])) for d in docs),
            "low_confidence_parses": sum(1 for d in docs if any(c.get("confidence") == "Low" for c in d.get("claims", [])))
        }
