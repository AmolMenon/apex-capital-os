from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any
from db.database import get_db
from auth.dependencies import get_current_active_user, require_decision_access
import database.crud as crud
from db.models import Decision
from reasoning_engine.engine import UniversalReasoningEngine

router = APIRouter()

@router.post("/{decision_id}/evaluate")
def evaluate_decision(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
        
    engine = UniversalReasoningEngine(db=db)
    try:
        result = engine.evaluate_decision(decision_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{decision_id}/evaluate_adaptive")
def evaluate_decision_adaptive(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    from reasoning_engine.adaptive_controller import AdaptiveReasoningController
        
    controller = AdaptiveReasoningController(db=db)
    try:
        result_json = controller.evaluate_decision_adaptive(decision_id)
        import json
        return json.loads(result_json)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{decision_id}/evaluate")
def get_evaluation(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    import json
    
    # Get the latest completed reasoning run
    run = db.query(db_models.ReasoningRun).filter(
        db_models.ReasoningRun.decision_id == decision_id,
        db_models.ReasoningRun.status == "Completed"
    ).order_by(db_models.ReasoningRun.start_time.desc()).first()
    
    if not run or not run.output_json:
        return None
        
    return json.loads(run.output_json)

@router.get("/{decision_id}/status")
def get_run_status(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    
    # Get the latest reasoning run
    run = db.query(db_models.ReasoningRun).filter(
        db_models.ReasoningRun.decision_id == decision_id
    ).order_by(db_models.ReasoningRun.start_time.desc()).first()
    
    if not run:
        return {"status": "Not Started"}
        
    return {"status": run.status, "run_id": run.id}

@router.get("/{decision_id}/adaptive-trace/{object_type}/{object_id}")
def get_adaptive_trace(
    decision_id: int,
    object_type: str,
    object_id: str,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    from services.graph_service import GraphService
    node_id = f"{object_type.lower()}:{object_id}"
    trace = GraphService.trace_provenance(db, decision_id, node_id)
    if "error" in trace:
        raise HTTPException(status_code=404, detail=trace["error"])
    return trace
