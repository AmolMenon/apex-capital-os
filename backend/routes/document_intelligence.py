from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from db.database import get_db
from document_intelligence_engine.document_orchestrator import DocumentOrchestrator
from document_intelligence_engine.document_schemas import (
    DealDocument, DocumentUploadResponse, DocumentParseResult,
    DocumentMissingInfoImpact, DocumentTypeClassification, ExtractedDocumentClaim
)
from document_intelligence_engine.missing_info_resolver import MissingInfoResolver
from document_intelligence_engine.document_classifier import DocumentClassifier

router = APIRouter()

@router.get("/documents/status")
def get_documents_status():
    return {"status": "ok", "message": "Document Intelligence Engine is running"}

@router.get("/deals/{deal_id}/documents", response_model=List[DealDocument])
def get_deal_documents(deal_id: str, db: Session = Depends(get_db)):
    orchestrator = DocumentOrchestrator(db)
    return orchestrator.storage.get_deal_documents(deal_id)

@router.post("/deals/{deal_id}/documents/upload", response_model=DocumentUploadResponse)
async def upload_deal_document(
    deal_id: str,
    file: UploadFile = File(...),
    document_type: str = Form(None),
    uploaded_by: str = Form("user"),
    db: Session = Depends(get_db)
):
    orchestrator = DocumentOrchestrator(db)
    doc = await orchestrator.process_upload(deal_id, file, uploaded_by, document_type)
    return DocumentUploadResponse(status="success", document=doc)

@router.get("/deals/{deal_id}/documents/{document_id}", response_model=DealDocument)
def get_deal_document(deal_id: str, document_id: str, db: Session = Depends(get_db)):
    orchestrator = DocumentOrchestrator(db)
    doc = orchestrator.storage.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.delete("/deals/{deal_id}/documents/{document_id}")
def delete_deal_document(deal_id: str, document_id: str, db: Session = Depends(get_db)):
    orchestrator = DocumentOrchestrator(db)
    orchestrator.storage.delete_document(document_id)
    return {"status": "success", "message": "Document deleted"}

@router.post("/deals/{deal_id}/documents/{document_id}/archive")
def archive_deal_document(deal_id: str, document_id: str, db: Session = Depends(get_db)):
    orchestrator = DocumentOrchestrator(db)
    doc = orchestrator.storage.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.processing_status = "archived"
    orchestrator.storage.update_document(doc)
    return {"status": "success"}

@router.post("/deals/{deal_id}/documents/{document_id}/reprocess", response_model=DealDocument)
def reprocess_deal_document(deal_id: str, document_id: str, db: Session = Depends(get_db)):
    orchestrator = DocumentOrchestrator(db)
    doc = orchestrator.storage.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    orchestrator._run_pipeline(doc)
    orchestrator.storage.update_document(doc)
    
    if doc.extracted_claims:
        orchestrator.evidence_mapper.map_claims_to_evidence(deal_id, doc.document_id, doc.extracted_claims)
        
    return doc

@router.get("/deals/{deal_id}/documents/{document_id}/parse-result", response_model=DocumentParseResult)
def get_document_parse_result(deal_id: str, document_id: str, db: Session = Depends(get_db)):
    orchestrator = DocumentOrchestrator(db)
    doc = orchestrator.storage.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return DocumentParseResult(
        status=doc.processing_status,
        error_message=None if doc.processing_status == "parsed" else doc.summary,
        metrics_found={},
        warnings=[]
    )

@router.get("/deals/{deal_id}/documents/{document_id}/claims", response_model=List[ExtractedDocumentClaim])
def get_document_claims(deal_id: str, document_id: str, db: Session = Depends(get_db)):
    orchestrator = DocumentOrchestrator(db)
    doc = orchestrator.storage.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc.extracted_claims

@router.get("/deals/{deal_id}/documents/{document_id}/summary")
def get_document_summary(deal_id: str, document_id: str, db: Session = Depends(get_db)):
    orchestrator = DocumentOrchestrator(db)
    doc = orchestrator.storage.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"summary": doc.summary}

@router.post("/deals/{deal_id}/documents/{document_id}/classify", response_model=DocumentTypeClassification)
def classify_document(deal_id: str, document_id: str, db: Session = Depends(get_db)):
    orchestrator = DocumentOrchestrator(db)
    doc = orchestrator.storage.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    # Return current classification status
    return DocumentTypeClassification(
        predicted_type=doc.document_type,
        confidence="High" if doc.document_type != "unknown" else "Low",
        reasons=[],
        needs_user_confirmation=False
    )

@router.put("/deals/{deal_id}/documents/{document_id}/document-type")
def update_document_type(deal_id: str, document_id: str, payload: Dict[str, str], db: Session = Depends(get_db)):
    orchestrator = DocumentOrchestrator(db)
    doc = orchestrator.storage.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    doc.document_type = payload.get("document_type", doc.document_type)
    orchestrator.storage.update_document(doc)
    return {"status": "success", "document_type": doc.document_type}

@router.post("/deals/{deal_id}/documents/{document_id}/map-to-evidence")
def map_document_to_evidence(deal_id: str, document_id: str, db: Session = Depends(get_db)):
    orchestrator = DocumentOrchestrator(db)
    doc = orchestrator.storage.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if doc.extracted_claims:
        orchestrator.evidence_mapper.map_claims_to_evidence(deal_id, doc.document_id, doc.extracted_claims)
        return {"status": "success", "mapped": len(doc.extracted_claims)}
    return {"status": "success", "mapped": 0}

@router.get("/deals/{deal_id}/documents/evidence-impact")
def get_document_evidence_impact(deal_id: str, db: Session = Depends(get_db)):
    # Returns summary of mapped evidence
    orchestrator = DocumentOrchestrator(db)
    docs = orchestrator.storage.get_deal_documents(deal_id)
    total_claims = sum(len(d.extracted_claims) for d in docs)
    return {"total_document_claims_mapped": total_claims}

@router.get("/deals/{deal_id}/documents/missing-info-impact", response_model=DocumentMissingInfoImpact)
def get_document_missing_info_impact(deal_id: str, db: Session = Depends(get_db)):
    orchestrator = DocumentOrchestrator(db)
    docs = orchestrator.storage.get_deal_documents(deal_id)
    
    impact = DocumentMissingInfoImpact()
    for doc in docs:
        if doc.processing_status == "parsed":
            doc_impact = MissingInfoResolver.calculate_impact(doc.document_type, doc.extracted_claims)
            impact.resolved_fields.extend(doc_impact.resolved_fields)
            impact.partially_resolved_fields.extend(doc_impact.partially_resolved_fields)
            
    # Deduplicate
    impact.resolved_fields = list(set(impact.resolved_fields))
    impact.partially_resolved_fields = list(set(impact.partially_resolved_fields))
    return impact
