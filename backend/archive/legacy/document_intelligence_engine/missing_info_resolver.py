from typing import List, Dict
from document_intelligence_engine.document_schemas import DocumentMissingInfoImpact

class MissingInfoResolver:
    
    @staticmethod
    def calculate_impact(document_type: str, claims: List) -> DocumentMissingInfoImpact:
        impact = DocumentMissingInfoImpact()
        
        if document_type == "pitch_deck":
            impact.resolved_fields.append("pitch_deck_missing")
            impact.partially_resolved_fields.extend(["product_details", "market_size"])
        elif document_type == "financial_model":
            impact.resolved_fields.append("financial_model_missing")
            impact.partially_resolved_fields.extend(["historical_revenue", "burn_rate"])
        elif document_type == "cap_table":
            impact.partially_resolved_fields.append("cap_table_missing") # Partially resolved because cap tables often need manual review
        elif document_type == "customer_reference":
            impact.resolved_fields.append("customer_references_missing")
            
        return impact
