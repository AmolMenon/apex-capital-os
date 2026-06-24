import os
import uuid
import json
import shutil
from datetime import datetime
from fastapi import UploadFile
from sqlalchemy.orm import Session

from db.models import DealDocument
from document_intelligence_engine.document_schemas import DealDocument, ExtractedDocumentClaim, DocumentTrustStatus
from document_intelligence_engine.document_upload_validator import MAX_UPLOAD_BYTES

UPLOAD_STORAGE_DIR = os.environ.get("UPLOAD_STORAGE_DIR", "./uploaded_documents")

class DocumentStorageEngine:
    def __init__(self, db: Session):
        self.db = db
        # Ensure upload directory exists
        os.makedirs(UPLOAD_STORAGE_DIR, exist_ok=True)

    def _get_safe_path(self, document_id: str, sanitized_filename: str) -> str:
        # Prevent collisions by prefixing with doc id
        folder_path = os.path.join(UPLOAD_STORAGE_DIR, document_id)
        os.makedirs(folder_path, exist_ok=True)
        return os.path.join(folder_path, sanitized_filename)

    async def save_uploaded_file(self, deal_id: str, file: UploadFile, sanitized_filename: str, uploaded_by: str, document_type_hint: str = None) -> DealDocument:
        document_id = str(uuid.uuid4())
        file_path = self._get_safe_path(document_id, sanitized_filename)
        
        # Read file carefully checking size
        file_size = 0
        with open(file_path, "wb") as f:
            while chunk := await file.read(8192):
                file_size += len(chunk)
                if file_size > MAX_UPLOAD_BYTES:
                    # Cleanup
                    os.remove(file_path)
                    raise ValueError(f"File exceeds maximum size limit of {MAX_UPLOAD_BYTES} bytes")
                f.write(chunk)
                
        # Move pointer back to 0 just in case
        await file.seek(0)
        
        # Store in database
        db_doc = DealDocument(
            id=document_id,
            deal_id=int(deal_id) if deal_id.isdigit() else 0, # Assuming deal_id is int internally
            file_name=sanitized_filename,
            file_type=file.content_type or "application/octet-stream",
            document_type=document_type_hint or "unknown",
            uploaded_at=datetime.utcnow(),
            file_size=file_size,
            storage_path=file_path,
            processing_status="uploaded",
            uploaded_by=uploaded_by,
            metadata_json=json.dumps({"original_file_name": file.filename})
        )
        self.db.add(db_doc)
        self.db.commit()
        self.db.refresh(db_doc)
        
        return self._to_pydantic(db_doc)
        
    def get_deal_documents(self, deal_id: str) -> list[DealDocument]:
        docs = self.db.query(DealDocument).filter(DealDocument.deal_id == int(deal_id)).all()
        return [self._to_pydantic(doc) for doc in docs]
        
    def get_document(self, document_id: str) -> DealDocument:
        doc = self.db.query(DealDocument).filter(DealDocument.id == document_id).first()
        if doc:
            return self._to_pydantic(doc)
        return None
        
    def update_document(self, deal_doc: DealDocument):
        doc = self.db.query(DealDocument).filter(DealDocument.id == deal_doc.document_id).first()
        if not doc:
            return
            
        doc.processing_status = deal_doc.processing_status
        doc.document_type = deal_doc.document_type
        
        meta = json.loads(doc.metadata_json) if doc.metadata_json else {}
        meta["summary"] = deal_doc.summary
        meta["extracted_claims"] = [c.model_dump() for c in deal_doc.extracted_claims]
        meta["trust_status"] = deal_doc.trust_status.model_dump()
        meta["extended_metadata"] = deal_doc.metadata
        
        doc.metadata_json = json.dumps(meta)
        self.db.commit()
        
    def delete_document(self, document_id: str):
        doc = self.db.query(DealDocument).filter(DealDocument.id == document_id).first()
        if doc:
            # Delete local files safely
            if doc.storage_path and os.path.exists(doc.storage_path):
                folder_path = os.path.dirname(doc.storage_path)
                if folder_path.startswith(os.path.abspath(UPLOAD_STORAGE_DIR)):
                    shutil.rmtree(folder_path, ignore_errors=True)
            self.db.delete(doc)
            self.db.commit()
            
    def _to_pydantic(self, db_doc: DealDocument) -> DealDocument:
        meta = json.loads(db_doc.metadata_json) if db_doc.metadata_json else {}
        
        claims = [ExtractedDocumentClaim(**c) for c in meta.get("extracted_claims", [])]
        trust = DocumentTrustStatus(**meta.get("trust_status", {}))
        
        return DealDocument(
            document_id=db_doc.id,
            deal_id=str(db_doc.deal_id),
            file_name=db_doc.file_name,
            original_file_name=meta.get("original_file_name", db_doc.file_name),
            file_type=db_doc.file_type,
            mime_type=db_doc.file_type,
            file_size=db_doc.file_size or 0,
            uploaded_at=db_doc.uploaded_at.isoformat() if db_doc.uploaded_at else "",
            uploaded_by=db_doc.uploaded_by or "system",
            document_type=db_doc.document_type or "unknown",
            processing_status=db_doc.processing_status or "uploaded",
            storage_path=db_doc.storage_path,
            summary=meta.get("summary", ""),
            extracted_claims=claims,
            trust_status=trust,
            metadata=meta.get("extended_metadata", {})
        )
