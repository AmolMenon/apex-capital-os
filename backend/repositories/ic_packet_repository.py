from sqlalchemy.orm import Session
from db.models import ICPacket

class ICPacketRepository:
    @staticmethod
    def get(db: Session, item_id: str):
        return db.query(ICPacket).filter(ICPacket.id == item_id).first()

    @staticmethod
    def get_by_deal(db: Session, deal_id: int):
        return db.query(ICPacket).filter(ICPacket.deal_id == deal_id).all()

    @staticmethod
    def create(db: Session, data: dict):
        item = ICPacket(**data)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete(db: Session, item_id: str):
        item = db.query(ICPacket).filter(ICPacket.id == item_id).first()
        if item:
            db.delete(item)
            db.commit()
        return item
