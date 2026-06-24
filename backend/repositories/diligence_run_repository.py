from sqlalchemy.orm import Session
from db.models import DiligenceRunModel

class DiligenceRunRepository:
    @staticmethod
    def get(db: Session, item_id: str):
        return db.query(DiligenceRunModel).filter(DiligenceRunModel.id == item_id).first()

    @staticmethod
    def get_by_deal(db: Session, deal_id: int):
        return db.query(DiligenceRunModel).filter(DiligenceRunModel.deal_id == deal_id).all()

    @staticmethod
    def create(db: Session, data: dict):
        item = DiligenceRunModel(**data)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete(db: Session, item_id: str):
        item = db.query(DiligenceRunModel).filter(DiligenceRunModel.id == item_id).first()
        if item:
            db.delete(item)
            db.commit()
        return item
