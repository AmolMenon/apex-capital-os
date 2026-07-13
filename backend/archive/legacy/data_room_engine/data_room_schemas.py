from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class MetricConfidence(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class VerificationStatus(str, Enum):
    EXTRACTED = "extracted"
    REQUIRES_REVIEW = "requires_review"
    CONFLICTING = "conflicting"
    MISSING = "missing"
    ASSUMPTION = "assumption"

class ExtractionMethod(str, Enum):
    DETERMINISTIC = "deterministic"
    LLM = "LLM"
    USER_ENTERED = "user entered"
    MOCK_FIXTURE = "mock fixture"

class DataRoomDocument(BaseModel):
    document_id: str
    deal_id: int
    file_name: str
    file_type: str
    document_category: str
    upload_time: datetime = Field(default_factory=datetime.utcnow)
    file_size: int
    storage_path: str
    parse_status: str # "pending", "parsed", "failed", "unsupported"
    uploaded_by: str
    metadata: Dict[str, Any] = {}

class ParsedDocument(BaseModel):
    document_id: str
    text_content: Optional[str] = None
    tables: List[Dict[str, Any]] = []
    metadata: Dict[str, Any] = {}

class ExtractedMetric(BaseModel):
    metric_name: str
    metric_value: str
    period: Optional[str] = None
    unit: Optional[str] = None
    source_document: Optional[str] = None
    source_page_or_sheet: Optional[str] = None
    extraction_method: ExtractionMethod
    confidence: MetricConfidence
    verification_status: VerificationStatus
    decision_importance: str # "High", "Medium", "Low"

class PrivateEvidenceItem(BaseModel):
    claim: str
    source_document: str
    source_location: str
    confidence: MetricConfidence
    verification_status: VerificationStatus
    linked_public_claim: Optional[str] = None
    contradiction_status: bool = False
    decision_impact: str

class DataRoomCompletenessScore(BaseModel):
    score: int # 0-100
    level: str # "Sparse", "Basic", "Diligence Ready", "IC Ready"
    missing_documents: List[str]
    critical_gaps: List[str]
    recommended_uploads: List[str]

class DataRoomContradiction(BaseModel):
    issue: str
    severity: str # "High", "Medium", "Low"
    documents_involved: List[str]
    evidence_a: str
    evidence_b: str
    recommended_action: str
    decision_impact: str

class PrivateEvidenceGraph(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class DataRoomReport(BaseModel):
    deal_id: int
    company_name: str
    documents_uploaded: List[DataRoomDocument] = []
    documents_parsed: List[str] = []
    metrics_extracted: List[ExtractedMetric] = []
    private_evidence_items: List[PrivateEvidenceItem] = []
    contradictions: List[DataRoomContradiction] = []
    missing_documents: List[str] = []
    missing_metrics: List[str] = []
    data_room_completeness_score: int = 0
    completeness_level: str = "Sparse"
    private_data_confidence: str = "Low"
    decision_impact: Dict[str, str] = {}
    recommended_diligence_actions: List[str] = []
    metadata: Dict[str, Any] = {}

class DocumentParseMetadata(BaseModel):
    pages_parsed: int = 0
    tables_found: int = 0
    ocr_needed: bool = False
    error_message: Optional[str] = None
