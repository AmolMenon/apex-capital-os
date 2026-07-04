from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class InboundDeal(BaseModel):
    inbound_id: str
    source: str
    company_name: str
    founder_name: str
    founder_email: str
    received_at: str
    subject: str
    summary: str
    attachments: List[str]
    parsed_claims: List[str]
    thesis_match: Dict[str, Any]
    priority_score: Dict[str, Any]
    triage_status: str
    recommended_next_action: str
    owner: str
    metadata: Dict[str, Any]
