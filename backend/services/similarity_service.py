import json
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from db.models import Decision, DecisionSubject

class SimilarityService:
    @staticmethod
    def get_similar_decisions(db: Session, decision_id: int) -> List[Dict[str, Any]]:
        """
        Retrieves similar historical decisions.
        In a production environment, this would use vector embeddings of the decision
        context and objectives to perform a semantic search.
        For Phase 4 demo purposes, we will mock this using the domain pack and status filtering.
        """
        current_decision = db.query(Decision).filter(Decision.id == decision_id).first()
        if not current_decision:
            return []
            
        # Mock retrieval: Find other decisions in the same domain that are completed
        similar = db.query(Decision).filter(
            Decision.domain_pack_id == current_decision.domain_pack_id,
            Decision.status == "Completed",
            Decision.id != decision_id
        ).all()
        
        results = []
        for d in similar:
            subj = db.query(DecisionSubject).filter(DecisionSubject.id == d.subject_id).first()
            results.append({
                "decision_id": d.id,
                "title": d.title,
                "similarity_score": 0.85, # Mocked
                "reason": f"Both decisions involve {d.domain_pack_id} evaluation.",
                "subject_name": subj.name if subj else "Unknown",
                "status": d.status
            })
            
        return results
