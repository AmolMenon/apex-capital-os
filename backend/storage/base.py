from abc import ABC, abstractmethod
from typing import BinaryIO

class StorageProvider(ABC):
    @abstractmethod
    def save(self, file_obj: BinaryIO, filename: str, content_type: str) -> str:
        pass

    @abstractmethod
    def get_url(self, file_path: str) -> str:
        pass

    @abstractmethod
    def delete(self, file_path: str) -> bool:
        pass
