from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class EvidenceBase(BaseModel):
    title: str
    content: Optional[str] = None
    source_url: Optional[str] = None
    evidence_type: str
    metadata_json: Optional[str] = "{}"

class EvidenceCreate(EvidenceBase):
    decision_id: int

class EvidenceResponse(EvidenceBase):
    id: int
    decision_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
