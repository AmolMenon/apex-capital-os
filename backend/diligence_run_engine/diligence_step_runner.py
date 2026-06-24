from sqlalchemy.orm import Session
from datetime import datetime
from db.models import DiligenceRunStepModel
import json

class DiligenceStepRunner:
    @staticmethod
    def run_step(db: Session, run_id: str, step_id: str, step_name: str, func) -> dict:
        step = DiligenceRunStepModel(
            run_id=run_id,
            step_id=step_id,
            name=step_name,
            status="running",
            started_at=datetime.utcnow()
        )
        db.add(step)
        db.commit()
        db.refresh(step)
        
        try:
            outputs = func()
            step.status = "completed"
            step.outputs_json = json.dumps(outputs)
            step.completed_at = datetime.utcnow()
            db.commit()
            return outputs
        except Exception as e:
            step.status = "failed"
            step.errors_json = json.dumps([str(e)])
            step.completed_at = datetime.utcnow()
            db.commit()
            return {}
