from sqlalchemy.orm import Session
from db.models import DiligenceRunModel, DiligenceRunStepModel
import json

class DiligenceRunHistoryEngine:
    @staticmethod
    def get_runs(db: Session, deal_id: int):
        runs = db.query(DiligenceRunModel).filter(DiligenceRunModel.deal_id == deal_id).order_by(DiligenceRunModel.started_at.desc()).all()
        return runs
        
    @staticmethod
    def get_run(db: Session, deal_id: int, run_id: str):
        return db.query(DiligenceRunModel).filter(DiligenceRunModel.id == run_id, DiligenceRunModel.deal_id == deal_id).first()
        
    @staticmethod
    def get_run_steps(db: Session, run_id: str):
        return db.query(DiligenceRunStepModel).filter(DiligenceRunStepModel.run_id == run_id).order_by(DiligenceRunStepModel.id.asc()).all()
