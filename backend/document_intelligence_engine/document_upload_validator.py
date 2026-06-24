import os
import re
from fastapi import UploadFile, HTTPException

MAX_UPLOAD_MB = int(os.environ.get("MAX_UPLOAD_MB", 25))
MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024

SUPPORTED_EXTENSIONS = {
    ".pdf", ".pptx", ".docx", ".xlsx", ".csv", ".txt", ".md",
    ".png", ".jpg", ".jpeg"
}

FORBIDDEN_EXTENSIONS = {
    ".exe", ".sh", ".bat", ".cmd", ".msi", ".vbs", ".js", ".py", ".php", ".rb"
}

def sanitize_filename(filename: str) -> str:
    """
    Remove potentially dangerous characters from filename to prevent path traversal
    and execution issues.
    """
    if not filename:
        return "unnamed_file"
    
    # Strip path information
    filename = os.path.basename(filename)
    
    # Replace anything that isn't alphanumeric, dot, dash, or underscore
    clean_name = re.sub(r'[^a-zA-Z0-9.\-_]', '_', filename)
    
    return clean_name

def validate_document_upload(file: UploadFile) -> str:
    """
    Validates the uploaded file.
    Raises HTTPException if invalid.
    Returns the sanitized filename.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
        
    sanitized_name = sanitize_filename(file.filename)
    
    # Check extension
    _, ext = os.path.splitext(sanitized_name)
    ext = ext.lower()
    
    if ext in FORBIDDEN_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Executable and script files are not allowed")
        
    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Supported types: {', '.join(SUPPORTED_EXTENSIONS)}")
        
    return sanitized_name
