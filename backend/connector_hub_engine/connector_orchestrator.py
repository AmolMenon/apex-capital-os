from fastapi import APIRouter
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
