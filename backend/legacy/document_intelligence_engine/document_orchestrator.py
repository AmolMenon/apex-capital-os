import os
from fastapi import UploadFile
from sqlalchemy.orm import Session

from document_intelligence_engine.document_schemas import DealDocument
from document_intelligence_engine.document_storage_engine import DocumentStorageEngine
from document_intelligence_engine.document_classifier import DocumentClassifier
from document_intelligence_engine.document_parser import DocumentParser
from document_intelligence_engine.claim_extraction_engine import ClaimExtractionEngine
from document_intelligence_engine.document_evidence_mapper import DocumentEvidenceMapper
from document_intelligence_engine.document_trust_engine import DocumentTrustEngine
from document_intelligence_engine.missing_info_resolver import MissingInfoResolver
from document_intelligence_engine.document_upload_validator import validate_document_upload

class DocumentOrchestrator:
    def __init__(self, db: Session):
        self.db = db
        self.storage = DocumentStorageEngine(db)
        self.parser = DocumentParser()
        self.evidence_mapper = DocumentEvidenceMapper(db)

    async def process_upload(self, deal_id: str, file: UploadFile, uploaded_by: str, document_type_hint: str = None) -> DealDocument:
        # 1. Validate
        sanitized_filename = validate_document_upload(file)
        
        # 2. Store
        doc = await self.storage.save_uploaded_file(deal_id, file, sanitized_filename, uploaded_by, document_type_hint)
        
        # 3. Parse & Classify & Extract
        self._run_pipeline(doc)
        
        # 4. Save updates
        self.storage.update_document(doc)
        
        # 5. Map Evidence
        if doc.extracted_claims:
            self.evidence_mapper.map_claims_to_evidence(deal_id, doc.document_id, doc.extracted_claims)
            
        return doc
        
    def _run_pipeline(self, doc: DealDocument):
        doc.processing_status = "processing"
        
        # Parse text
        parse_result, extracted_text = self.parser.parse(doc.storage_path, doc.mime_type, doc.document_type)
        doc.processing_status = parse_result.status
        
        if doc.processing_status in ["failed", "unsupported"]:
            doc.summary = parse_result.error_message or "Parsing failed."
            return
            
        # Classify if unknown
        if doc.document_type == "unknown":
            classification = DocumentClassifier.classify(doc.original_file_name, doc.mime_type, extracted_text)
            doc.document_type = classification.predicted_type
            
        # Extract Claims & Summary
        doc.extracted_claims = ClaimExtractionEngine.extract_claims(extracted_text, doc.document_id, doc.document_type)
        doc.summary = ClaimExtractionEngine.generate_summary(extracted_text, doc.document_type)
        
        # Evaluate Trust
        doc.trust_status = DocumentTrustEngine.evaluate_trust(doc.document_type, doc.extracted_claims)
