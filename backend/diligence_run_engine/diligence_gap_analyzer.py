from typing import List, Dict

class DiligenceGapAnalyzer:
    @staticmethod
    def analyze_gaps(context: dict) -> List[Dict[str, str]]:
        gaps = []
        docs = context.get("documents", [])
        doc_types = [d.get("type") for d in docs]
        claims = context.get("evidence_claims", [])
        
        claims_text = " ".join([c.get("claim_text", "").lower() for c in claims])
        
        if "cap_table" not in doc_types:
            gaps.append({"gap": "Missing Cap Table", "severity": "Critical", "category": "Ownership"})
            
        if "financial_model" not in doc_types:
            gaps.append({"gap": "Missing Financial Model", "severity": "Critical", "category": "Financials"})
            
        if "customer_reference" not in doc_types:
            gaps.append({"gap": "Missing Customer References", "severity": "High", "category": "Validation"})
            
        if "arr" not in claims_text and "revenue" not in claims_text:
            gaps.append({"gap": "Missing ARR / Revenue metrics", "severity": "Critical", "category": "Financials"})
            
        if "retention" not in claims_text:
            gaps.append({"gap": "Missing Retention metrics", "severity": "High", "category": "Product"})
            
        return gaps
