
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
