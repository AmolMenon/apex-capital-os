import db.models as db_models
from sqlalchemy.orm import Session
from db.models import Deal, Analysis, ResearchBriefModel, DeckAnalysisModel, DiligencePlanModel, ICDecisionLogModel, FundFitAssessmentModel, DealWarRoomModel
import schemas.deal as schemas
import json

def get_deal(db: Session, deal_id: int):
    db_deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if db_deal and db_deal.analysis:
        try:
            # Parse the JSON string into the Pydantic schema structure
            analysis_dict = json.loads(db_deal.analysis.full_analysis_json)
            # Add back the ID since it might not be in the JSON
            analysis_dict['id'] = db_deal.analysis.id
            analysis_dict['created_at'] = db_deal.analysis.created_at
            
            # Use setattr to attach the parsed analysis dynamically to the deal object 
            # so Pydantic can read it, but this is a bit tricky with SQLAlchemy 
            # Instead, we will construct the schema at the router level, or modify the Deal model to return dict.
        except Exception:
            pass
    return db_deal

def get_deals(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Deal).offset(skip).limit(limit).all()

def create_deal(db: Session, deal: schemas.DealCreate):
    db_deal = Deal(**deal.model_dump())
    db.add(db_deal)
    db.commit()
    db.refresh(db_deal)
    return db_deal

def update_deal_status(db: Session, deal_id: int, status: str):
    db_deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if db_deal:
        db_deal.status = status
        db.commit()
        db.refresh(db_deal)
    return db_deal

def update_deal(db: Session, deal_id: int, deal_update: schemas.DealUpdate):
    db_deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if db_deal:
        update_data = deal_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_deal, key, value)
        db.commit()
        db.refresh(db_deal)
    return db_deal

def delete_deal(db: Session, deal_id: int):
    db_deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if db_deal:
        db.delete(db_deal)
        db.commit()
    return db_deal

def create_deal_analysis(db: Session, full_analysis_json: str, deal_id: int):
    db_analysis = Analysis(deal_id=deal_id, full_analysis_json=full_analysis_json)
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

def get_research_brief(db: Session, deal_id: int):
    return db.query(ResearchBriefModel).filter(ResearchBriefModel.deal_id == deal_id).first()

def create_research_brief(db: Session, deal_id: int, brief: dict):
    db_brief = get_research_brief(db, deal_id)
    if not db_brief:
        db_brief = ResearchBriefModel(deal_id=deal_id)
        db.add(db_brief)
    
    db_brief.market_research_json = json.dumps(brief.get("market_research", {}))
    db_brief.competitor_research_json = json.dumps(brief.get("competitor_research", {}))
    db_brief.customer_personas_json = json.dumps(brief.get("customer_personas", []))
    db_brief.pricing_research_json = json.dumps(brief.get("pricing_research", {}))
    db_brief.gtm_research_json = json.dumps(brief.get("gtm_research", {}))
    db_brief.tam_sam_som_json = json.dumps(brief.get("tam_sam_som", {}))
    db_brief.evidence_grade_json = json.dumps(brief.get("evidence_grade", {}))
    db_brief.source_registry_json = json.dumps(brief.get("source_registry", []))
    db_brief.research_gaps_json = json.dumps(brief.get("research_gaps", []))
    db_brief.source_confidence = brief.get("evidence_grade", {}).get("confidence_level", "Unknown")
    
    db.commit()
    db.refresh(db_brief)
    return db_brief

def get_deck_analysis(db: Session, deal_id: int):
    return db.query(DeckAnalysisModel).filter(DeckAnalysisModel.deal_id == deal_id).first()

def create_deck_analysis(db: Session, deal_id: int, analysis: dict):
    db_deck = get_deck_analysis(db, deal_id)
    if not db_deck:
        db_deck = DeckAnalysisModel(deal_id=deal_id)
        db.add(db_deck)
    
    db_deck.deck_name = analysis.get("deck_name", "")
    db_deck.file_type = "txt"
    db_deck.deck_summary = analysis.get("deck_summary", "")
    db_deck.deck_quality_score = analysis.get("deck_quality_score", 0)
    db_deck.investor_readiness_score = analysis.get("investor_readiness_score", 0)
    
    db_deck.extracted_sections_json = json.dumps([s.model_dump() if hasattr(s, "model_dump") else s for s in analysis.get("extracted_sections", [])])
    db_deck.key_claims_json = json.dumps([c.model_dump() if hasattr(c, "model_dump") else c for c in analysis.get("key_claims", [])])
    db_deck.financials_json = json.dumps(analysis.get("financials", {}).model_dump() if hasattr(analysis.get("financials", {}), "model_dump") else analysis.get("financials", {}))
    db_deck.traction_json = json.dumps(analysis.get("traction", {}).model_dump() if hasattr(analysis.get("traction", {}), "model_dump") else analysis.get("traction", {}))
    db_deck.risks_json = json.dumps([r.model_dump() if hasattr(r, "model_dump") else r for r in analysis.get("risks", [])])
    db_deck.missing_sections_json = json.dumps([m.model_dump() if hasattr(m, "model_dump") else m for m in analysis.get("missing_sections", [])])
    
    db_deck.deck_quality_json = json.dumps(analysis.get("quality_breakdown", {}).model_dump() if hasattr(analysis.get("quality_breakdown", {}), "model_dump") else analysis.get("quality_breakdown", {}))
    db_deck.readiness_breakdown_json = json.dumps(analysis.get("readiness_breakdown", {}).model_dump() if hasattr(analysis.get("readiness_breakdown", {}), "model_dump") else analysis.get("readiness_breakdown", {}))
    db_deck.recommended_follow_up_questions_json = json.dumps(analysis.get("recommended_follow_up_questions", []))
    
    db.commit()
    db.refresh(db_deck)
    return db_deck

