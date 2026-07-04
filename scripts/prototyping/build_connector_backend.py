import os

base = "/Users/AmolMenon/.gemini/antigravity/scratch/apex-capital/backend"
dirs = {
    "connector": os.path.join(base, "connector_hub_engine"),
    "inbox": os.path.join(base, "deal_inbox_engine"),
    "meeting": os.path.join(base, "meeting_intelligence_engine")
}

for d in dirs.values():
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "__init__.py"), "w").close()

# --- CONNECTOR HUB ---
connector_files = {
    "connector_schemas.py": """from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ConnectorStatus(BaseModel):
    connector_name: str
    provider: str
    status: str
    last_sync_at: str
    records_synced: int
    permissions: List[str]
    safe_mode: bool
    write_enabled: bool
    metadata: Dict[str, Any]

class ConnectorSyncRun(BaseModel):
    provider: str
    started: str
    completed: str
    records: int
    errors: int
    fallback_used: bool

class InboundEmailRecord(BaseModel):
    id: str
    subject: str
    sender: str
    received_at: str
    body: str

class ConnectorPrivacyPolicy(BaseModel):
    provider: str
    policy: str
""",
    "connector_fixtures.py": """from .connector_schemas import *

STATUS_FIXTURES = [
    ConnectorStatus(
        connector_name="Mock Gmail", provider="gmail", status="mock", last_sync_at="Just now", records_synced=142,
        permissions=["read.email"], safe_mode=True, write_enabled=False, metadata={}
    ),
    ConnectorStatus(
        connector_name="Mock Google Calendar", provider="google_calendar", status="mock", last_sync_at="Just now", records_synced=38,
        permissions=["read.calendar"], safe_mode=True, write_enabled=False, metadata={}
    ),
    ConnectorStatus(
        connector_name="Mock Google Drive", provider="google_drive", status="mock", last_sync_at="Just now", records_synced=8,
        permissions=["read.drive"], safe_mode=True, write_enabled=False, metadata={}
    ),
    ConnectorStatus(
        connector_name="Mock Slack", provider="slack", status="mock", last_sync_at="Just now", records_synced=450,
        permissions=["read.messages"], safe_mode=True, write_enabled=False, metadata={}
    ),
    ConnectorStatus(
        connector_name="Mock CRM", provider="crm", status="mock", last_sync_at="Just now", records_synced=50,
        permissions=["read.crm"], safe_mode=True, write_enabled=False, metadata={}
    )
]

SYNC_RUNS = [
    ConnectorSyncRun(provider="gmail", started="2026-06-15T09:00:00Z", completed="2026-06-15T09:00:05Z", records=12, errors=0, fallback_used=True)
]

MOCK_EMAILS = [
    InboundEmailRecord(id="em_1", subject="Intro: BharatVector AI", sender="founder@bharatvector.ai", received_at="2026-06-14T10:00:00Z", body="Hi Apex, we are building AI agents for Indian manufacturing. Deck attached."),
    InboundEmailRecord(id="em_2", subject="GridSense Robotics - Series A", sender="ceo@gridsense.io", received_at="2026-06-14T11:30:00Z", body="Warm intro from PeakXV. Raising $15M for industrial robotics."),
    InboundEmailRecord(id="em_3", subject="LegalFlow AI Pitch", sender="founders@legalflow.ai", received_at="2026-06-15T08:15:00Z", body="Cold inbound. We do AI for lawyers. Growing 20% MoM.")
]
""",
    "connector_orchestrator.py": """from fastapi import APIRouter
from typing import List
from .connector_schemas import *
from .connector_fixtures import STATUS_FIXTURES, SYNC_RUNS, MOCK_EMAILS

router = APIRouter()

@router.get("/status")
async def get_status():
    return {"status": "healthy", "mode": "mock", "providers_loaded": len(STATUS_FIXTURES)}

@router.get("/providers", response_model=List[ConnectorStatus])
async def get_providers():
    return STATUS_FIXTURES

@router.get("/{provider}/status")
async def get_provider_status(provider: str):
    for s in STATUS_FIXTURES:
        if s.provider == provider:
            return s
    return {"error": "not found"}

@router.post("/{provider}/sync")
async def sync_provider(provider: str):
    return {"status": "synced", "provider": provider, "records_fetched": 12, "mock_mode": True}

@router.get("/sync-runs", response_model=List[ConnectorSyncRun])
async def get_sync_runs():
    return SYNC_RUNS

@router.get("/privacy-policy")
async def get_privacy_policy():
    return ConnectorPrivacyPolicy(provider="all", policy="Read-only by default. Mock mode active. No data leaves the secure enclave.")

@router.get("/mock/emails")
async def get_mock_emails():
    return MOCK_EMAILS
"""
}

