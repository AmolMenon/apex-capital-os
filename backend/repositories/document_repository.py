from repositories.base import CRUDBase
from db.models import Document
from schemas.document import DocumentCreate, DocumentUpdate

class CRUDDocument(CRUDBase[Document, DocumentCreate, DocumentUpdate]):
    pass

document_repo = CRUDDocument(Document)
