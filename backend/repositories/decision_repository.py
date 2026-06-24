from sqlalchemy.orm import Session
from db.models import DecisionOutput

class DecisionRepository:
    @staticmethod
    def get(db: Session, item_id: str):
        return db.query(DecisionOutput).filter(DecisionOutput.id == item_id).first()

    @staticmethod
    def get_by_deal(db: Session, deal_id: int):
        return db.query(DecisionOutput).filter(DecisionOutput.deal_id == deal_id).all()

    @staticmethod
    def create(db: Session, data: dict):
        item = DecisionOutput(**data)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete(db: Session, item_id: str):
        item = db.query(DecisionOutput).filter(DecisionOutput.id == item_id).first()
        if item:
            db.delete(item)
            db.commit()
        return item