# --- DEAL INBOX ---
inbox_files = {
    "deal_inbox_schemas.py": """from pydantic import BaseModel
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
""",
    "deal_inbox_fixtures.py": """from .deal_inbox_schemas import *

INBOUND_DEALS = [
    InboundDeal(
        inbound_id="inb_1",
        source="email",
        company_name="BharatVector AI",
        founder_name="Rahul Sharma",
        founder_email="founder@bharatvector.ai",
        received_at="2026-06-14T10:00:00Z",
        subject="Intro: BharatVector AI",
        summary="Building AI agents for Indian manufacturing supply chains.",
        attachments=["BharatVector_Deck_v2.pdf"],
        parsed_claims=["Replacing legacy ERPs", "3 pilots active", "Raising $3M Seed"],
        thesis_match={"match": "High", "reason": "Fits AI Application Layer thesis in emerging markets."},
        priority_score={"priority": "High Priority", "score": 85},
        triage_status="new",
        recommended_next_action="Schedule founder call",
        owner="Partner A",
        metadata={}
    ),
    InboundDeal(
        inbound_id="inb_2",
        source="email",
        company_name="GridSense Robotics",
        founder_name="Sarah Jenkins",
        founder_email="ceo@gridsense.io",
        received_at="2026-06-14T11:30:00Z",
        subject="GridSense Robotics - Series A",
        summary="Industrial robotics. Raising $15M Series A.",
        attachments=["GridSense_SeriesA.pdf"],
        parsed_claims=["$2M ARR", "12 enterprise customers", "Hardware + Software"],
        thesis_match={"match": "Medium", "reason": "Good metrics but hardware heavy."},
        priority_score={"priority": "Review Next", "score": 70},
        triage_status="new",
        recommended_next_action="Review deck",
        owner="Analyst B",
        metadata={}
    ),
    InboundDeal(
        inbound_id="inb_3",
        source="email",
        company_name="LegalFlow AI",
        founder_name="Tom Chen",
        founder_email="founders@legalflow.ai",
        received_at="2026-06-15T08:15:00Z",
        subject="LegalFlow AI Pitch",
        summary="AI co-pilot for lawyers.",
        attachments=["LegalFlow_Deck.pdf"],
        parsed_claims=["20% MoM growth", "Pre-seed round"],
        thesis_match={"match": "Weak", "reason": "Crowded market, cold outbound."},
        priority_score={"priority": "Watchlist", "score": 40},
        triage_status="new",
        recommended_next_action="Pass or ask for retention data",
        owner="Analyst B",
        metadata={}
    )
]
""",
    "deal_inbox_orchestrator.py": """from fastapi import APIRouter, HTTPException
from typing import List
from .deal_inbox_schemas import *
from .deal_inbox_fixtures import INBOUND_DEALS

router = APIRouter()

@router.get("/status")
async def get_status():
    return {"status": "healthy", "inbound_records_loaded": len(INBOUND_DEALS)}

@router.get("/items", response_model=List[InboundDeal])
async def get_items():
    return INBOUND_DEALS

@router.get("/items/{inbound_id}", response_model=InboundDeal)
async def get_item(inbound_id: str):
    for d in INBOUND_DEALS:
        if d.inbound_id == inbound_id:
            return d
    raise HTTPException(404, "Not found")

@router.post("/sync")
async def sync_inbox():
    return {"status": "synced", "new_items": 0}

@router.post("/items/{inbound_id}/triage")
async def triage_item(inbound_id: str):
    return {"status": "triaged", "inbound_id": inbound_id}

@router.post("/items/{inbound_id}/convert-to-deal")
async def convert_item(inbound_id: str):
    return {"status": "converted", "deal_id": "deal_" + inbound_id}

@router.post("/items/{inbound_id}/pass")
async def pass_item(inbound_id: str):
    return {"status": "passed"}

@router.post("/items/{inbound_id}/watchlist")
async def watchlist_item(inbound_id: str):
    return {"status": "watchlisted"}

@router.post("/items/{inbound_id}/request-info")
async def request_info(inbound_id: str):
    return {"status": "info_requested"}

@router.get("/duplicates")
async def get_duplicates():
    return []

@router.get("/priority-queue")
async def get_priority_queue():
    return [d for d in INBOUND_DEALS if d.priority_score.get("priority") == "High Priority"]
"""
}

