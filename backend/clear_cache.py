import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

from database.database import SessionLocal
from db.models import Deal, WebResearchBriefModel, WarRoomReportModel, DiligenceRunModel

db = SessionLocal()

# Find Supertails
deal = db.query(Deal).filter(Deal.startup_name == "Supertails").first()
if deal:
    print(f"Found Supertails with ID {deal.id}")
    
    # Delete web research
    db.query(WebResearchBriefModel).filter(WebResearchBriefModel.deal_id == deal.id).delete()
    print("Deleted cached Web Research")
    
    # Delete war room
    db.query(WarRoomReportModel).filter(WarRoomReportModel.deal_id == deal.id).delete()
    print("Deleted cached War Room")
    
    # Delete diligence run
    db.query(DiligenceRunModel).filter(DiligenceRunModel.deal_id == deal.id).delete()
    print("Deleted cached Diligence Runs")
    
    # Check for workflows
    try:
        from agentic_workflow_engine.agent_models import AgentWorkflowRunModel
        db.query(AgentWorkflowRunModel).filter(AgentWorkflowRunModel.deal_id == str(deal.id)).delete()
        print("Deleted cached Workflows")
    except Exception as e:
        print(f"Could not delete workflows: {e}")
        
    db.commit()
    print("Committed deletions.")
else:
    print("Supertails deal not found in DB.")

db.close()