def get_diligence_plan(db: Session, deal_id: int):
    return db.query(DiligencePlanModel).filter(DiligencePlanModel.deal_id == deal_id).first()

def create_diligence_plan(db: Session, deal_id: int, plan: dict):
    db_plan = get_diligence_plan(db, deal_id)
    if not db_plan:
        db_plan = DiligencePlanModel(deal_id=deal_id)
        db.add(db_plan)
        
    db_plan.ic_readiness_score = plan.get("ic_readiness_score", 0)
    db_plan.diligence_status = plan.get("diligence_status", "Not Started")
    db_plan.final_diligence_verdict = plan.get("final_diligence_verdict", "")
    
    db_plan.priority_tasks_json = json.dumps([t.model_dump() if hasattr(t, "model_dump") else t for t in plan.get("priority_tasks", [])])
    db_plan.claim_verifications_json = json.dumps([c.model_dump() if hasattr(c, "model_dump") else c for c in plan.get("claim_verifications", [])])
    db_plan.founder_followups_json = json.dumps([f.model_dump() if hasattr(f, "model_dump") else f for f in plan.get("founder_followups", [])])
    db_plan.customer_reference_questions_json = json.dumps([c.model_dump() if hasattr(c, "model_dump") else c for c in plan.get("customer_reference_questions", [])])
    db_plan.data_room_requests_json = json.dumps([d.model_dump() if hasattr(d, "model_dump") else d for d in plan.get("data_room_requests", [])])
    db_plan.risk_resolution_plan_json = json.dumps([r.model_dump() if hasattr(r, "model_dump") else r for r in plan.get("risk_resolution_plan", [])])
    db_plan.evidence_items_json = json.dumps([e.model_dump() if hasattr(e, "model_dump") else e for e in plan.get("evidence_items", [])])
    
    db.commit()
    db.refresh(db_plan)
    return db_plan

