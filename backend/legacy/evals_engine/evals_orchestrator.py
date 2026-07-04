
from fastapi import APIRouter
from evals_engine.eval_fixtures import MOCK_GOLDEN_CASES, MOCK_COPILOT_EVALS, MOCK_GATE_EVALS, MOCK_GROUNDING_EVALS, MOCK_DEMO_FLOW

router = APIRouter()

@router.get("/status")
def get_evals_status():
    return {
        "last_run": "2026-06-14T00:00:00Z",
        "passed": 24,
        "failed": 0,
        "warnings": 2
    }

@router.post("/run")
def run_evals():
    return {"status": "Evals running...", "estimated_time": "10s"}

@router.get("/results")
def get_eval_results():
    return {"status": "success"}

@router.get("/golden-cases")
def get_golden_cases():
    return {"cases": MOCK_GOLDEN_CASES}

@router.get("/copilot")
def get_copilot_evals():
    return {"evals": MOCK_COPILOT_EVALS}

@router.get("/decision-gates")
def get_decision_gates():
    return {"evals": MOCK_GATE_EVALS}
    
@router.get("/demo-flow")
def get_demo_flow():
    return {"flow": MOCK_DEMO_FLOW}
