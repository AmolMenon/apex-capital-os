import boto3
import uuid
import os
from typing import BinaryIO
from storage.base import StorageProvider
from core.config import settings

class S3Storage(StorageProvider):
    def __init__(self):
        self.bucket = settings.S3_BUCKET
        self.s3_client = boto3.client(
            "s3",
            region_name=settings.S3_REGION,
            aws_access_key_id=settings.S3_ACCESS_KEY_ID,
            aws_secret_access_key=settings.S3_SECRET_ACCESS_KEY,
        )

    def save(self, file_obj: BinaryIO, filename: str, content_type: str) -> str:
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        self.s3_client.upload_fileobj(
            file_obj,
            self.bucket,
            unique_name,
            ExtraArgs={"ContentType": content_type}
        )
        return unique_name

    def get_url(self, file_path: str) -> str:
        # Generate presigned URL
        url = self.s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": file_path},
            ExpiresIn=3600
        )
        return url

    def delete(self, file_path: str) -> bool:
        try:
            self.s3_client.delete_object(Bucket=self.bucket, Key=file_path)
            return True
        except Exception:
            return False
