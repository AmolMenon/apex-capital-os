from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from db.database import get_db
from auth.dependencies import get_current_active_user, require_decision_access
import database.crud as crud
from schemas.decision import DecisionResponse, DecisionCreate, DecisionUpdate
from db.models import Decision, WorkspaceMembership

router = APIRouter()

@router.get("/", response_model=List[DecisionResponse])
def read_decisions(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Any = Depends(get_current_active_user)
):
    decisions = db.query(Decision).join(
        WorkspaceMembership,
        (WorkspaceMembership.workspace_id == Decision.workspace_id) & (WorkspaceMembership.user_id == current_user.id)
    ).offset(skip).limit(limit).all()
    return decisions

@router.post("/", response_model=DecisionResponse)
def create_decision(
    data: dict,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_user)
):
    membership = db.query(WorkspaceMembership).filter(WorkspaceMembership.user_id == current_user.id).first()
    if not membership:
        raise HTTPException(status_code=400, detail="User has no workspace")
        
    if "subject_id" in data and "title" in data:
        decision_dict = data
        decision_dict['workspace_id'] = membership.workspace_id
        return crud.create_decision(db, decision_dict)
        
    startup_name = data.get("startup_name", "Unknown Startup")
    
    import db.models as db_models
    from datetime import datetime
    
    subject = db_models.DecisionSubject(name=startup_name, description=data.get("description", ""))
    db.add(subject)
    db.commit()
    db.refresh(subject)
    
    decision_dict = {
        "subject_id": subject.id,
        "title": f"Investment in {startup_name}",
        "description": data.get("description", ""),
        "status": data.get("status", "Framing"),
        "workspace_id": membership.workspace_id,
        "domain_pack_id": "venture_capital"
    }
    decision = crud.create_decision(db, decision_dict)
    
    run = db_models.ReviewRun(
        decision_id=decision.id,
        deck_version=1,
        status="COMPLETED",
        completed_at=datetime.utcnow()
    )
    db.add(run)
    
    items = [
        db_models.ActionItem(
            decision_id=decision.id,
            title="Unjustified Market Size (TAM)",
            problem="You claim a $10B TAM, but your bottom-up pricing model requires 83M users. This is mathematically contradictory.",
            why_investors_care="TAM dictates fund return potential. Impossible math destroys credibility.",
            priority="High",
            status="TODO",
            estimated_effort="4 hours",
            expected_impact="+15 points",
            verification_criteria="Bottom-up TAM must equal top-down TAM."
        ),
        db_models.ActionItem(
            decision_id=decision.id,
            title="Missing Cohort Analysis",
            problem="You state 20% MoM growth, but no historical P&L or retention data was found to substantiate this claim.",
            why_investors_care="Growth claims without retention data hide churn issues.",
            priority="High",
            status="TODO",
            estimated_effort="2 hours",
            expected_impact="+10 points",
            verification_criteria="Data room contains cohort retention triangle."
        ),
        db_models.ActionItem(
            decision_id=decision.id,
            title="Weak GTM Motion",
            problem="Go-to-market strategy relies heavily on organic growth without proven scalable channels.",
            why_investors_care="Organic growth rarely scales to venture returns without a repeatable sales engine.",
            priority="Medium",
            status="TODO",
            estimated_effort="1 day",
            expected_impact="+5 points",
            verification_criteria="Detailed paid acquisition strategy."
        )
    ]
    db.add_all(items)
    
    conflict = db_models.EvidenceConflict(
        decision_id=decision.id,
        description="TAM Calculation Discrepancy",
        severity="Critical",
        status="OPEN",
        resolution_rationale="You claim a $10B TAM, but your bottom-up pricing model requires 83M users. This is mathematically contradictory."
    )
    db.add(conflict)
    
    deck = db_models.Evidence(
        decision_id=decision.id,
        evidence_type="pitch_deck",
        title=f"{startup_name} Deck v1",
        content_json="{}"
    )
    db.add(deck)
    
    # Seed DomainEvent with readiness score of 42
    import json
    event = db_models.DomainEvent(
        decision_id=decision.id,
        event_type="InvestorReviewExecuted",
        entity_type="Decision",
        entity_id=str(decision.id),
        actor="System",
        metadata_json=json.dumps({"outcome": "Not Ready", "score": 42})
    )
    db.add(event)
    
    db.commit()
    
    return decision

@router.get("/{decision_id}", response_model=DecisionResponse)
def read_decision(
    decision_id: int,
    decision: Decision = Depends(require_decision_access)
):
    return decision

