
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
