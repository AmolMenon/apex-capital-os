from pydantic import BaseModel
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
