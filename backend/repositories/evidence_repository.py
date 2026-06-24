from sqlalchemy.orm import Session
from db.models import EvidenceItem

class EvidenceRepository:
    @staticmethod
    def get(db: Session, item_id: str):
        return db.query(EvidenceItem).filter(EvidenceItem.id == item_id).first()

    @staticmethod
    def get_by_deal(db: Session, deal_id: int):
        return db.query(EvidenceItem).filter(EvidenceItem.deal_id == deal_id).all()

    @staticmethod
    def create(db: Session, data: dict):
        item = EvidenceItem(**data)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete(db: Session, item_id: str):
        item = db.query(EvidenceItem).filter(EvidenceItem.id == item_id).first()
        if item:
            db.delete(item)
            db.commit()
        return item
