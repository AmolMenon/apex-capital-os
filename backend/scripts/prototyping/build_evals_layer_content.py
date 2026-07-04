import os

eval_schemas_content = """
from pydantic import BaseModel
from typing import List, Optional

class EvalResult(BaseModel):
    eval_name: str
    status: str
    failure_reason: Optional[str] = None
    confidence: Optional[int] = None
    severity: Optional[str] = None

class CopilotEval(BaseModel):
    question: str
    result: str
    failure_reason: Optional[str] = None
    answer_confidence: int

class DemoFlowEval(BaseModel):
    route_name: str
    status: str
    warnings: List[str]
"""
with open("backend/evals_engine/eval_schemas.py", "w") as f:
    f.write(eval_schemas_content)

eval_fixtures_content = """
from evals_engine.eval_schemas import EvalResult, CopilotEval, DemoFlowEval

MOCK_GOLDEN_CASES = [
    {"case": "Sarvam AI", "status": "Passed", "details": "Public benchmark cap applied correctly."},
    {"case": "NeuralDesk", "status": "Passed", "details": "Private diligence math block applied."},
    {"case": "Zepto", "status": "Passed", "details": "Benchmark-only mode active."},
    {"case": "CarbonLoop", "status": "Passed", "details": "Follow-on logic applied."},
    {"case": "Apex Demo Fund I", "status": "Passed", "details": "LP mock labeling active."},
    {"case": "BharatVector AI", "status": "Passed", "details": "Sourcing lead created."}
]

MOCK_COPILOT_EVALS = [
    CopilotEval(
        question="Should we invest in Sarvam AI?",
        result="Passed",
        answer_confidence=95
    ),
    CopilotEval(
        question="What private metrics are missing?",
        result="Passed",
        answer_confidence=90
    )
]

MOCK_GATE_EVALS = [
    EvalResult(
        eval_name="Public benchmark + no private data = no direct Invest",
        status="Passed",
        severity="High"
    ),
    EvalResult(
        eval_name="Missing cap table = fund math confidence low",
        status="Passed",
        severity="High"
    )
]

MOCK_GROUNDING_EVALS = [
    {"output": "ic_packet_neuraldesk", "score": 85, "unsupported_claims": 0},
    {"output": "memo_sarvam_ai", "score": 95, "unsupported_claims": 0}
]

MOCK_DEMO_FLOW = [
    DemoFlowEval(
        route_name="/sourcing",
        status="Healthy",
        warnings=[]
    ),
    DemoFlowEval(
        route_name="/deals/active/war-room",
        status="Healthy",
        warnings=[]
    )
]
"""
with open("backend/evals_engine/eval_fixtures.py", "w") as f:
    f.write(eval_fixtures_content)

eval_orchestrator_content = """
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
"""
with open("backend/evals_engine/evals_orchestrator.py", "w") as f:
    f.write(eval_orchestrator_content)

print("Evals Layer content built.")
