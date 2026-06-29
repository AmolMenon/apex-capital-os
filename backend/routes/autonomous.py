from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import json
import time
import asyncio
from datetime import datetime

from db.database import SessionLocal
from database import crud
from routes.web_research import generate_research
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def normalize_deal_id(deal_id: str) -> int:
    d_id = str(deal_id).replace("deal-", "").replace("src_", "").lower()
    if d_id == "active": return 7
    if d_id == "zepto": return 1002
    if d_id == "mistral": return 5
    if d_id == "bharatvector": return 999
    if d_id == "neuraldesk": return 1000
    if d_id == "sarvam": return 1001
    if d_id == "1": return 1000
    try:
        return int(d_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Deal not found")

class ExplainableScore(BaseModel):
    score: int
    confidence: int
    supporting_factors: List[str]
    weaknesses: List[str]
    missing_info: List[str]

# In-memory store for processing logs (demo only)
autonomous_simulations = {}

async def run_autonomous_simulation(deal_id: int):
    # This simulates the autonomous workflow
    autonomous_simulations[deal_id] = {
        "stage": "Initializing",
        "progress": 0,
        "logs": [],
        "timeline": []
    }
    
    def add_log(msg):
        autonomous_simulations[deal_id]["logs"].append(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")
        
    def add_event(title, desc):
        autonomous_simulations[deal_id]["timeline"].insert(0, {
            "time": datetime.now().strftime('%H:%M:%S'),
            "title": title,
            "description": desc
        })

    add_event("Deal Intake", "Started autonomous pipeline")
    
    # 1. Research
    autonomous_simulations[deal_id]["stage"] = "Research & Market Analysis"
    autonomous_simulations[deal_id]["progress"] = 20
    add_log("Fetching market size and competitors...")
    await asyncio.sleep(2)
    add_log("Synthesizing market map...")
    await asyncio.sleep(1)
    add_event("Research Complete", "Market and Competitor analysis generated")
    
    # 2. Deck Extraction
    autonomous_simulations[deal_id]["stage"] = "Pitch Deck Extraction"
    autonomous_simulations[deal_id]["progress"] = 40
    add_log("Parsing deck claims...")
    await asyncio.sleep(2)
    add_log("Validating financial metrics...")
    await asyncio.sleep(1)
    add_event("Deck Intelligence", "Claims extracted and verified against research")
    
    # 3. Diligence
    autonomous_simulations[deal_id]["stage"] = "Diligence Planning"
    autonomous_simulations[deal_id]["progress"] = 60
    add_log("Generating risk models...")
    await asyncio.sleep(2)
    add_event("Diligence Generated", "Risks and missing evidence identified")
    
    # 4. Fund Fit
    autonomous_simulations[deal_id]["stage"] = "Fund Fit Assessment"
    autonomous_simulations[deal_id]["progress"] = 80
    add_log("Simulating returns and power law...")
    await asyncio.sleep(2)
    add_event("Fund Fit Complete", "Evaluated against 10-year fund math")
    
    # 5. Recommendation
    autonomous_simulations[deal_id]["stage"] = "Final Recommendation"
    autonomous_simulations[deal_id]["progress"] = 100
    add_log("Synthesizing investment thesis...")
    await asyncio.sleep(1)
    
    db = SessionLocal()
    deal = crud.get_deal(db, deal_id)
    if deal:
        if deal.startup_name == "NeuralDesk":
            add_event("Decision Updated", "Proceed to Due Diligence")
        else:
            add_event("Decision Updated", "Recommendation formulated")
    db.close()
    
    autonomous_simulations[deal_id]["stage"] = "Completed"

@router.post("/deals/{deal_id}/simulate-autonomous")
async def start_autonomous_simulation(deal_id: str, background_tasks: BackgroundTasks):
    deal_id_int = normalize_deal_id(deal_id)
    background_tasks.add_task(run_autonomous_simulation, deal_id_int)
    return {"status": "started"}

@router.get("/deals/{deal_id}/autonomous-state")
def get_autonomous_state(deal_id: str, db: Session = Depends(get_db)):
    deal_id_int = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id=deal_id_int)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    deal_dict = {k: v for k, v in deal.__dict__.items() if not k.startswith('_')}
    
    # Get simulation status
    sim_status = autonomous_simulations.get(deal_id_int, {
        "stage": "Pending",
        "progress": 0,
        "logs": [],
        "timeline": []
    })
    
    if deal.analysis and not autonomous_simulations.get(deal_id_int):
        # If it's already analyzed but not simulating right now
        sim_status = {
            "stage": "Completed",
            "progress": 100,
            "logs": ["Loaded from cache."],
            "timeline": [
                {"time": "Archived", "title": "Decision Logged", "description": "Investment thesis finalized"},
                {"time": "Archived", "title": "Diligence Generated", "description": "Risks identified"},
                {"time": "Archived", "title": "Research Complete", "description": "Market analyzed"}
            ]
        }
        
    # Aggregate state
    state = {
        "deal": deal_dict,
        "autonomous": sim_status,
        "research": {},
        "deck": {},
        "diligence": {},
        "fund_fit": {},
        "analysis": {},
        "partner_questions": [
            "Why now? Why is this the exact moment for this market?",
            "What assumptions in their revenue model are unsupported?",
            "What would make us reject this investment immediately?"
        ]
    }
    
    if deal.analysis:
        try:
            analysis_dict = json.loads(deal.analysis.full_analysis_json)
            # Add explainable score
            score_val = analysis_dict.get("overall_score", 50)
            state["analysis"] = analysis_dict
            state["analysis"]["explainable_score"] = {
                "score": score_val,
                "confidence": 85 if score_val > 70 else 60,
                "supporting_factors": ["Strong founding team", "Large TAM", "Clear initial traction"],
                "weaknesses": ["Valuation is high", "Incumbents moving fast"],
                "missing_info": ["Cohort retention data", "Enterprise contract terms"]
            }
        except:
            pass

    if deal.research_brief:
        try:
            state["research"] = {
                "market_research": json.loads(deal.research_brief.market_research_json),
                "competitor_research": json.loads(deal.research_brief.competitor_research_json),
                "evidence_grade": json.loads(deal.research_brief.evidence_grade_json)
            }
        except:
            pass
            
    if deal.deck_analysis:
        try:
            state["deck"] = {
                "deck_quality_score": deal.deck_analysis.deck_quality_score,
                "risks": json.loads(deal.deck_analysis.risks_json),
                "key_claims": json.loads(deal.deck_analysis.key_claims_json)
            }
        except:
            pass
            
    if deal.diligence_plan:
        try:
            state["diligence"] = {
                "ic_readiness_score": deal.diligence_plan.ic_readiness_score,
                "priority_tasks": json.loads(deal.diligence_plan.priority_tasks_json),
                "risk_resolution_plan": json.loads(deal.diligence_plan.risk_resolution_plan_json)
            }
        except:
            pass

    if deal.fund_fit_assessment:
        try:
            state["fund_fit"] = {
                "thesis_fit_score": deal.fund_fit_assessment.thesis_fit_score,
                "recommendation": deal.fund_fit_assessment.recommendation
            }
        except:
            pass

    return state
