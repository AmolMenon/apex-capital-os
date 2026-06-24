
from fastapi import APIRouter
from observability_engine.observability_fixtures import MOCK_DEMO_RELIABILITY

router = APIRouter()

@router.get("/status")
def get_demo_status():
    return MOCK_DEMO_RELIABILITY

@router.post("/run-check")
def run_demo_check():
    return {"status": "Check completed", "result": "Ready for Demo"}
