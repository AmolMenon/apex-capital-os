from .connector_schemas import *

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
