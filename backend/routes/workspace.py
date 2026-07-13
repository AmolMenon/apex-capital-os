import os
import shutil
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import FileResponse
from typing import Dict, Any

router = APIRouter()

@router.get("/workspace/export")
def export_workspace():
    try:
        # Create a temporary directory for workspace export
        os.makedirs("workspace_tmp", exist_ok=True)
        if os.path.exists("apex_capital.db"):
            shutil.copy("apex_capital.db", "workspace_tmp/apex_capital.db")
        if os.path.exists("uploads"):
            shutil.copytree("uploads", "workspace_tmp/uploads", dirs_exist_ok=True)
            
        shutil.make_archive("workspace_export", "zip", "workspace_tmp")
        shutil.rmtree("workspace_tmp")
        
        return FileResponse("workspace_export.zip", media_type="application/zip", filename="apex_workspace.zip")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/workspace/import")
async def import_workspace(file: UploadFile = File(...)):
    try:
        # Save the uploaded zip
        with open("workspace_import.zip", "wb") as f:
            while chunk := await file.read(8192):
                f.write(chunk)
        
        # Unzip directly into backend folder (which will overwrite apex_capital.db and uploads/)
        shutil.unpack_archive("workspace_import.zip", ".")
        return {"status": "success", "message": "Workspace imported successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from sqlalchemy.orm import Session
from db.database import get_db
from services.fundraising_memory_service import FundraisingMemoryService
from db.models import ReviewRun

@router.get("/workspace/{decision_id}/review-runs")
def get_review_runs(decision_id: int, db: Session = Depends(get_db)):
    runs = db.query(ReviewRun).filter(ReviewRun.decision_id == decision_id).order_by(ReviewRun.created_at.desc()).all()
    return [{"id": r.id, "created_at": r.created_at, "status": r.status, "duration_ms": r.duration_ms} for r in runs]

@router.get("/workspace/{decision_id}/timeline")
def get_timeline(decision_id: int, db: Session = Depends(get_db)):
    service = FundraisingMemoryService(db)
    return service.get_timeline(decision_id)

@router.get("/workspace/{decision_id}/momentum")
def get_momentum(decision_id: int, db: Session = Depends(get_db)):
    service = FundraisingMemoryService(db)
    return {"momentum": service.calculate_momentum(decision_id)}

@router.get("/workspace/review-diff")
def get_review_diff(run_a_id: int, run_b_id: int, db: Session = Depends(get_db)):
    service = FundraisingMemoryService(db)
    try:
        return service.get_review_diff(run_a_id, run_b_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
