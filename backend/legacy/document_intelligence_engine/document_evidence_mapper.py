import json
from typing import List
from sqlalchemy.orm import Session
from db.models import WebResearchBriefModel
from document_intelligence_engine.document_schemas import ExtractedDocumentClaim

class DocumentEvidenceMapper:
    def __init__(self, db: Session):
        self.db = db

    def map_claims_to_evidence(self, deal_id: str, document_id: str, claims: List[ExtractedDocumentClaim]):
        """
        Maps document claims into the deal's evidence graph.
        Currently using WebResearchBriefModel to store all evidence types (including docs) for simplicity.
        """
        brief = self.db.query(WebResearchBriefModel).filter(WebResearchBriefModel.deal_id == int(deal_id)).first()
        
        if not brief:
            brief = WebResearchBriefModel(
                deal_id=int(deal_id),
                company_name="Unknown",
                research_mode="document_upload",
                claims_json="[]",
                evidence_graph_json="[]"
            )
            self.db.add(brief)
            self.db.commit()
            self.db.refresh(brief)
            
        existing_claims = json.loads(brief.claims_json) if brief.claims_json else []
        
        for claim in claims:
            # Avoid duplicates
            if any(c.get("claim_text") == claim.claim_text for c in existing_claims):
                continue
                
            existing_claims.append({
                "claim_text": claim.claim_text,
                "source": "Uploaded Document",
                "source_id": document_id,
                "category": claim.claim_category,
                "confidence": claim.confidence,
                "verification_status": claim.verification_status,
                "decision_impact": claim.decision_impact
            })
            
        brief.claims_json = json.dumps(existing_claims)
        self.db.commit()
