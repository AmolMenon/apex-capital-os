from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import UploadedFile, User
from auth.dependencies import get_current_user
from storage import get_storage_provider
from core.config import settings

router = APIRouter()

@router.post("/upload")
def upload_file(
    deal_id: int = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validation
    ALLOWED_TYPES = ["application/pdf", "text/plain", "application/json", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    MAX_SIZE = 50 * 1024 * 1024 # 50 MB
    
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")
        
    if getattr(file, "size", 0) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 50MB")

    storage_provider = get_storage_provider()
    
    # Save the file
    file_path = storage_provider.save(file.file, file.filename, file.content_type)
    
    # Record in database
    uploaded_file = UploadedFile(
        deal_id=deal_id,
        filename=file.filename,
        original_filename=file.filename,
        content_type=file.content_type,
        size=file.size,
        storage_provider=settings.FILE_STORAGE_PROVIDER,
        file_path=file_path
    )
    db.add(uploaded_file)
    db.commit()
    db.refresh(uploaded_file)
    
    return {
        "id": uploaded_file.id,
        "filename": uploaded_file.filename,
        "url": storage_provider.get_url(file_path)
    }

@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    uploaded_file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not uploaded_file:
        raise HTTPException(status_code=404, detail="File not found")
        
    storage_provider = get_storage_provider()
    storage_provider.delete(uploaded_file.file_path)
    
    db.delete(uploaded_file)
    db.commit()
    return {"status": "deleted"}
