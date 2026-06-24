from sqlalchemy.orm import Session
from db.models import Deal

class DealRepository:
    @staticmethod
    def get_deal(db: Session, deal_id: int):
        return db.query(Deal).filter(Deal.id == deal_id).first()

    @staticmethod
    def get_deals(db: Session, skip: int = 0, limit: int = 100, include_archived: bool = False):
        query = db.query(Deal)
        if not include_archived:
            query = query.filter(Deal.is_archived == False)
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def create_deal(db: Session, deal_data: dict):
        deal = Deal(**deal_data)
        db.add(deal)
        db.commit()
        db.refresh(deal)
        return deal

    @staticmethod
    def update_deal(db: Session, deal_id: int, update_data: dict):
        deal = db.query(Deal).filter(Deal.id == deal_id).first()
        if deal:
            for key, value in update_data.items():
                setattr(deal, key, value)
            db.commit()
            db.refresh(deal)
        return deal

    @staticmethod
    def archive_deal(db: Session, deal_id: int):
        deal = db.query(Deal).filter(Deal.id == deal_id).first()
        if deal:
            deal.is_archived = True
            db.commit()
            db.refresh(deal)
        return deal

    @staticmethod
    def restore_deal(db: Session, deal_id: int):
        deal = db.query(Deal).filter(Deal.id == deal_id).first()
        if deal:
            deal.is_archived = False
            db.commit()
            db.refresh(deal)
        return deal
