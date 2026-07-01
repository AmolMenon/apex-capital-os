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
        # Auto-create if missing so it doesn't 404
        mock_data = {
            "company_name": "Demo Company",
            "war_room_status": "ready",
            "thesis": {
                "core_belief": "They will win.",
                "market_pull": "High",
                "founder_fit": "Excellent",
                "moat": "Data network effects",
                "distribution": "PLG",
                "why_now": "Market shift",
                "catalysts": ["AI adoption"]
            },
            "anti_thesis": {
                "biggest_risk": "Competition",
                "mitigation": "Execution",
                "why_it_fails": "Cannot monetize",
                "why_it_stays_small": "Niche market",
                "key_dependencies": ["OpenAI API"],
                "red_flags": ["High churn"]
            },
            "what_must_be_true": [{"statement": "They can sell", "probability": 0.8, "verification_method": "Call customers", "status": "pending"}],
            "partner_personas": [{"name": "Fund Math Partner", "focus": "Returns", "stance": "Skeptical", "key_quotes": ["Valuation too high"], "probability_to_approve": 0.5}],
            "partner_questions": [{"question": "Why now?", "context": "Market is crowded", "asked_by": "Growth Partner", "status": "open", "suggested_answer": "AI shift"}],
            "ic_simulation": {
                "analyst_opening": "Strong team",
                "bull_case": "Huge market",
                "bear_case": "High burn",
                "partner_debate": ["I disagree on market size"],
                "fund_math_discussion": "Needs 100x to return fund",
                "evidence_gaps": "Missing Q4 data",
                "partner_votes": [{"partner": "Alice", "vote": "Yes", "rationale": "Great founder"}],
                "ic_chair_summary": "We will wait",
                "required_diligence": ["Get Q4 numbers"],
                "committee_decision": "Lean Yes"
            },
            "conviction_score": {
                "overall_score": 85,
                "conviction_level": "High",
                "market_conviction": 90,
                "team_conviction": 85,
                "product_conviction": 80,
                "traction_conviction": 70,
                "evidence_conviction": 95,
                "fund_fit_conviction": 80,
                "valuation_conviction": 60,
                "diligence_completeness": 90,
                "drivers": ["Great team"],
                "detractors": ["High valuation"],
                "deltas": []
            },
            "conviction_deltas": [],
            "valuation_sensitivity": {
                "latest_known_valuation": "$100M",
                "assumed_entry_valuation": 100000000,
                "cheque_size": 10000000,
                "target_ownership": 10,
                "required_exit_value": 1000000000,
                "dilution_assumptions": "20%",
                "scenarios": [],
                "warnings": ["Pricey"]
            },
            "ownership_scenarios": [{"scenario": "Base", "ownership_pct": 10, "dilution": 20, "final_ownership": 8, "required_exit": 1000000000, "multiple": 10, "probability": 0.5}],
            "fund_return_scenarios": [{"scenario": "Base", "exit_value": 1000000000, "our_proceeds": 80000000, "multiple": 8, "fund_return_pct": 20, "probability": 0.5}],
            "change_our_mind": [{"condition": "Churn > 10%", "impact": "Kill deal", "status": "monitoring"}],
            "decision_gates": [{"name": "Technical Diligence", "status": "passed", "owner": "CTO", "completion_date": "2024-01-01"}],
            "final_recommendation": {
                "recommendation": "Invest",
                "confidence": "High",
                "next_steps": ["Issue term sheet"],
                "key_conditions": ["Founder vesting"],
                "author": "Partner A"
            }
        }
        create_war_room(db, deal_id, mock_data)
        war_room = get_war_room(db, deal_id)
        
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
    
    mock_data = {
        "company_name": "Demo Company",
        "war_room_status": "ready",
        "thesis": {
            "core_belief": "They will win.",
            "market_pull": "High",
            "founder_fit": "Excellent",
            "moat": "Data network effects",
            "distribution": "PLG",
            "why_now": "Market shift",
            "catalysts": ["AI adoption"]
        },
        "anti_thesis": {
            "biggest_risk": "Competition",
            "mitigation": "Execution",
            "why_it_fails": "Cannot monetize",
            "why_it_stays_small": "Niche market",
            "key_dependencies": ["OpenAI API"],
            "red_flags": ["High churn"]
        },
        "what_must_be_true": [{"statement": "They can sell", "probability": 0.8, "verification_method": "Call customers", "status": "pending"}],
        "partner_personas": [{"name": "Fund Math Partner", "focus": "Returns", "stance": "Skeptical", "key_quotes": ["Valuation too high"], "probability_to_approve": 0.5}],
        "partner_questions": [{"question": "Why now?", "context": "Market is crowded", "asked_by": "Growth Partner", "status": "open", "suggested_answer": "AI shift"}],
        "ic_simulation": {
            "analyst_opening": "Strong team",
            "bull_case": "Huge market",
            "bear_case": "High burn",
            "partner_debate": ["I disagree on market size"],
            "fund_math_discussion": "Needs 100x to return fund",
            "evidence_gaps": "Missing Q4 data",
            "partner_votes": [{"partner": "Alice", "vote": "Yes", "rationale": "Great founder"}],
            "ic_chair_summary": "We will wait",
            "required_diligence": ["Get Q4 numbers"],
            "committee_decision": "Lean Yes"
        },
        "conviction_score": {
            "overall_score": 85,
            "conviction_level": "High",
            "market_conviction": 90,
            "team_conviction": 85,
            "product_conviction": 80,
            "traction_conviction": 70,
            "evidence_conviction": 95,
            "fund_fit_conviction": 80,
            "valuation_conviction": 60,
            "diligence_completeness": 90,
            "drivers": ["Great team"],
            "detractors": ["High valuation"],
            "deltas": []
        },
        "conviction_deltas": [],
        "valuation_sensitivity": {
            "latest_known_valuation": "$100M",
            "assumed_entry_valuation": 100000000,
            "cheque_size": 10000000,
            "target_ownership": 10,
            "required_exit_value": 1000000000,
            "dilution_assumptions": "20%",
            "scenarios": [],
            "warnings": ["Pricey"]
        },
        "ownership_scenarios": [{"scenario": "Base", "ownership_pct": 10, "dilution": 20, "final_ownership": 8, "required_exit": 1000000000, "multiple": 10, "probability": 0.5}],
        "fund_return_scenarios": [{"scenario": "Base", "exit_value": 1000000000, "our_proceeds": 80000000, "multiple": 8, "fund_return_pct": 20, "probability": 0.5}],
        "change_our_mind": [{"condition": "Churn > 10%", "impact": "Kill deal", "status": "monitoring"}],
        "decision_gates": [{"name": "Technical Diligence", "status": "passed", "owner": "CTO", "completion_date": "2024-01-01"}],
        "final_recommendation": {
            "recommendation": "Invest",
            "confidence": "High",
            "next_steps": ["Issue term sheet"],
            "key_conditions": ["Founder vesting"],
            "author": "Partner A"
        }
    }
    
    create_war_room(db, deal_id, mock_data)
    # Get it back from db so it formats the json correctly
    return get_deal_sync(str(deal_id), db)

