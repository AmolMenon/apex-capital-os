from typing import Dict, Any, List
from sqlalchemy.orm import Session
from db.models import Deal, DealDocument, WebResearchBriefModel
from document_intelligence_engine.document_storage_engine import DocumentStorageEngine

class DiligenceReadinessChecker:
    @staticmethod
    def check_readiness(db: Session, deal_id: int) -> Dict[str, Any]:
        deal = db.query(Deal).filter(Deal.id == deal_id).first()
        if not deal:
            return {"readiness_level": "Minimal", "is_ready": False, "missing": ["Deal not found"]}
            
        missing_basic = []
        if not deal.description:
            missing_basic.append("description")
        if not deal.sector:
            missing_basic.append("sector")
            
        docs = db.query(DealDocument).filter(DealDocument.deal_id == deal_id).all()
        has_docs = len(docs) > 0
        
        research = db.query(WebResearchBriefModel).filter(WebResearchBriefModel.deal_id == deal_id).first()
        has_research = research is not None
        
        # Determine level
        if not deal.description and not deal.sector and not has_docs and not has_research:
            level = "Minimal"
        elif not has_docs and not has_research:
            level = "Basic"
        elif has_docs and not has_research:
            level = "Documented"
        elif has_research and not has_docs:
            level = "Research-Backed"
        else:
            level = "Diligence-Ready"
            
        return {
            "readiness_level": level,
            "is_ready": level in ["Documented", "Research-Backed", "Diligence-Ready"],
            "has_docs": has_docs,
            "has_research": has_research,
            "missing_basic": missing_basic
        }
