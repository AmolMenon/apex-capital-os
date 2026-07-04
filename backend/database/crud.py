import db.models as db_models
from sqlalchemy.orm import Session
import json

def get_decision(db: Session, decision_id: int):
    return db.query(db_models.Decision).filter(db_models.Decision.id == decision_id).first()

def get_decisions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(db_models.Decision).offset(skip).limit(limit).all()

def create_decision(db: Session, decision_data: dict):
    db_decision = db_models.Decision(**decision_data)
    db.add(db_decision)
    db.commit()
    db.refresh(db_decision)
    return db_decision

def update_decision_status(db: Session, decision_id: int, status: str):
    db_decision = db.query(db_models.Decision).filter(db_models.Decision.id == decision_id).first()
    if db_decision:
        db_decision.status = status
        db.commit()
        db.refresh(db_decision)
    return db_decision

def get_decision_subject(db: Session, subject_id: int):
    return db.query(db_models.DecisionSubject).filter(db_models.DecisionSubject.id == subject_id).first()

def get_domain_pack(db: Session, domain_pack_id: str):
    return db.query(db_models.DomainPack).filter(db_models.DomainPack.id == domain_pack_id).first()

def get_reasoning_agents(db: Session, domain_pack_id: str):
    return db.query(db_models.ReasoningAgent).filter(db_models.ReasoningAgent.domain_pack_id == domain_pack_id).all()

def get_decision_framework(db: Session, domain_pack_id: str):
    return db.query(db_models.DecisionFramework).filter(db_models.DecisionFramework.domain_pack_id == domain_pack_id).first()

def get_platform_sources(db: Session):
    return db.query(db_models.PlatformSourceModel).all()

def update_platform_source(db: Session, source_name: str, mode: str, is_enabled: bool):
    source = db.query(db_models.PlatformSourceModel).filter(db_models.PlatformSourceModel.name == source_name).first()
    if source:
        source.mode = mode
        source.is_enabled = is_enabled
        db.commit()
        db.refresh(source)
    else:
        import uuid
        source = db_models.PlatformSourceModel(
            id=str(uuid.uuid4()),
            name=source_name,
            mode=mode,
            is_enabled=is_enabled
        )
        db.add(source)
        db.commit()
        db.refresh(source)
    return source

def create_platform_diligence_run(db: Session, decision_id: int, run_id: str, config_json: str):
    db_run = db_models.PlatformDiligenceRunModel(
        id=run_id,
        decision_id=decision_id,
        status="running",
        config_json=config_json
    )
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    return db_run

def update_platform_diligence_run(db: Session, run_id: str, status: str, report_json: str):
    db_run = db.query(db_models.PlatformDiligenceRunModel).filter(db_models.PlatformDiligenceRunModel.id == run_id).first()
    if db_run:
        from datetime import datetime
        db_run.status = status
        db_run.report_json = report_json
        db_run.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(db_run)
    return db_run

def get_latest_platform_diligence_run(db: Session, decision_id: int):
    return db.query(db_models.PlatformDiligenceRunModel).filter(db_models.PlatformDiligenceRunModel.decision_id == decision_id).order_by(db_models.PlatformDiligenceRunModel.created_at.desc()).first()

def get_platform_signals(db: Session, decision_id: int, signal_type: str = None):
    query = db.query(db_models.PlatformSignalModel).filter(db_models.PlatformSignalModel.decision_id == decision_id)
    if signal_type:
        query = query.filter(db_models.PlatformSignalModel.signal_type == signal_type)
    return query.all()

def create_platform_signal(db: Session, signal_data: dict):
    db_signal = db_models.PlatformSignalModel(
        decision_id=signal_data.get("decision_id"),
        signal_type=signal_data.get("source", "Unknown"),
        content=signal_data.get("content", ""),
        metadata_json=json.dumps(signal_data)
    )
    db.add(db_signal)
    db.commit()
    db.refresh(db_signal)
    return db_signal