# --- MEETING INTELLIGENCE ---
meeting_files = {
    "meeting_schemas.py": """from pydantic import BaseModel
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
""",
    "meeting_fixtures.py": """from .meeting_schemas import *

MEETINGS = [
    ApexMeeting(
        meeting_id="mtg_1",
        title="BharatVector AI - Intro Call",
        meeting_type="founder_call",
        related_entity_type="deal",
        related_entity_id="bharatvector",
        start_time="2026-06-16T10:00:00Z",
        end_time="2026-06-16T10:45:00Z",
        participants=["Partner A", "Rahul Sharma (Founder)"],
        agenda="Introductory pitch, understand tech differentiation.",
        prep_brief={
            "company_summary": "AI agents for Indian manufacturing.",
            "thesis_fit": "High - aligns with emerging market AI application thesis.",
            "suggested_questions": ["How do you integrate with legacy ERPs like SAP/Tally?", "What is the sales cycle length?"]
        },
        summary={},
        action_items=[],
        followups=[],
        founder_claims=[],
        partner_notes=[],
        metadata={"is_upcoming": True}
    ),
    ApexMeeting(
        meeting_id="mtg_2",
        title="NeuralDesk - Partner Review",
        meeting_type="partner_review",
        related_entity_type="deal",
        related_entity_id="neuraldesk",
        start_time="2026-06-14T14:00:00Z",
        end_time="2026-06-14T15:00:00Z",
        participants=["Partner A", "Partner B", "Analyst C"],
        agenda="Review diligence findings before IC.",
        prep_brief={},
        summary={
            "what_happened": "Reviewed technical diligence. Partner B raised concerns on churn.",
            "next_best_action": "Wait for updated cohort retention data."
        },
        action_items=[MeetingActionItem(task="Request updated cohorts", owner="Analyst C", due_date="2026-06-16")],
        followups=["Founder to send updated cohorts"],
        founder_claims=[],
        partner_notes=["I am still not convinced the product is sticky enough - Partner B"],
        metadata={"is_upcoming": False}
    )
]
""",
    "meeting_orchestrator.py": """from fastapi import APIRouter, HTTPException
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
"""
}

def write_files(directory, file_dict):
    for name, content in file_dict.items():
        with open(os.path.join(directory, name), "w") as f:
            f.write(content)

write_files(dirs["connector"], connector_files)
write_files(dirs["inbox"], inbox_files)
write_files(dirs["meeting"], meeting_files)

# Add dummy stubs for the rest of the requested files
stubs = {
    "connector": ["gmail_connector.py", "calendar_connector.py", "drive_connector.py", "slack_connector.py", "crm_connector.py", "connector_sync_engine.py", "connector_mapping_engine.py", "connector_deduplication_engine.py", "connector_privacy_policy.py", "connector_report_builder.py", "connector_registry.py", "connector_auth_status.py"],
    "inbox": ["inbound_triage_engine.py", "deck_attachment_processor.py", "founder_email_parser.py", "inbound_deduplication_engine.py", "thesis_matcher.py", "deal_creation_engine.py", "inbox_priority_engine.py", "inbound_followup_engine.py", "deal_inbox_report_builder.py"],
    "meeting": ["calendar_meeting_mapper.py", "call_transcript_parser.py", "meeting_prep_engine.py", "meeting_summary_engine.py", "founder_claim_extractor.py", "followup_extractor.py", "meeting_action_item_engine.py", "partner_note_engine.py", "meeting_memory_engine.py", "meeting_report_builder.py", "meeting_registry.py"]
}

for engine, file_list in stubs.items():
    d = dirs[engine]
    for f in file_list:
        p = os.path.join(d, f)
        if not os.path.exists(p):
            with open(p, "w") as file:
                file.write("# " + f + "\\n# Placeholder for future logic\\n")

print("Backend files generated.")
