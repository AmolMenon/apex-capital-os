from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class MeetingActionItem(BaseModel):
    task: str
    owner: str
    due_date: str

class ApexMeeting(BaseModel):
    meeting_id: str
    title: str
    meeting_type: str
    related_entity_type: str
    related_entity_id: str
    start_time: str
    end_time: str
    participants: List[str]
    agenda: str
    prep_brief: Dict[str, Any]
    summary: Dict[str, Any]
    action_items: List[MeetingActionItem]
    followups: List[str]
    founder_claims: List[str]
    partner_notes: List[str]
    metadata: Dict[str, Any]
