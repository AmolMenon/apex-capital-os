from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Any
import os
import shutil
from db.database import get_db
from auth.dependencies import get_current_active_user, require_decision_access
from db.models import Decision
import database.crud as crud
from schemas.evidence import EvidenceCreate, EvidenceResponse
import db.models as db_models
from services.ingestion_service import IngestionService

router = APIRouter()

@router.post("/{decision_id}/upload")
def upload_evidence_file(
    decision_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
        
    # Save file temporarily
    file_ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
    temp_path = f"/tmp/{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        document = IngestionService.ingest_document(
            db=db,
            decision_id=decision_id,
            file_path=temp_path,
            filename=file.filename,
            file_type=file_ext
        )
        return {"document_id": document.id, "filename": document.filename, "message": "Ingestion successful"}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/{decision_id}/evidence", response_model=EvidenceResponse)
def add_evidence(
    decision_id: int,
    evidence: EvidenceCreate,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    db_evidence = db_models.Evidence(**evidence.model_dump())
    db.add(db_evidence)
    db.commit()
    db.refresh(db_evidence)
    return db_evidence

@router.post("/{decision_id}/documents/{document_id}/extract-claims")
def extract_claims(
    decision_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    from services.extraction_service import ExtractionService
    
    document = db.query(db_models.Document).filter(db_models.Document.id == document_id, db_models.Document.decision_id == decision_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
        
    all_claims = []
    # Just extract from first 3 chunks to avoid massive latency/costs in MVP
    chunks_to_process = document.chunks[:3]
    
    for chunk in chunks_to_process:
        try:
            claims = ExtractionService.extract_claims_from_chunk(db, decision_id, chunk.id, chunk.content)
            all_claims.extend(claims)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
        
    return {"extracted_claims": len(all_claims), "message": "Extraction complete"}

@router.get("/{decision_id}/claims")
def get_decision_claims(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    claims = db.query(db_models.Claim).filter(db_models.Claim.decision_id == decision_id).all()
    return [{
        "id": c.id,
        "statement": c.statement,
        "provenance_type": c.provenance_type,
        "confidence": c.confidence,
        "verification_status": c.verification_status,
        "source_chunk_id": c.source_chunk_id
    } for c in claims]

@router.get("/{decision_id}/evidence")
def get_evidence(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    # We will return the legacy evidence PLUS the new documents formatted similarly for the UI
    legacy_evidence = db.query(db_models.Evidence).filter(db_models.Evidence.decision_id == decision_id).all()
    documents = db.query(db_models.Document).filter(db_models.Document.decision_id == decision_id).all()
    
    combined = []
    for e in legacy_evidence:
        combined.append({
            "id": e.id,
            "decision_id": e.decision_id,
            "title": e.title,
            "content": e.content,
            "source_url": e.source_url,
            "evidence_type": e.evidence_type,
            "metadata_json": e.metadata_json,
            "created_at": e.created_at
        })
    
    for d in documents:
        combined.append({
            "id": f"doc_{d.id}",
            "decision_id": d.decision_id,
            "title": d.filename,
            "content": f"Parsed Document ({len(d.chunks)} chunks)",
            "source_url": None,
            "evidence_type": "Document",
            "metadata_json": d.metadata_json,
            "created_at": d.created_at
        })
        
    return combined
