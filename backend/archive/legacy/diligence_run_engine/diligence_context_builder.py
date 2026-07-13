from sqlalchemy.orm import Session
from db.models import Deal, DealDocument, WebResearchBriefModel
import json

class DiligenceContextBuilder:
    @staticmethod
    def build_context(db: Session, deal_id: int) -> dict:
        deal = db.query(Deal).filter(Deal.id == deal_id).first()
        docs = db.query(DealDocument).filter(DealDocument.deal_id == deal_id).all()
        research = db.query(WebResearchBriefModel).filter(WebResearchBriefModel.deal_id == deal_id).first()
        
        context = {
            "deal_id": str(deal_id),
            "company_name": getattr(deal, "name", "") or getattr(deal, "company_name", ""),
            "sector": deal.sector if hasattr(deal, "sector") else "",
            "stage": deal.stage if hasattr(deal, "stage") else "",
            "description": deal.description if hasattr(deal, "description") else "",
            "documents": [],
            "public_research": {},
            "evidence_claims": []
        }
        
        for doc in docs:
            doc_meta = json.loads(doc.metadata_json) if doc.metadata_json else {}
            context["documents"].append({
                "document_id": doc.document_id,
                "type": doc.document_category,
                "status": doc.parse_status,
                "summary": doc_meta.get("summary", ""),
                "claims": doc_meta.get("extracted_claims", [])
            })
            
        if research and research.claims_json:
            try:
                context["evidence_claims"] = json.loads(research.claims_json)
            except:
                pass
                
        return context
