from sqlalchemy.orm import Session
from db.models import AuditLog

class AuditLogRepository:
    @staticmethod
    def get(db: Session, item_id: str):
        return db.query(AuditLog).filter(AuditLog.id == item_id).first()

    @staticmethod
    def get_by_deal(db: Session, deal_id: int):
        return db.query(AuditLog).filter(AuditLog.deal_id == deal_id).all()

    @staticmethod
    def create(db: Session, data: dict):
        item = AuditLog(**data)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete(db: Session, item_id: str):
        item = db.query(AuditLog).filter(AuditLog.id == item_id).first()
        if item:
            db.delete(item)
            db.commit()
        return item
