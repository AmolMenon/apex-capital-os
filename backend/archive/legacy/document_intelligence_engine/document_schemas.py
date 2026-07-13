from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class DocumentUploadRequest(BaseModel):
    document_type: Optional[str] = Field(None, description="User-provided document type hint")
    notes: Optional[str] = None

class ExtractedDocumentClaim(BaseModel):
    claim_text: str
    source_document_id: str
    page_reference: Optional[str] = None
    claim_category: str # e.g., 'revenue claim', 'market claim', 'traction claim'
    confidence: str # 'Low', 'Medium', 'High'
    verification_status: str # 'company_provided', 'needs_verification', 'analyst_note'
    decision_impact: str # 'low', 'medium', 'high'

class DocumentTrustStatus(BaseModel):
    trust_labels: List[str] = Field(default_factory=list) # e.g., 'Needs Verification', 'Company-Provided', 'Parsed Low Confidence'
    provenance_notes: str = ""

class DocumentParseResult(BaseModel):
    status: str # 'success', 'failed', 'partial'
    error_message: Optional[str] = None
    metrics_found: Dict[str, Any] = Field(default_factory=dict)
    warnings: List[str] = Field(default_factory=list)

class DocumentEvidenceItem(BaseModel):
    evidence_id: str
    document_id: str
    claim_text: str
    category: str
    link_to_source: str

class DocumentMissingInfoImpact(BaseModel):
    resolved_fields: List[str] = Field(default_factory=list)
    partially_resolved_fields: List[str] = Field(default_factory=list)
    still_missing: List[str] = Field(default_factory=list)

class DocumentTypeClassification(BaseModel):
    predicted_type: str
    confidence: str
    reasons: List[str] = Field(default_factory=list)
    needs_user_confirmation: bool = False

class DealDocument(BaseModel):
    document_id: str
    deal_id: str
    file_name: str
    original_file_name: str
    file_type: str
    mime_type: str
    file_size: int
    uploaded_at: str
    uploaded_by: str
    document_type: str
    processing_status: str # 'uploaded', 'processing', 'parsed', 'failed', 'unsupported'
    storage_path: str
    summary: str = ""
    extracted_claims: List[ExtractedDocumentClaim] = Field(default_factory=list)
    trust_status: DocumentTrustStatus = Field(default_factory=DocumentTrustStatus)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class DocumentUploadResponse(BaseModel):
    status: str
    document: DealDocument
