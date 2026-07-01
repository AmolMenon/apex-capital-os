from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
import json

router = APIRouter()

@router.get("/deals/{deal_id}/report")
def get_report(deal_id: str):
    return {
        "company_name": "Apex Demo Startup",
        "assumed_entry_valuation": 50000000,
        "cheque_size": 10000000,
        "target_ownership": 20,
        "scenarios": [
            {"name": "Base Case", "exit_value": 1000000000, "multiple": 10, "probability": 0.5},
            {"name": "Upside", "exit_value": 5000000000, "multiple": 50, "probability": 0.1},
            {"name": "Downside", "exit_value": 0, "multiple": 0, "probability": 0.4}
        ],
        "warnings": ["High valuation relative to traction"]
    }

@router.post("/deals/{deal_id}/run")
def run_structuring(deal_id: str):
    return {"status": "success"}

@router.get("/status")
def get_status():
    return {"status": "online"}
