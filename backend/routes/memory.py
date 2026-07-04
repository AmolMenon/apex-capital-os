from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.memory_service import MemoryService
from services.graph_service import GraphService
from services.similarity_service import SimilarityService
from services.calibration_service import CalibrationService
from db.models import Assumption, Prediction, Pattern

router = APIRouter(prefix="/memory", tags=["Memory"])

@router.get("/stats")
def get_memory_stats(db: Session = Depends(get_db)):
    return MemoryService.get_organization_memory_stats(db)

@router.get("/graph/{decision_id}")
def get_decision_graph(decision_id: int, db: Session = Depends(get_db)):
    return GraphService.get_decision_graph(db, decision_id)

@router.get("/similar/{decision_id}")
def get_similar_decisions(decision_id: int, db: Session = Depends(get_db)):
    return SimilarityService.get_similar_decisions(db, decision_id)

@router.get("/calibration/{agent_id}")
def get_agent_calibration(agent_id: str, db: Session = Depends(get_db)):
    return CalibrationService.get_agent_calibration(db, agent_id)

@router.get("/assumptions")
def get_assumptions(db: Session = Depends(get_db)):
    assumptions = db.query(Assumption).all()
    return [{"id": a.id, "decision_id": a.decision_id, "category": a.category, "statement": a.statement, "confidence": a.confidence, "status": a.status, "accuracy": a.accuracy_score} for a in assumptions]

@router.get("/patterns")
def get_patterns(db: Session = Depends(get_db)):
    patterns = db.query(Pattern).all()
    return [{"id": p.id, "type": p.pattern_type, "statement": p.statement, "confidence": p.confidence} for p in patterns]

@router.get("/decisions")
def get_memory_decisions(db: Session = Depends(get_db)):
    from db.models import HumanDecisionRecord, Decision, DecisionSubject
    records = db.query(HumanDecisionRecord).order_by(HumanDecisionRecord.created_at.desc()).all()
    result = []
    for r in records:
        decision = db.query(Decision).filter(Decision.id == r.decision_id).first()
        subject_name = "Unknown"
        if decision:
            subject = db.query(DecisionSubject).filter(DecisionSubject.id == decision.subject_id).first()
            if subject:
                subject_name = subject.name
                
        result.append({
            "id": r.id,
            "decision_id": r.decision_id,
            "company": subject_name,
            "ai_recommendation": r.ai_recommendation,
            "human_final_decision": r.human_final_decision,
            "human_rationale": r.human_rationale,
            "override_reason": r.override_reason,
            "conditions_json": r.conditions_json,
            "created_at": r.created_at
        })
    return result
