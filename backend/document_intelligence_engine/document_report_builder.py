from typing import List
from document_intelligence_engine.document_schemas import DealDocument

class DocumentReportBuilder:
    
    @staticmethod
    def build_data_room_summary(documents: List[DealDocument]) -> str:
        if not documents:
            return "No documents uploaded to the Data Room."
            
        summary = f"Data Room contains {len(documents)} document(s):\n"
        
        doc_types = [d.document_type for d in documents]
        
        if "pitch_deck" in doc_types:
            summary += "- Pitch Deck: Uploaded\n"
        else:
            summary += "- Pitch Deck: Missing\n"
            
        if "financial_model" in doc_types:
            summary += "- Financial Model: Uploaded\n"
        else:
            summary += "- Financial Model: Missing\n"
            
        summary += "\nKey Extracted Claims:\n"
        for doc in documents:
            for claim in doc.extracted_claims:
                summary += f"- [{doc.document_type}] {claim.claim_text} ({claim.confidence} confidence)\n"
                
        return summary
