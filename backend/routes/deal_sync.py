from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from database.crud import get_deal, get_war_room, create_war_room
import json

router = APIRouter()

@router.get("/status")
def get_status():
    return {"status": "ok"}

@router.get("/deals/{deal_id}")
def get_deal_sync(deal_id: str, db: Session = Depends(get_db)):
    try:
        deal_id = int(deal_id)
    except:
        deal_id = 1000
    
    war_room = get_war_room(db, deal_id)
    if not war_room:
        raise HTTPException(status_code=404, detail="Deal sync not found")
        
    return {
        "company_name": war_room.company_name,
        "war_room_status": war_room.war_room_status,
        "thesis": json.loads(war_room.thesis_json) if war_room.thesis_json else None,
        "anti_thesis": json.loads(war_room.anti_thesis_json) if war_room.anti_thesis_json else None,
        "what_must_be_true": json.loads(war_room.what_must_be_true_json) if war_room.what_must_be_true_json else None,
        "partner_personas": json.loads(war_room.partner_personas_json) if war_room.partner_personas_json else None,
        "partner_questions": json.loads(war_room.partner_questions_json) if war_room.partner_questions_json else None,
        "ic_simulation": json.loads(war_room.ic_simulation_json) if war_room.ic_simulation_json else None,
        "conviction_score": json.loads(war_room.conviction_score_json) if war_room.conviction_score_json else None,
        "conviction_deltas": json.loads(war_room.conviction_deltas_json) if war_room.conviction_deltas_json else None,
        "valuation_sensitivity": json.loads(war_room.valuation_sensitivity_json) if war_room.valuation_sensitivity_json else None,
        "ownership_scenarios": json.loads(war_room.ownership_scenarios_json) if war_room.ownership_scenarios_json else None,
        "fund_return_scenarios": json.loads(war_room.fund_return_scenarios_json) if war_room.fund_return_scenarios_json else None,
        "change_our_mind": json.loads(war_room.change_our_mind_json) if war_room.change_our_mind_json else None,
        "decision_gates": json.loads(war_room.decision_gates_json) if war_room.decision_gates_json else None,
        "final_recommendation": json.loads(war_room.final_recommendation_json) if war_room.final_recommendation_json else None,
        "metadata": json.loads(war_room.metadata_json) if war_room.metadata_json else None
    }

@router.post("/deals/{deal_id}/run")
def run_deal_sync(deal_id: str, db: Session = Depends(get_db)):
    try:
        deal_id = int(deal_id)
    except:
        deal_id = 1000
    
    # Just a mock implementation for the UI to work
    mock_data = {
        "company_name": "Demo Company",
        "war_room_status": "ready",
        "thesis": {"core_belief": "They will win.", "market_pull": "High"},
        "anti_thesis": {"biggest_risk": "Competition", "mitigation": "Execution"},
        "what_must_be_true": [{"statement": "They can sell", "probability": 0.8}],
        "partner_personas": [],
        "partner_questions": [],
        "ic_simulation": {"committee_decision": "Lean Yes"},
        "conviction_score": {"overall_score": 85, "conviction_level": "High"},
        "conviction_deltas": [],
        "valuation_sensitivity": {},
        "ownership_scenarios": [],
        "fund_return_scenarios": [],
        "change_our_mind": [],
        "decision_gates": [],
        "final_recommendation": {"recommendation": "Invest"}
    }
    
    create_war_room(db, deal_id, mock_data)
    # Get it back from db so it formats the json correctly
    return get_deal_sync(str(deal_id), db)

