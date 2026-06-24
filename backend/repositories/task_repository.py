from sqlalchemy.orm import Session
from db.models import OperationTask

class TaskRepository:
    @staticmethod
    def get(db: Session, item_id: str):
        return db.query(OperationTask).filter(OperationTask.id == item_id).first()

    @staticmethod
    def get_by_deal(db: Session, deal_id: int):
        return db.query(OperationTask).filter(OperationTask.deal_id == deal_id).all()

    @staticmethod
    def create(db: Session, data: dict):
        item = OperationTask(**data)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete(db: Session, item_id: str):
        item = db.query(OperationTask).filter(OperationTask.id == item_id).first()
        if item:
            db.delete(item)
            db.commit()
        return item
