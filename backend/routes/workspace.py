import os
import shutil
from fastapi import APIRouter, HTTPException, UploadFile, File
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