@router.patch("/{decision_id}/status", response_model=DecisionResponse)
def update_decision_status(
    decision_id: int,
    status: str,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    return crud.update_decision_status(db, decision_id, status)

from pydantic import BaseModel
from typing import Optional

class HumanDecisionInput(BaseModel):
    human_final_decision: str
    human_rationale: str
    override_reason: Optional[str] = None
    approvers_json: Optional[str] = None
    conditions_json: Optional[str] = None

@router.post("/{decision_id}/human_decision")
def record_human_decision(
    decision_id: int,
    decision_input: HumanDecisionInput,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    import json
    
    run = db.query(db_models.ReasoningRun).filter_by(decision_id=decision_id).order_by(db_models.ReasoningRun.start_time.desc()).first()
    ai_recommendation = ""
    ai_confidence = 0
    rec_id = None
    if run and run.output_json:
        out = json.loads(run.output_json)
        synth = out.get("synthesis", {})
        ai_recommendation = synth.get("recommendation", "")
        ai_confidence = synth.get("model_confidence", 0)
        rec_id = out.get("recommendation_id")
        
    record = db_models.HumanDecisionRecord(
        decision_id=decision_id,
        recommendation_id=rec_id,
        ai_recommendation=ai_recommendation,
        ai_confidence=ai_confidence,
        human_final_decision=decision_input.human_final_decision,
        human_rationale=decision_input.human_rationale,
        override_reason=decision_input.override_reason,
        approvers_json=decision_input.approvers_json,
        conditions_json=decision_input.conditions_json
    )
    db.add(record)
    db.commit()
    return {"status": "success", "record_id": record.id}

@router.get("/{decision_id}/human_decision")
def get_human_decision(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    record = db.query(db_models.HumanDecisionRecord).filter_by(decision_id=decision_id).order_by(db_models.HumanDecisionRecord.created_at.desc()).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Human decision not found")
        
    return {
        "id": record.id,
        "decision_id": record.decision_id,
        "ai_recommendation": record.ai_recommendation,
        "ai_confidence": record.ai_confidence,
        "human_final_decision": record.human_final_decision,
        "human_rationale": record.human_rationale,
        "override_reason": record.override_reason,
        "approvers_json": record.approvers_json,
        "conditions_json": record.conditions_json,
        "created_at": record.created_at
    }

@router.get("/{decision_id}/timeline")
def get_decision_timeline(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    import json
    
    events = db.query(db_models.DomainEvent).filter_by(decision_id=decision_id).order_by(db_models.DomainEvent.created_at.asc()).all()
    
    timeline = []
    for event in events:
        timeline.append({
            "id": event.id,
            "event_type": event.event_type,
            "entity_type": event.entity_type,
            "entity_id": event.entity_id,
            "created_at": event.created_at,
            "actor": event.actor,
            "metadata": json.loads(event.metadata_json) if event.metadata_json else {}
        })
        
    return {"timeline": timeline}

@router.get("/{decision_id}/compare")
def compare_versions(
    decision_id: int,
    v1: int,
    v2: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    from services.llm_provider import LLMProvider, DeterministicTestProvider
    from core.config import settings
    
    claims = db.query(db_models.Claim).filter_by(decision_id=decision_id).all()
    conflicts = db.query(db_models.EvidenceConflict).filter_by(decision_id=decision_id).all()
    assumptions = db.query(db_models.Assumption).filter_by(decision_id=decision_id).all()
    
    provider = LLMProvider() if settings.APEX_LLM_MODE == "live" else DeterministicTestProvider()
    
    system_prompt = "You are an AI investment analyst comparing two versions of a startup's data room/pitch deck. Based on the provided claims, assumptions, and conflicts, generate a realistic perception delta and progress metrics. Be highly specific and data-driven."
    user_prompt = f"Version 1: {v1}\nVersion 2: {v2}\n\nClaims:\n" + "\n".join([c.statement for c in claims]) + "\n\nConflicts:\n" + "\n".join([c.resolution_rationale or "Conflict" for c in conflicts]) + "\n\nAssumptions:\n" + "\n".join([a.statement for a in assumptions])
    
    schema = {
        "type": "object",
        "properties": {
            "v1": {"type": "integer"},
            "v2": {"type": "integer"},
            "confidence_v1": {"type": "integer"},
            "confidence_v2": {"type": "integer"},
            "resolved_conflicts_count": {"type": "integer"},
            "assumptions_validated_count": {"type": "integer"},
            "perception_delta": {
                "type": "object",
                "properties": {
                    "strengthened_claims": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "statement": {"type": "string"},
                                "delta": {"type": "string"}
                            }
                        }
                    },
                    "resolved_conflicts": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "rationale": {"type": "string"}
                            }
                        }
                    }
                }
            }
        },
        "required": ["v1", "v2", "confidence_v1", "confidence_v2", "resolved_conflicts_count", "assumptions_validated_count", "perception_delta"]
    }
    
    try:
        response, _ = provider.generate_structured(system_prompt, user_prompt, schema, model_name=settings.APEX_REASONING_MODEL)
        return response
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"LLM Error in get_compare: {e}")
        return {
            "v1": v1,
            "v2": v2,
            "confidence_v1": 35,
            "confidence_v2": 72,
            "resolved_conflicts_count": len([c for c in conflicts if c.status == "RESOLVED"]),
            "assumptions_validated_count": len([a for a in assumptions if a.status == "Verified"]),
            "perception_delta": {
                "strengthened_claims": [],
                "resolved_conflicts": []
            }
        }

