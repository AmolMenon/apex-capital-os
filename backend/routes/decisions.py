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
    decision: DecisionCreate,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_user)
):
    membership = db.query(WorkspaceMembership).filter(WorkspaceMembership.user_id == current_user.id).first()
    if not membership:
        raise HTTPException(status_code=400, detail="User has no workspace")
    decision_dict = decision.model_dump()
    decision_dict['workspace_id'] = membership.workspace_id
    return crud.create_decision(db, decision_dict)

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
    return {
        "v1": v1,
        "v2": v2,
        "confidence_v1": 35,
        "confidence_v2": 72,
        "resolved_conflicts_count": 4,
        "assumptions_validated_count": 6,
        "perception_delta": {
            "strengthened_claims": [
                {"statement": "CAC is $50 and LTV is $200.", "delta": "+15% confidence"}
            ],
            "resolved_conflicts": [
                {"rationale": "High LTV/CAC ratio is unusual with only 45% gross margins. Need to verify variable costs."}
            ],
            "new_assumptions": [
                {"statement": "Integration API documentation is sufficient for self-serve."}
            ]
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
    
    claims = db.query(db_models.Claim).filter_by(decision_id=decision_id).all()
    assumptions = db.query(db_models.Assumption).filter_by(decision_id=decision_id).all()
    
    summary_text = "Executive Summary:\n\n"
    summary_text += "Key Claims:\n"
    for c in claims:
        summary_text += f"- {c.statement}\n"
    
    summary_text += "\nKey Assumptions:\n"
    for a in assumptions:
        summary_text += f"- {a.statement}\n"
        
    return {
        "summary": summary_text,
        "generated_at": datetime.utcnow()
    }

@router.get("/{decision_id}/slide-review")
def get_slide_review(
    decision_id: int,
    db: Session = Depends(get_db),
    decision: Decision = Depends(require_decision_access)
):
    import db.models as db_models
    
    evidence = db.query(db_models.Evidence).filter_by(decision_id=decision_id, evidence_type='pitch_deck').first()
    
    if not evidence:
        return {"slides": []}
        
    return {
        "deck_title": evidence.title,
        "slides": [
            {
                "slide_number": 1,
                "feedback": "Strong opening."
            },
            {
                "slide_number": 5,
                "feedback": "Need to substantiate $10k MRR claim."
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
