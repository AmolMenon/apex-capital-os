from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
from db.database import engine, Base

# Import Routers
from auth.routes import router as auth_router
from routes.companies import router as companies_router
from routes.deals import router as deals_router
from routes.founders import router as founders_router
from routes.documents import router as documents_router
from routes.investment_memos import router as investment_memos_router
from routes.portfolio_companies import router as portfolio_companies_router
from routes.comments import router as comments_router
from routes.tasks import router as tasks_router
from routes.users import router as users_router
from routes.ai_intelligence import router as ai_router
from routes.copilot import router as copilot_router
from routes.intelligence import router as intelligence_router
from routes.sourcing import router as sourcing_router
from routes.knowledge_graph import router as kg_router
from routes.autonomous import router as autonomous_router
from routes.data_room import router as data_room_router
from routes.agent_workflow import router as agent_workflow_router
from routes.brain import router as brain_router
from routes.deal_sync import router as deal_sync_router
from routes.conversation import router as conversation_router
from routes.diligence_run import router as diligence_run_router
from routes.document_intelligence import router as doc_intel_router
from routes.fund_os import router as fund_os_router
from routes.operations import router as ops_router
from routes.platform_diligence import router as platform_diligence_router
from routes.portfolio import router as portfolio_router
from routes.web_research import router as web_research_router
from routes.workspace import router as workspace_router
from routes.deal_structuring import router as deal_structuring_router
from routes.decision_lab import router as decision_lab_router

# Import Middleware
from core.logging_middleware import LoggingMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import db.models as models

# Create DB tables
from sqlalchemy import text
with engine.begin() as conn:
    # Drop tables that had schema changes to force recreation
    conn.execute(text("DROP TABLE IF EXISTS web_research_briefs"))
    conn.execute(text("DROP TABLE IF EXISTS deal_war_rooms"))
Base.metadata.create_all(bind=engine)

# Auto-seed Deal 1000 for Demo MVP
from db.database import SessionLocal
from db.models import Company, Deal, Analysis
db = SessionLocal()
try:
    if not db.query(Deal).filter(Deal.id == 1000).first():
        import datetime
        mock_company = Company(id=1000, name="Apex Demo Startup", sector="AI")
        db.add(mock_company)
        db.commit()
        db.refresh(mock_company)
        
        mock_deal = Deal(
            id=1000,
            company_id=mock_company.id,
            status="In Review",
            stage="Series A",
            funding_asking=10000000,
            valuation=50000000
        )
        db.add(mock_deal)
        db.commit()
        db.refresh(mock_deal)
        
        analysis = Analysis(
            deal_id=1000,
            full_analysis_json='{"recommendation": "Invest", "score": 85, "risks": ["Competition"]}'
        )
        db.add(analysis)
        db.commit()
        
        from seed_mock_pipeline import seed_autonomous_pipeline
        seed_autonomous_pipeline(db, 1000)
except Exception as e:
    print(f"Error seeding DB: {e}")
finally:
    db.close()


app = FastAPI(
    title="Apex Capital OS API",
    version="4.0.0",
    description="Production-grade API for Apex Capital OS, a comprehensive Venture Capital management platform.",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Logging Middleware
app.add_middleware(LoggingMiddleware)

# Global API Router Registration
api_prefix = "/api/v1"
app.include_router(auth_router, prefix=f"{api_prefix}/auth", tags=["Auth"])
app.include_router(users_router, prefix=f"{api_prefix}/users", tags=["Users"])
app.include_router(companies_router, prefix=f"{api_prefix}/companies", tags=["Companies"])
app.include_router(deals_router, prefix=f"{api_prefix}/deals", tags=["Deals"])
app.include_router(founders_router, prefix=f"{api_prefix}/founders", tags=["Founders"])
app.include_router(documents_router, prefix=f"{api_prefix}/documents", tags=["Documents"])
app.include_router(investment_memos_router, prefix=f"{api_prefix}/investment-memos", tags=["Investment Memos"])
app.include_router(portfolio_companies_router, prefix=f"{api_prefix}/portfolio", tags=["Portfolio"])
app.include_router(comments_router, prefix=f"{api_prefix}/comments", tags=["Comments"])
app.include_router(tasks_router, prefix=f"{api_prefix}/tasks", tags=["Tasks"])
app.include_router(ai_router, prefix=f"{api_prefix}/deals", tags=["AI Intelligence"])
app.include_router(copilot_router, prefix=f"{api_prefix}/assistant", tags=["Assistant"])
app.include_router(intelligence_router, prefix=f"{api_prefix}/intelligence", tags=["Intelligence"])
app.include_router(sourcing_router, prefix=f"{api_prefix}/sourcing", tags=["Sourcing"])
app.include_router(kg_router, prefix=f"{api_prefix}/knowledge-graph", tags=["Knowledge Graph"])
app.include_router(deal_sync_router, prefix=f"{api_prefix}/deal-sync", tags=["Deal Sync"])
app.include_router(autonomous_router, prefix=f"{api_prefix}/autonomous", tags=["Autonomous"])
app.include_router(data_room_router, prefix=f"{api_prefix}/data-room", tags=["Data Room"])
app.include_router(agent_workflow_router, prefix=f"{api_prefix}/workflows", tags=["Agent Workflow"])
app.include_router(brain_router, prefix=f"{api_prefix}/brain", tags=["Brain"])
app.include_router(conversation_router, prefix=f"{api_prefix}/conversations", tags=["Conversations"])
app.include_router(diligence_run_router, prefix=f"{api_prefix}/diligence-run", tags=["Diligence Run"])
app.include_router(doc_intel_router, prefix=f"{api_prefix}/doc-intel", tags=["Doc Intel"])
app.include_router(fund_os_router, prefix=f"{api_prefix}/fund-os", tags=["Fund OS"])
app.include_router(ops_router, prefix=f"{api_prefix}/operations", tags=["Operations"])
app.include_router(platform_diligence_router, prefix=f"{api_prefix}/platform-diligence", tags=["Platform Diligence"])
app.include_router(portfolio_router, prefix=f"{api_prefix}/portfolio-management", tags=["Portfolio Management"])
app.include_router(web_research_router, prefix=f"{api_prefix}/web-research", tags=["Web Research"])
app.include_router(workspace_router, prefix=f"{api_prefix}/workspace", tags=["Workspace"])
app.include_router(deal_structuring_router, prefix=f"{api_prefix}/deal-structuring", tags=["Deal Structuring"])
app.include_router(decision_lab_router, prefix=f"{api_prefix}/decision-lab", tags=["Decision Lab"])

@app.get(f"{api_prefix}/health", tags=["System"])
def health_check():
    return {"status": "ok", "version": "4.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
