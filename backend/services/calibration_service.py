from sqlalchemy.orm import Session
from typing import Dict, Any, List
from db.models import Prediction

class CalibrationService:
    @staticmethod
    def get_agent_calibration(db: Session, agent_id: str) -> Dict[str, Any]:
        """
        Calculates how accurate a specific agent's predictions have been historically.
        """
        predictions = db.query(Prediction).filter(
            Prediction.agent_id == agent_id,
            Prediction.actual_result.isnot(None)
        ).all()
        
        if not predictions:
            return {"agent_id": agent_id, "score": 0, "status": "Not Enough Data"}
            
        total_error = sum([p.error_magnitude for p in predictions if p.error_magnitude is not None])
        avg_error = total_error / len(predictions)
        
        # Simple calibration score: 100 - (avg_error * 100)
        score = max(0, 100 - (avg_error * 100))
        
        return {
            "agent_id": agent_id,
            "predictions_evaluated": len(predictions),
            "average_error_magnitude": round(avg_error, 2),
            "calibration_score": round(score, 1)
        }
