import os
import shutil
import uuid
from typing import BinaryIO
from storage.base import StorageProvider
from core.config import settings

class LocalStorage(StorageProvider):
    def __init__(self):
        self.upload_dir = settings.LOCAL_UPLOAD_DIR
        os.makedirs(self.upload_dir, exist_ok=True)

    def save(self, file_obj: BinaryIO, filename: str, content_type: str) -> str:
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(self.upload_dir, unique_name)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file_obj, buffer)
            
        return file_path

    def get_url(self, file_path: str) -> str:
        # For local dev, we might serve this via a FastAPI static route
        return f"/files/{os.path.basename(file_path)}"

    def delete(self, file_path: str) -> bool:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
