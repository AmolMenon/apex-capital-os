import os
import json
from datetime import datetime
from sqlalchemy.orm import Session
from db.models import DealDocument, Deal

class DocumentFixtures:
    @staticmethod
    def seed_documents(db: Session):
        deals = db.query(Deal).all()
        
        for deal in deals:
            name = getattr(deal, "name", "").lower()
            if not name and hasattr(deal, "company_name"):
                name = deal.company_name.lower()
            
            if "bharatvector" in name:
                DocumentFixtures._create_mock_doc(db, deal.id, "bharatvector_pitch_deck.pdf", "pitch_deck", "Parsed High Confidence", [
                    {"claim_text": "Early enterprise pilots ongoing", "claim_category": "traction claim", "confidence": "High", "verification_status": "needs_verification", "decision_impact": "high"}
                ])
                
            elif "neuraldesk" in name:
                DocumentFixtures._create_mock_doc(db, deal.id, "neuraldesk_deck.pptx", "pitch_deck", "Parsed High Confidence", [])
                DocumentFixtures._create_mock_doc(db, deal.id, "neuraldesk_financials.xlsx", "financial_model", "Company-Provided", [
                    {"claim_text": "MRR is $50k", "claim_category": "revenue claim", "confidence": "High", "verification_status": "needs_verification", "decision_impact": "high"},
                    {"claim_text": "Runway is 18 months", "claim_category": "financial claim", "confidence": "Medium", "verification_status": "needs_verification", "decision_impact": "high"}
                ])
                DocumentFixtures._create_mock_doc(db, deal.id, "neuraldesk_cap_table.xlsx", "cap_table", "Cap Table Needs Review", [])
                DocumentFixtures._create_mock_doc(db, deal.id, "customer_references.docx", "customer_reference", "Company-Provided", [])
                
            elif "klinikos" in name:
                DocumentFixtures._create_mock_doc(db, deal.id, "klinikos_workflow_deck.pdf", "pitch_deck", "Parsed High Confidence", [])
                DocumentFixtures._create_mock_doc(db, deal.id, "regulatory_notes.txt", "notes", "Analyst Note", [])
                
            elif "sarvam" in name:
                # No private docs
                pass

    @staticmethod
    def _create_mock_doc(db: Session, deal_id: int, filename: str, doc_type: str, trust_label: str, claims: list):
        # Check if exists
        existing = db.query(DealDocument).filter_by(deal_id=deal_id, file_name=filename).first()
        if existing:
            return
            
        doc_id = f"mock_{deal_id}_{filename.replace('.', '_')}"
        
        meta = {
            "original_file_name": filename,
            "summary": f"Mock {doc_type} summary.",
            "extracted_claims": [{
                "claim_text": c["claim_text"],
                "source_document_id": doc_id,
                "claim_category": c["claim_category"],
                "confidence": c["confidence"],
                "verification_status": c["verification_status"],
                "decision_impact": c["decision_impact"]
            } for c in claims],
            "trust_status": {"trust_labels": [trust_label], "provenance_notes": "Mock fixture data"}
        }
        
        doc = DealDocument(
            document_id=doc_id,
            deal_id=deal_id,
            file_name=filename,
            file_type="application/octet-stream",
            document_category=doc_type,
            upload_time=datetime.utcnow(),
            file_size=1024 * 1024,
            storage_path=f"/mock/path/{filename}",
            parse_status="parsed",
            uploaded_by="system",
            metadata_json=json.dumps(meta)
        )
        db.add(doc)
        db.commit()