def create_ic_decision_log(db: Session, deal_id: int, decision: str, rationale: str, conditions: str = None, concerns: str = None, next_step: str = None):
    log = ICDecisionLogModel(
        deal_id=deal_id,
        decision=decision,
        decision_rationale=rationale,
        conditions=conditions,
        partner_concerns=concerns,
        next_step=next_step
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

def get_fund_fit_assessment(db: Session, deal_id: int):
    return db.query(FundFitAssessmentModel).filter(FundFitAssessmentModel.deal_id == deal_id).first()

def create_fund_fit_assessment(db: Session, deal_id: int, assessment: dict):
    db_assessment = get_fund_fit_assessment(db, deal_id)
    if not db_assessment:
        db_assessment = FundFitAssessmentModel(deal_id=deal_id)
        db.add(db_assessment)
        
    db_assessment.fund_size = assessment.get("fund_size", 0)
    db_assessment.initial_check_size = assessment.get("initial_check_size", 0)
    db_assessment.target_ownership = assessment.get("target_ownership", 0.0)
    db_assessment.required_exit_value_for_1x_fund = assessment.get("required_exit_value_for_1x_fund", 0)
    db_assessment.fund_return_potential = assessment.get("fund_return_potential", "")
    db_assessment.thesis_fit_score = assessment.get("thesis_fit_score", 0)
    db_assessment.portfolio_concentration_risk = assessment.get("portfolio_concentration_risk", "")
    db_assessment.recommendation = assessment.get("recommendation", "")
    
    db_assessment.key_constraints_json = json.dumps(assessment.get("key_constraints", []))
    
    # Store nested Pydantic models as JSON
    def dump_model(obj):
        return obj.model_dump() if hasattr(obj, "model_dump") else obj
        
    db_assessment.thesis_fit_json = json.dumps(dump_model(assessment.get("thesis_fit", {})))
    db_assessment.ownership_scenarios_json = json.dumps(dump_model(assessment.get("ownership_scenarios", {})))
    db_assessment.reserve_strategy_json = json.dumps(dump_model(assessment.get("reserve_strategy", {})))
    db_assessment.power_law_simulation_json = json.dumps(dump_model(assessment.get("power_law_simulation", {})))
    
    db.commit()
    db.refresh(db_assessment)
    return db_assessment

def get_war_room(db: Session, deal_id: int):
    return db.query(DealWarRoomModel).filter(DealWarRoomModel.deal_id == deal_id).first()

def create_war_room(db: Session, deal_id: int, war_room_data: dict):
    db_war_room = db.query(DealWarRoomModel).filter(DealWarRoomModel.deal_id == deal_id).first()
    if not db_war_room:
        db_war_room = DealWarRoomModel(deal_id=deal_id)
        db.add(db_war_room)
    
    db_war_room.company_name = war_room_data.get("company_name", "")
    db_war_room.war_room_status = war_room_data.get("war_room_status", "draft")
    
    import json
    def dump_model(obj):
        if hasattr(obj, "dict"): return json.dumps(obj.dict())
        if isinstance(obj, dict): return json.dumps(obj)
        if isinstance(obj, list): return json.dumps([o.dict() if hasattr(o, "dict") else o for o in obj])
        return json.dumps(obj)
        
    if "thesis" in war_room_data: db_war_room.thesis_json = dump_model(war_room_data["thesis"])
    if "anti_thesis" in war_room_data: db_war_room.anti_thesis_json = dump_model(war_room_data["anti_thesis"])
    if "what_must_be_true" in war_room_data: db_war_room.what_must_be_true_json = dump_model(war_room_data["what_must_be_true"])
    if "partner_personas" in war_room_data: db_war_room.partner_personas_json = dump_model(war_room_data["partner_personas"])
    if "partner_questions" in war_room_data: db_war_room.partner_questions_json = dump_model(war_room_data["partner_questions"])
    if "ic_simulation" in war_room_data: db_war_room.ic_simulation_json = dump_model(war_room_data["ic_simulation"])
    if "conviction_score" in war_room_data: db_war_room.conviction_score_json = dump_model(war_room_data["conviction_score"])
    if "conviction_deltas" in war_room_data: db_war_room.conviction_deltas_json = dump_model(war_room_data["conviction_deltas"])
    if "valuation_sensitivity" in war_room_data: db_war_room.valuation_sensitivity_json = dump_model(war_room_data["valuation_sensitivity"])
    if "ownership_scenarios" in war_room_data: db_war_room.ownership_scenarios_json = dump_model(war_room_data["ownership_scenarios"])
    if "fund_return_scenarios" in war_room_data: db_war_room.fund_return_scenarios_json = dump_model(war_room_data["fund_return_scenarios"])
    if "change_our_mind" in war_room_data: db_war_room.change_our_mind_json = dump_model(war_room_data["change_our_mind"])
    if "decision_gates" in war_room_data: db_war_room.decision_gates_json = dump_model(war_room_data["decision_gates"])
    if "final_recommendation" in war_room_data: db_war_room.final_recommendation_json = dump_model(war_room_data["final_recommendation"])
    if "metadata" in war_room_data: db_war_room.metadata_json = dump_model(war_room_data["metadata"])
    
    db.commit()
    db.refresh(db_war_room)
    return db_war_room

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

def create_platform_diligence_run(db: Session, deal_id: int, run_id: str, config_json: str):
    db_run = db_models.PlatformDiligenceRunModel(
        id=run_id,
        deal_id=deal_id,
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

def get_platform_diligence_runs(db: Session, deal_id: int):
    return db.query(db_models.PlatformDiligenceRunModel).filter(db_models.PlatformDiligenceRunModel.deal_id == deal_id).order_by(db_models.PlatformDiligenceRunModel.created_at.desc()).all()

def get_latest_platform_diligence_run(db: Session, deal_id: int):
    return db.query(db_models.PlatformDiligenceRunModel).filter(db_models.PlatformDiligenceRunModel.deal_id == deal_id).order_by(db_models.PlatformDiligenceRunModel.created_at.desc()).first()

def get_platform_diligence_run(db: Session, run_id: str):
    return db.query(db_models.PlatformDiligenceRunModel).filter(db_models.PlatformDiligenceRunModel.id == run_id).first()

def create_platform_signal(db: Session, signal_data: dict):
    db_signal = db_models.PlatformSignalModel(**signal_data)
    db.add(db_signal)
    db.commit()
    db.refresh(db_signal)
    return db_signal

def get_platform_signals(db: Session, deal_id: int, signal_type: str = None):
    query = db.query(db_models.PlatformSignalModel).filter(db_models.PlatformSignalModel.deal_id == deal_id)
    if signal_type:
        query = query.filter(db_models.PlatformSignalModel.signal_type == signal_type)
    return query.all()