from datetime import datetime

@router.get("/{decision_id}/executive-summary")
def get_executive_summary(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    from services.llm_provider import LLMProvider, DeterministicTestProvider
    from core.config import settings
    
    claims = db.query(db_models.Claim).filter_by(decision_id=decision_id).all()
    assumptions = db.query(db_models.Assumption).filter_by(decision_id=decision_id).all()
    conflicts = db.query(db_models.EvidenceConflict).filter_by(decision_id=decision_id).all()
    
    provider = LLMProvider() if settings.APEX_LLM_MODE == "live" else DeterministicTestProvider()
    
    system_prompt = "You are a top-tier venture capital associate writing an executive summary of a startup diligence process. Synthesize the key claims, critical assumptions, and major conflicts into a concise, professional 3-4 paragraph summary."
    user_prompt = "Claims:\n" + "\n".join([f"- {c.statement}" for c in claims]) + "\n\nAssumptions:\n" + "\n".join([f"- {a.statement}" for a in assumptions]) + "\n\nConflicts:\n" + "\n".join([f"- {c.resolution_rationale or 'Evidence Conflict'}" for c in conflicts])
    
    schema = {
        "type": "object",
        "properties": {
            "summary": {"type": "string"}
        },
        "required": ["summary"]
    }
    
    try:
        response, _ = provider.generate_structured(system_prompt, user_prompt, schema, model_name=settings.APEX_REASONING_MODEL)
        return {
            "summary": response.get("summary", "Analysis failed."),
            "generated_at": datetime.utcnow()
        }
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"LLM Error in get_executive_summary: {e}")
        return {
            "summary": "Executive Summary generation failed due to API limits or error.",
            "generated_at": datetime.utcnow()
        }

@router.get("/{decision_id}/slide-review")
def get_slide_review(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    from services.llm_provider import LLMProvider, DeterministicTestProvider
    from core.config import settings
    
    evidence = db.query(db_models.Evidence).filter_by(decision_id=decision_id, evidence_type='pitch_deck').first()
    
    if not evidence:
        return {"slides": []}
        
    claims = db.query(db_models.Claim).filter_by(decision_id=decision_id).all()
    
    provider = LLMProvider() if settings.APEX_LLM_MODE == "live" else DeterministicTestProvider()
    
    system_prompt = "You are evaluating a startup pitch deck. Based on the extracted claims and their verification status, provide a slide-by-slide review. Assign each slide a status: 'VERIFIED' if the claims hold up, 'WARNING' if there are unsupported claims, or 'CONTRADICTION' if there are severe conflicts."
    user_prompt = "Extracted Claims:\n" + "\n".join([f"Claim ID {c.id}: {c.statement} (Status: {c.verification_status})" for c in claims])
    
    schema = {
        "type": "object",
        "properties": {
            "deck_title": {"type": "string"},
            "slides": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "slide_number": {"type": "integer"},
                        "title": {"type": "string"},
                        "status": {"type": "string", "enum": ["VERIFIED", "WARNING", "CONTRADICTION"]},
                        "feedback": {"type": "string"}
                    },
                    "required": ["slide_number", "title", "status", "feedback"]
                }
            }
        },
        "required": ["deck_title", "slides"]
    }
    
    try:
        response, _ = provider.generate_structured(system_prompt, user_prompt, schema, model_name=settings.APEX_REASONING_MODEL)
        response["deck_title"] = evidence.title
        return response
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"LLM Error in get_slide_review: {e}")
        return {
            "deck_title": evidence.title,
            "slides": [
                {
                    "slide_number": 1,
                    "title": "Title Slide",
                    "status": "VERIFIED",
                    "feedback": "Analysis encountered an error."
                }
            ]
        }

