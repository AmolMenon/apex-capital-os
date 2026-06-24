from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from diligence_run_engine.diligence_run_schemas import DiligenceRunRequest, DiligenceRun
from diligence_run_engine.diligence_run_orchestrator import DiligenceRunOrchestrator
from diligence_run_engine.diligence_run_history_engine import DiligenceRunHistoryEngine

router = APIRouter()

def _normalize(deal_id: str) -> int:
    d_id = str(deal_id).replace("deal-", "").replace("src_", "").lower()
    if d_id == "active": return 7
    if d_id == "zepto": return 7
    if d_id == "mistral": return 5
    if d_id == "bharatvector": return 999
    try: return int(d_id)
    except: return 0

@router.get("/diligence-runs/status")
def get_status():
    return {
        "status": "ok", 
        "modules_loaded": [
            "orchestrator", "document_review", "evidence_updater", 
            "gap_analyzer", "decision_synthesizer", "report_builder", "run_history"
        ]
    }

@router.get("/deals/{deal_id}/diligence-runs")
def get_runs(deal_id: str, db: Session = Depends(get_db)):
    runs = DiligenceRunHistoryEngine.get_runs(db, _normalize(deal_id))
    return [DiligenceRunOrchestrator(db)._format_run(r) for r in runs]

@router.get("/deals/{deal_id}/diligence-runs/latest")
def get_latest_run(deal_id: str, db: Session = Depends(get_db)):
    runs = DiligenceRunHistoryEngine.get_runs(db, _normalize(deal_id))
    if not runs:
        return None
    return DiligenceRunOrchestrator(db)._format_run(runs[0])

@router.get("/deals/{deal_id}/diligence-runs/{run_id}")
def get_run(deal_id: str, run_id: str, db: Session = Depends(get_db)):
    run = DiligenceRunHistoryEngine.get_run(db, _normalize(deal_id), run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return DiligenceRunOrchestrator(db)._format_run(run)

@router.post("/deals/{deal_id}/diligence-runs/run")
def run_diligence(deal_id: str, request: DiligenceRunRequest, db: Session = Depends(get_db)):
    orchestrator = DiligenceRunOrchestrator(db)
    return orchestrator.run_diligence(_normalize(deal_id), request)

@router.post("/deals/{deal_id}/diligence-runs/{run_id}/rerun")
def rerun_diligence(deal_id: str, run_id: str, request: DiligenceRunRequest, db: Session = Depends(get_db)):
    # Simply triggers a new run
    orchestrator = DiligenceRunOrchestrator(db)
    return orchestrator.run_diligence(_normalize(deal_id), request)

@router.get("/deals/{deal_id}/diligence-runs/{run_id}/steps")
def get_run_steps(deal_id: str, run_id: str, db: Session = Depends(get_db)):
    steps = DiligenceRunHistoryEngine.get_run_steps(db, run_id)
    import json
    return [{
        "step_id": s.step_id,
        "name": s.name,
        "status": s.status,
        "started_at": s.started_at,
        "completed_at": s.completed_at,
        "summary": s.summary,
        "outputs": json.loads(s.outputs_json) if s.outputs_json else {},
        "warnings": json.loads(s.warnings_json) if s.warnings_json else [],
        "errors": json.loads(s.errors_json) if s.errors_json else []
    } for s in steps]

@router.get("/deals/{deal_id}/diligence-runs/{run_id}/report")
def get_run_report(deal_id: str, run_id: str, db: Session = Depends(get_db)):
    run = DiligenceRunHistoryEngine.get_run(db, _normalize(deal_id), run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    import json
    return json.loads(run.report_json) if run.report_json else {}

@router.get("/deals/{deal_id}/diligence-runs/{run_id}/tasks")
def get_run_tasks(deal_id: str, run_id: str, db: Session = Depends(get_db)):
    run = DiligenceRunHistoryEngine.get_run(db, _normalize(deal_id), run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    import json
    return [{"task": gap, "source": "Diligence Run", "priority": "High"} for gap in json.loads(run.missing_information_json)]
