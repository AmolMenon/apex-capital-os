from sqlalchemy.orm import Session
from db.models import TrustAudit

class TrustRepository:
    @staticmethod
    def get(db: Session, item_id: str):
        return db.query(TrustAudit).filter(TrustAudit.id == item_id).first()

    @staticmethod
    def get_by_deal(db: Session, deal_id: int):
        return db.query(TrustAudit).filter(TrustAudit.deal_id == deal_id).all()

    @staticmethod
    def create(db: Session, data: dict):
        item = TrustAudit(**data)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete(db: Session, item_id: str):
        item = db.query(TrustAudit).filter(TrustAudit.id == item_id).first()
        if item:
            db.delete(item)
            db.commit()
        return item