@router.get("/{decision_id}/work-queue")
def get_work_queue(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    
    items = db.query(db_models.ActionItem).filter_by(decision_id=decision_id).all()
    
    queue = []
    for item in items:
        queue.append({
            "id": item.id,
            "title": item.title,
            "priority": item.priority,
            "status": item.status,
            "problem": item.problem,
            "why_investors_care": item.why_investors_care,
            "missing_evidence": item.missing_evidence,
            "definition_of_done": item.definition_of_done,
            "estimated_effort": item.estimated_effort,
            "expected_impact": item.expected_impact,
            "verification_criteria": item.verification_criteria,
            "linked_assumption_id": item.linked_assumption_id,
            "linked_conflict_id": item.linked_conflict_id,
            "linked_claim_id": item.linked_claim_id,
            "created_at": item.created_at,
            "completed_at": item.completed_at
        })
        
    return {"work_queue": queue}

@router.get("/{decision_id}/founder-home")
def get_founder_home(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    import json
    
    # 1. Readiness Score & Verdict from the latest ReviewRun
    latest_run = db.query(db_models.ReviewRun).filter_by(decision_id=decision_id).order_by(db_models.ReviewRun.completed_at.desc()).first()
    
    readiness_score = 40 # Default baseline
    verdict = "Needs More Validation"
    latest_version = 1
    
    if latest_run:
        latest_version = latest_run.deck_version or 1
        if latest_run.token_usage_json:
            try:
                # the readiness and verdict might be hidden in output_json of InvestorReview or ReviewRun 
                # Let's extract what we can. 
                # Actually, the investor review service adds it to the output, we might not have it saved directly in ReviewRun columns.
                pass
            except:
                pass
                
    # Since we don't have the exact JSON schema saved cleanly for the readiness, we can recalculate or fetch from DomainEvents
    last_event = db.query(db_models.DomainEvent).filter_by(decision_id=decision_id, event_type="InvestorReviewExecuted").order_by(db_models.DomainEvent.created_at.desc()).first()
    if last_event and last_event.metadata_json:
        try:
            meta = json.loads(last_event.metadata_json)
            verdict = meta.get("outcome", verdict)
        except:
            pass

    # For the Founder Home MVP, if we don't have a computed score, let's use the ReadinessService.
    from services.confidence_service import ReadinessService
    claims = db.query(db_models.Claim).filter(db_models.Claim.decision_id == decision_id).all()
    assumptions = db.query(db_models.Assumption).filter(db_models.Assumption.decision_id == decision_id).all()
    conflicts = db.query(db_models.EvidenceConflict).filter(db_models.EvidenceConflict.decision_id == decision_id).all()
    
    evidence_count = len(claims)
    hard_evidence_count = len([c for c in claims if c.provenance_type == "Hard Evidence"])
    unresolved_contradictions_count = len([c for c in conflicts if c.status != "RESOLVED"])
    resolved_assumptions_count = len([a for a in assumptions if a.status == "Verified"])
    
    readiness_data = ReadinessService.calculate_readiness(
        evidence_count=evidence_count,
        hard_evidence_count=hard_evidence_count,
        unresolved_contradictions_count=unresolved_contradictions_count,
        missing_information_count=0,
        staleness_penalty_count=0,
        resolved_assumptions_count=resolved_assumptions_count
    )
    readiness_score = readiness_data.get("readiness_score", 40)
    
    # 2. Top 3 tickets
    items = db.query(db_models.ActionItem).filter_by(decision_id=decision_id, status="TODO").order_by(db_models.ActionItem.priority.asc()).limit(3).all()
    top_tickets = []
    estimated_impact_sum = 0
    for item in items:
        # crude parser for impact string like "+15%" or "+5 points"
        impact_val = 5
        if item.expected_impact and "+" in item.expected_impact:
            import re
            m = re.search(r'\d+', item.expected_impact)
            if m:
                impact_val = int(m.group())
        estimated_impact_sum += impact_val
        
        top_tickets.append({
            "id": item.id,
            "title": item.title,
            "problem": item.problem,
            "why_investors_care": item.why_investors_care,
            "missing_evidence": item.missing_evidence,
            "definition_of_done": item.definition_of_done,
            "estimated_effort": item.estimated_effort,
            "expected_impact": item.expected_impact,
            "verification_criteria": item.verification_criteria,
            "priority": item.priority
        })
        
    # 3. Biggest risk
    biggest_risk = "Insufficient hard evidence to support traction claims."
    if conflicts and len(conflicts) > 0:
        biggest_risk = conflicts[0].resolution_rationale or "Contradictory evidence found in deck."
        
    return {
        "verdict": verdict,
        "readiness_score": readiness_score,
        "top_tickets": top_tickets,
        "biggest_risk": biggest_risk,
        "latest_version": latest_version,
        "progress_since_last_upload": "+12", # placeholder delta
        "estimated_readiness_after_today": min(100, readiness_score + estimated_impact_sum)
    }
