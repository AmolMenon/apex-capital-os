from sqlalchemy.orm import Session
from typing import Dict, Any, List
from db.models import Assumption, Pattern

class MemoryService:
    @staticmethod
    def get_organization_memory_stats(db: Session) -> Dict[str, Any]:
        """
        Calculates organization-wide learning stats.
        """
        total_assumptions = db.query(Assumption).count()
        validated_assumptions = db.query(Assumption).filter(Assumption.status == "Verified").count()
        invalidated_assumptions = db.query(Assumption).filter(Assumption.status == "Invalidated").count()
        
        accuracy = 0
        if (validated_assumptions + invalidated_assumptions) > 0:
            accuracy = validated_assumptions / (validated_assumptions + invalidated_assumptions) * 100
            
        total_patterns = db.query(Pattern).count()
        
        return {
            "total_assumptions_tracked": total_assumptions,
            "assumption_accuracy_percent": round(accuracy, 1),
            "patterns_discovered": total_patterns,
            "learning_velocity": "+12% this month" # Mocked trend
        }
