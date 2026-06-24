from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from .meeting_schemas import *
from .meeting_fixtures import MEETINGS

router = APIRouter()

@router.get("/status")
async def get_status():
    return {"status": "healthy", "meetings_loaded": len(MEETINGS)}

@router.get("", response_model=List[ApexMeeting])
async def get_meetings():
    return MEETINGS

@router.get("/{meeting_id}", response_model=ApexMeeting)
async def get_meeting(meeting_id: str):
    for m in MEETINGS:
        if m.meeting_id == meeting_id:
            return m
    raise HTTPException(404, "Not found")

@router.post("/sync-calendar")
async def sync_calendar():
    return {"status": "synced"}

@router.post("/{meeting_id}/generate-prep")
async def generate_prep(meeting_id: str):
    return {"status": "generated", "brief": {"suggested_questions": ["Mock Question 1"]}}

@router.post("/{meeting_id}/upload-transcript")
async def upload_transcript(meeting_id: str):
    return {"status": "uploaded"}

@router.post("/{meeting_id}/analyze-transcript")
async def analyze_transcript(meeting_id: str):
    return {
        "summary": "Mock summary of the call.",
        "claims": ["Mock claim 1"],
        "followups": ["Founder to send cap table"]
    }

@router.get("/{meeting_id}/summary")
async def get_summary(meeting_id: str):
    for m in MEETINGS:
        if m.meeting_id == meeting_id:
            return m.summary
    return {}

@router.get("/{meeting_id}/action-items")
async def get_action_items(meeting_id: str):
    for m in MEETINGS:
        if m.meeting_id == meeting_id:
            return m.action_items
    return []

@router.post("/{meeting_id}/partner-note")
async def add_partner_note(meeting_id: str, payload: Dict[str, Any]):
    return {"status": "added"}

@router.get("/queue/upcoming")
async def get_upcoming():
    return [m for m in MEETINGS if m.metadata.get("is_upcoming")]

@router.get("/queue/followups")
async def get_followups():
    all_followups = []
    for m in MEETINGS:
        all_followups.extend(m.followups)
    return all_followups
