from storage.local_storage import LocalStorage
from storage.s3_storage import S3Storage
from core.config import settings

def get_storage_provider():
    if settings.FILE_STORAGE_PROVIDER == "s3":
        return S3Storage()
    return LocalStorage()
