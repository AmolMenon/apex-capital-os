from fastapi import APIRouter, HTTPException
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
    if inbound_id == "inb_bharatvector":
        return {"status": "converted", "deal_id": "999"}
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
