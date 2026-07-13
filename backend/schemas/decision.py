from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class DecisionSubjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    metadata_json: Optional[str] = "{}"

class DecisionSubjectCreate(DecisionSubjectBase):
    pass

class DecisionSubjectResponse(DecisionSubjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class DecisionBase(BaseModel):
    subject_id: int
    domain_pack_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    status: Optional[str] = "Framing"

class DecisionCreate(DecisionBase):
    pass

class DecisionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    domain_pack_id: Optional[str] = None

class DecisionResponse(DecisionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    subject: Optional[DecisionSubjectResponse] = None
    
    model_config = ConfigDict(from_attributes=True)
