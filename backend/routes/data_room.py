from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Any, List
import os
import shutil
from db.database import get_db
from db.models import User
from auth.dependencies import get_current_user
from data_room_engine.data_room_orchestrator import (
    get_or_create_data_room_report,
    process_uploaded_document,
    run_data_room_parsing,
    get_data_room_status
)

router = APIRouter()

@router.get("/status")
def get_status():
    return get_data_room_status()

@router.post("/deals/{deal_id}/upload")
async def upload_document(
    deal_id: str,
    file: UploadFile = File(...),
    category: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deal_id = int(str(deal_id).replace("deal-", ""))
    storage_dir = f"storage/data_room/{deal_id}"
    os.makedirs(storage_dir, exist_ok=True)
    
    file_path = os.path.join(storage_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_size = os.path.getsize(file_path)
    
    doc = process_uploaded_document(
        db=db,
        deal_id=deal_id,
        file_name=file.filename,
        file_type=file.content_type or "application/octet-stream",
        category=category,
        storage_path=file_path,
        file_size=file_size,
        user=current_user.email
    )
    return {"message": "File uploaded successfully", "document_id": doc.document_id}

@router.get("/deals/{deal_id}/documents")
def get_documents(deal_id: str, db: Session = Depends(get_db)):
    deal_id = int(str(deal_id).replace("deal-", ""))
    report = get_or_create_data_room_report(db, deal_id)
    return report.documents_uploaded

@router.post("/deals/{deal_id}/parse")
def parse_documents(deal_id: str, db: Session = Depends(get_db)):
    deal_id = int(str(deal_id).replace("deal-", ""))
    report = run_data_room_parsing(db, deal_id)
    return report.dict()

@router.get("/deals/{deal_id}/report")
def get_report(deal_id: str, db: Session = Depends(get_db)):
    deal_id = int(str(deal_id).replace("deal-", ""))
    report = get_or_create_data_room_report(db, deal_id)
    return report.dict()

@router.get("/deals/{deal_id}/metrics")
def get_metrics(deal_id: str, db: Session = Depends(get_db)):
    deal_id = int(str(deal_id).replace("deal-", ""))
    report = get_or_create_data_room_report(db, deal_id)
    return [m.dict() for m in report.metrics_extracted]

@router.get("/deals/{deal_id}/contradictions")
def get_contradictions(deal_id: str, db: Session = Depends(get_db)):
    deal_id = int(str(deal_id).replace("deal-", ""))
    report = get_or_create_data_room_report(db, deal_id)
    return [c.dict() for c in report.contradictions]

@router.get("/deals/{deal_id}/completeness")
def get_completeness(deal_id: str, db: Session = Depends(get_db)):
    deal_id = int(str(deal_id).replace("deal-", ""))
    report = get_or_create_data_room_report(db, deal_id)
    return {
        "score": report.data_room_completeness_score,
        "level": report.completeness_level,
        "missing_documents": report.missing_documents,
        "critical_gaps": report.missing_metrics,
        "recommended_uploads": report.recommended_diligence_actions
    }

@router.get("/deals/{deal_id}/evidence-graph")
def get_evidence_graph(deal_id: str, db: Session = Depends(get_db)):
    deal_id = int(str(deal_id).replace("deal-", ""))
    report = get_or_create_data_room_report(db, deal_id)
    # Convert evidence items to a simple graph structure
    nodes = []
    edges = []
    for item in report.private_evidence_items:
        node_id = f"evidence-{len(nodes)}"
        nodes.append({
            "id": node_id,
            "label": item.claim,
            "group": "private_evidence",
            "confidence": item.confidence
        })
        if item.source_document:
            doc_node_id = f"doc-{item.source_document}"
            if doc_node_id not in [n["id"] for n in nodes]:
                nodes.append({"id": doc_node_id, "label": item.source_document, "group": "document"})
            edges.append({"from": doc_node_id, "to": node_id, "label": "sources"})
            
    return {"nodes": nodes, "edges": edges}

@router.delete("/deals/{deal_id}/documents/{document_id}")
def delete_document(deal_id: str, document_id: str, db: Session = Depends(get_db)):
    deal_id = int(str(deal_id).replace("deal-", ""))
    # Simple mock deletion
    return {"status": "deleted"}
