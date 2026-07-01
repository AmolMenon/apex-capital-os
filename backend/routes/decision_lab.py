from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
def get_status():
    return {"status": "active", "total_cases": 120}

@router.get("/cases")
def get_cases():
    return [
        {"id": "case-1", "company_name": "Mock Uber", "decision": "Pass", "outcome": "Missed Unicorn", "date": "2010-01-01"},
        {"id": "case-2", "company_name": "Mock WeWork", "decision": "Pass", "outcome": "Dodged Bullet", "date": "2017-01-01"}
    ]

@router.get("/backtests")
def get_backtests():
    return []

@router.get("/missed-deals")
def get_missed_deals():
    return []

@router.get("/false-positives")
def get_false_positives():
    return []

@router.get("/playbook-backtests")
def get_playbook_backtests():
    return []

@router.get("/counterfactuals")
def get_counterfactuals():
    return []
