from sqlalchemy.orm import Session
from db.models import DealDocument

class DocumentRepository:
    @staticmethod
    def get_document(db: Session, document_id: str):
        return db.query(DealDocument).filter(DealDocument.id == document_id).first()

    @staticmethod
    def get_deal_documents(db: Session, deal_id: int):
        return db.query(DealDocument).filter(DealDocument.deal_id == deal_id).all()

    @staticmethod
    def create_document(db: Session, doc_data: dict):
        doc = DealDocument(**doc_data)
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return doc

    @staticmethod
    def update_document(db: Session, document_id: str, update_data: dict):
        doc = db.query(DealDocument).filter(DealDocument.id == document_id).first()
        if doc:
            for key, value in update_data.items():
                setattr(doc, key, value)
            db.commit()
            db.refresh(doc)
        return doc

    @staticmethod
    def delete_document(db: Session, document_id: str):
        doc = db.query(DealDocument).filter(DealDocument.id == document_id).first()
        if doc:
            db.delete(doc)
            db.commit()
        return doc
