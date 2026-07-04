from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ReasoningAgentResponse(BaseModel):
    id: str
    domain_pack_id: str
    name: str
    system_prompt: str
    capabilities_json: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class DecisionFrameworkResponse(BaseModel):
    id: str
    domain_pack_id: str
    name: str
    stages_json: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class DomainPackBase(BaseModel):
    name: str
    description: Optional[str] = None
    config_json: str

class DomainPackResponse(DomainPackBase):
    id: str
    created_at: datetime
    reasoning_agents: List[ReasoningAgentResponse] = []
    decision_frameworks: List[DecisionFrameworkResponse] = []
    
    class Config:
        from_attributes = True
