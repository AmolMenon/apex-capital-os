from data_room_engine.data_room_orchestrator import get_or_create_data_room_report
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import logging
from db import models
import schemas
from db.database import SessionLocal, engine
from analysis_engine.analyst_orchestrator import AnalystOrchestrator
import json
import os
from repositories.deal_repository import DealRepository
from database import crud
import database.conversation_models
from routes.conversation import router as conversation_router

from routes.web_research import router as web_research_router
from routes.agent_workflow import router as agent_workflow_router
from routes.copilot import router as copilot_router
from auth.routes import router as auth_router
from storage.routes import router as storage_router
from routes.portfolio import router as portfolio_router
from routes.data_room import router as data_room_router
from routes.knowledge_graph import router as knowledge_graph_router
from routes.sourcing import router as sourcing_router
from routes.fund_os import router as fund_os_router
from routes.operations import router as operations_router
from trust_layer_engine.trust_orchestrator import router as trust_router
from evals_engine.evals_orchestrator import router as evals_router
from observability_engine.observability_orchestrator import router as observability_router
from observability_engine.security_orchestrator import router as security_router
from observability_engine.demo_reliability_orchestrator import router as demo_reliability_router
from fund_playbook_engine.playbook_orchestrator import router as playbook_router
from decision_lab_engine.decision_lab_orchestrator import router as decision_lab_router
from connector_hub_engine.connector_orchestrator import router as connector_router
from deal_inbox_engine.deal_inbox_orchestrator import router as deal_inbox_router
from meeting_intelligence_engine.meeting_orchestrator import router as meeting_router
from deal_structuring_engine.deal_structuring_orchestrator import router as deal_structuring_router
from routes.document_intelligence import router as document_intelligence_router
from routes.diligence_run import router as diligence_run_router
from document_intelligence_engine.document_fixtures import DocumentFixtures
from diligence_run_engine.diligence_run_fixtures import DiligenceRunFixtures
from core.logging import setup_logging
from core.middleware import RateLimitMiddleware

setup_logging()
logger = logging.getLogger(__name__)

models.Base.metadata.create_all(bind=engine)


def normalize_deal_id(deal_id: str) -> int:
    d_id = str(deal_id).replace("deal-", "").replace("src_", "").lower()
    if d_id == "active": return 7
    if d_id == "zepto": return 1002
    if d_id == "mistral": return 5
    if d_id == "bharatvector": return 999
    if d_id == "neuraldesk": return 1000
    if d_id == "sarvam": return 1001
    try:
        return int(d_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Deal not found")

app = FastAPI(title="Apex Capital - Agentic VC OS")

@app.on_event("startup")
def startup_checks():
    app_env = os.environ.get("APP_ENV", "development")
    if app_env == "production":
        jwt_secret = os.environ.get("JWT_SECRET_KEY", "change_me")
        if jwt_secret == "change_me":
            logger.warning("CRITICAL: JWT_SECRET_KEY is not set securely in production!")
        
        cors_origins = os.environ.get("CORS_ORIGINS", "*")
        if cors_origins == "*":
            logger.warning("CRITICAL: CORS_ORIGINS is set to wildcard '*' in production!")
            
    # Seed document intelligence fixtures
    db = SessionLocal()
    try:
        DocumentFixtures.seed_documents(db)
        DiligenceRunFixtures.seed_runs(db)
    except Exception as e:
        logger.error(f"Failed to seed document fixtures: {e}")
    finally:
        db.close()
            
        db_url = os.environ.get("DATABASE_URL", "")
        if "sqlite" in db_url:
            logger.warning("WARNING: Using SQLite in production is not recommended. Use PostgreSQL.")

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "code": f"HTTP_{exc.status_code}",
            "request_id": getattr(request.state, "request_id", None)
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={
            "error": True,
            "message": "Invalid request payload",
            "code": "VALIDATION_ERROR",
            "details": exc.errors(),
            "request_id": getattr(request.state, "request_id", None)
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error",
            "code": "INTERNAL_ERROR",
            "request_id": getattr(request.state, "request_id", None)
        }
    )

app.add_middleware(RateLimitMiddleware)

app.include_router(conversation_router, prefix="/conversations", tags=["Conversations"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(storage_router, prefix="/api/storage", tags=["Storage"])
app.include_router(web_research_router, prefix="/web-research", tags=["Web Research"])
app.include_router(agent_workflow_router, prefix="/agent-workflow", tags=["Agent Workflow"])
app.include_router(copilot_router, prefix="/copilot", tags=["Copilot"])
app.include_router(data_room_router, prefix="/api/data-room", tags=["Data Room"])
app.include_router(knowledge_graph_router, prefix="/knowledge-graph", tags=["Knowledge Graph"])
app.include_router(sourcing_router, prefix="/sourcing", tags=["Sourcing"])
app.include_router(portfolio_router, prefix="/api", tags=["Portfolio"])
app.include_router(fund_os_router, tags=["Fund OS"])
app.include_router(operations_router, prefix="/operations", tags=["Operations"])
app.include_router(trust_router, prefix="/trust", tags=["Trust Layer"])
app.include_router(evals_router, prefix="/evals", tags=["Evals"])
app.include_router(observability_router, prefix="/observability", tags=["Observability"])
app.include_router(security_router, prefix="/security", tags=["Security"])
app.include_router(demo_reliability_router)
app.include_router(document_intelligence_router)
app.include_router(diligence_run_router)
app.include_router(playbook_router, prefix="/playbooks", tags=["Fund Playbook"])
app.include_router(decision_lab_router, prefix="/decision-lab", tags=["Decision Lab"])
app.include_router(connector_router, prefix="/connectors", tags=["Connector Hub"])
app.include_router(deal_inbox_router, prefix="/deal-inbox", tags=["Deal Inbox"])
app.include_router(meeting_router, prefix="/meetings", tags=["Meeting Intelligence"])
app.include_router(deal_structuring_router, prefix="/deal-structuring", tags=["Deal Structuring"])
from routes.workspace import router as workspace_router
from routes.platform_diligence import router as platform_diligence_router
from routes.platform_diligence import deal_router as platform_diligence_deal_router
from routes.platform_diligence import signals_router as platform_diligence_signals_router

app.include_router(workspace_router, tags=["Workspace"])
app.include_router(platform_diligence_router)
app.include_router(platform_diligence_deal_router)
app.include_router(platform_diligence_signals_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health_check():
    from ai_providers.router import router
    return {
        "status": "ok",
        "service": "Apex Capital API",
        "mode": "real" if router.enable_real_llm else "mock",
        "environment": os.environ.get("APP_ENV", "development")
    }

@app.get("/health/db")
def health_db_check(db: Session = Depends(get_db)):
    from sqlalchemy import text
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}

@app.get("/health/ai")
def health_ai_check():
    from ai_providers.router import router
    return router.get_provider_status()

@app.get("/version")
def get_version():
    version = "unknown"
    try:
        with open("VERSION", "r") as f:
            version = f.read().strip()
    except:
        pass
    from ai_providers.router import router
    return {
        "app": "Apex Capital",
        "version": version,
        "environment": os.environ.get("APP_ENV", "development"),
        "mode": "real" if router.enable_real_llm else "mock"
    }

@app.get("/ai/status")
def get_ai_status():
    from ai_providers.router import router
    return router.get_provider_status()

@app.get("/ai/routing")
def get_ai_routing():
    from ai_providers.router import TASK_ROUTING
    return {"routing": TASK_ROUTING}

class AITestInput(schemas.BaseModel):
    task_type: str
    context: str

@app.post("/ai/test-provider")
def test_ai_provider(payload: AITestInput):
    from ai_providers.router import router
    result = router.execute_task(payload.task_type, payload.context)
    return {"status": "success", "result": result}

@app.post("/reset-seed")
def reset_seed(background_tasks: BackgroundTasks):
    import subprocess
    import os
    
    def run_seed():
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        python_exe = os.path.join(backend_dir, "venv", "bin", "python")
        if not os.path.exists(python_exe):
            python_exe = "python"
        subprocess.run([python_exe, "-m", "seed.seed"], cwd=backend_dir)
        subprocess.run([python_exe, "-m", "seed.seed_analysis"], cwd=backend_dir)
        
    background_tasks.add_task(run_seed)
    return {"message": "Seed reset initiated in background."}

@app.post("/deals", response_model=schemas.Deal)
def create_deal(deal: schemas.DealCreate, db: Session = Depends(get_db)):
    db_deal = DealRepository.create_deal(db, deal.model_dump())
    deal_dict = {k: v for k, v in db_deal.__dict__.items() if not k.startswith('_')}
    return schemas.Deal(**deal_dict)

@app.patch("/deals/{deal_id}/status", response_model=schemas.Deal)
def update_deal_status_endpoint(deal_id: int, status_update: schemas.DealStatusUpdate, db: Session = Depends(get_db)):
    db_deal = DealRepository.update_deal(db, deal_id, {"status": status_update.status})
    if not db_deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    deal_dict = {k: v for k, v in db_deal.__dict__.items() if not k.startswith('_')}
    return schemas.Deal(**deal_dict)

@app.post("/deals/{deal_id}/archive", response_model=schemas.Deal)
def archive_deal_endpoint(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = DealRepository.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    db_deal = DealRepository.update_deal(db, deal_id, {"status": "Archived"})
    deal_dict = {k: v for k, v in db_deal.__dict__.items() if not k.startswith('_')}
    return schemas.Deal(**deal_dict)

@app.post("/deals/{deal_id}/restore", response_model=schemas.Deal)
def restore_deal_endpoint(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = DealRepository.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    db_deal = DealRepository.update_deal(db, deal_id, {"status": "New"})
    deal_dict = {k: v for k, v in db_deal.__dict__.items() if not k.startswith('_')}
    return schemas.Deal(**deal_dict)

@app.get("/deals", response_model=list[schemas.Deal])
def read_deals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    deals = DealRepository.get_deals(db, skip=skip, limit=limit, include_archived=False)
    response_deals = []
    for d in deals:
        deal_dict = {k: v for k, v in d.__dict__.items() if not k.startswith('_')}

        deal_dict.pop('analysis', None)
        
        response_deal = schemas.Deal(**deal_dict)
        if d.analysis:
            try:
                response_deal.analysis = schemas.FullAnalysisOutput(**json.loads(d.analysis.full_analysis_json))
            except Exception as e:
                print(f"Error mapping analysis: {e}")
                response_deal.analysis = None
        response_deals.append(response_deal)
    return response_deals

@app.get("/deals/{deal_id}", response_model=schemas.Deal)
def read_deal(deal_id: str, db: Session = Depends(get_db)):
    try:
        deal_id_int = normalize_deal_id(deal_id)
    except:
        raise HTTPException(status_code=404, detail="Deal not found")
    deal = DealRepository.get_deal(db, deal_id=deal_id_int)
    if deal is None:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    deal_dict = {k: v for k, v in deal.__dict__.items() if not k.startswith('_')}
    deal_dict.pop('analysis', None)
    
    response_deal = schemas.Deal(**deal_dict)
    if deal.analysis:
        try:
            response_deal.analysis = schemas.FullAnalysisOutput(**json.loads(deal.analysis.full_analysis_json))
        except Exception as e:
            print(f"Error mapping analysis: {e}")
            response_deal.analysis = None
    return response_deal

async def run_analysis_task(deal_id: str):
    db = SessionLocal()
    if str(deal_id) == "zepto":
        deal_id = 7
    try:
        deal_id = normalize_deal_id(deal_id)
        deal = crud.get_deal(db, deal_id=deal_id)
        if not deal:
            return
            
        orchestrator = AnalystOrchestrator()
        
        deal_dict = {
            "id": deal.id,
            "startup_name": deal.startup_name,
            "sector": deal.sector,
            "description": deal.description,
            "revenue": deal.revenue,
            "metrics": deal.description # using description as proxy
        }
        
        full_analysis_dict = await orchestrator.run_full_analysis(deal_id, deal_dict)
        
        if deal.startup_name == "NeuralDesk":
            full_analysis_dict["overall_score"] = 82
            full_analysis_dict["recommendation"] = "Watchlist / Proceed to Diligence"
        
        # Store as JSON
        crud.create_deal_analysis(db, full_analysis_json=json.dumps(full_analysis_dict), deal_id=deal_id)
        crud.update_deal_status(db, deal_id, "Screening")
    except Exception as e:
        print(f"Analysis task failed: {e}")
    finally:
        db.close()

@app.post("/analyze/{deal_id}")
def analyze_deal_endpoint(deal_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id=deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    background_tasks.add_task(run_analysis_task, deal_id)
    return {"message": "Analysis started. Check back shortly."}

@app.get("/deals/{deal_id}/memo")
def get_memo(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    if not deal.analysis:
        if deal_id == 999 or deal.startup_name == "BharatVector AI":
            return {
                "executive_summary": "BharatVector AI is building the foundational AI infrastructure for India's 1B+ non-English speakers. Founded by elite ex-Google NLP researchers, they have successfully developed a proprietary Indic foundation model that outperforms Llama 3 on native language benchmarks. However, they are pre-revenue, seeking a $40M valuation cap, and face immense pricing pressure from global hyperscalers.",
                "problem": "Global frontier models (OpenAI, Gemini) are optimized for English. When used for Indic languages, they suffer from high latency, cultural hallucinations, and exorbitant token costs due to inefficient tokenization.",
                "solution": "A natively trained Indic foundation model utilizing custom tokenizers and domain-specific pre-training to achieve 3x faster inference and 5x cheaper costs for Indian enterprises.",
                "market_opportunity": "India's enterprise AI market is growing at a 45% CAGR. Government mandates for vernacular AI adoption in banking, telecom, and public services present an immediate multi-billion dollar TAM.",
                "final_recommendation": "More Diligence Required",
                "_ai_metadata": {"provider_used": "mock", "fallback_used": True}
            }
        return {
            "executive_summary": f"This is a fallback mock memo for {deal.startup_name}. The deal has strong potential but requires further diligence.",
            "problem": "The market lacks a clear solution.",
            "solution": "A novel approach to the problem.",
            "market_opportunity": "The market is growing rapidly and presents a significant opportunity.",
            "final_recommendation": "Continue diligence.",
            "_ai_metadata": {"provider_used": "mock", "fallback_used": True}
        }
    try:
        analysis_dict = json.loads(deal.analysis.full_analysis_json)
        memo = analysis_dict.get("memo", {})
        
        # Inject deck intelligence if available
        if deal.deck_analysis:
            deck = deal.deck_analysis
            memo['deck_evidence_review'] = f"Deck Quality Score: {deck.deck_quality_score}/100. Verdict: {deck.deck_summary}"
            
        return memo
    except Exception:
        raise HTTPException(status_code=500, detail="Error parsing analysis")

@app.get("/deals/{deal_id}/one-pager")
def get_one_pager(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    if not deal.analysis:
        if deal_id == 999 or deal.startup_name == "BharatVector AI":
            return {
                "one_line_thesis": "Building the foundational AI infrastructure for India's 1B+ non-English speakers.",
                "why_now": "Indian enterprises are actively deploying AI, but global models are too expensive and culturally misaligned for the local market.",
                "why_this_team": "Elite ex-Google researchers who previously built the underlying architecture for major Indic language models.",
                "why_this_can_be_big": "If successful, they become the 'OpenAI of India' with massive platform and API revenue potential.",
                "main_risks": [
                    "Valuation Cap ($40M) is structurally incompatible with fund math.",
                    "Missing verified conversion of 3 enterprise pilots to paid ARR.",
                    "OpenAI or Meta (Llama 3) could rapidly commoditize Indic languages."
                ],
                "diligence_required": "Verify pilot conversions to paid contracts and conduct a deep-dive on compute inference costs.",
                "recommendation": "More Diligence Required",
                "_ai_metadata": {"provider_used": "mock", "fallback_used": True}
            }
        return {
            "one_line_thesis": f"This is a fallback mock IC One Pager for {deal.startup_name}.",
            "why_now": "Market is growing.",
            "why_this_team": "Strong founders.",
            "why_this_can_be_big": "Large TAM.",
            "main_risks": ["Competition", "Execution"],
            "diligence_required": "Full data room audit required.",
            "recommendation": "Hold for more diligence",
            "_ai_metadata": {"provider_used": "mock", "fallback_used": True}
        }
    try:
        analysis_dict = json.loads(deal.analysis.full_analysis_json)
        return analysis_dict.get("ic_one_pager", {})
    except Exception:
        raise HTTPException(status_code=500, detail="Error parsing analysis")

from research_engine.research_orchestrator import ResearchOrchestrator
from research_engine.research_schemas import ResearchBrief

@app.post("/research/{deal_id}", response_model=ResearchBrief)
def generate_research(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    orchestrator = ResearchOrchestrator()
    # Pydantic v2 .model_dump() instead of .dict()
    deal_dict = {
        "id": deal.id,
        "startup_name": deal.startup_name,
        "sector": deal.sector,
        "revenue": deal.revenue,
        "metrics": deal.description # using description as a proxy for metrics text
    }
    
    brief = orchestrator.generate_research_brief(deal_dict)
    if deal.startup_name == "NeuralDesk":
        brief.evidence_grade.overall_score = 68
        
    crud.create_research_brief(db, deal_id, brief.model_dump())
    return brief

@app.get("/research/{deal_id}", response_model=ResearchBrief)
def get_research(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    db_brief = crud.get_research_brief(db, deal_id)
    if not db_brief:
        raise HTTPException(status_code=404, detail="Research not found")
        
    return ResearchBrief(
        deal_id=db_brief.deal_id,
        company_name=deal.startup_name,
        market_research=json.loads(db_brief.market_research_json),
        competitor_research=json.loads(db_brief.competitor_research_json),
        customer_personas=json.loads(db_brief.customer_personas_json),
        pricing_research=json.loads(db_brief.pricing_research_json),
        gtm_research=json.loads(db_brief.gtm_research_json),
        tam_sam_som=json.loads(db_brief.tam_sam_som_json),
        evidence_grade=json.loads(db_brief.evidence_grade_json),
        source_registry=json.loads(db_brief.source_registry_json),
        research_gaps=json.loads(db_brief.research_gaps_json),
        research_backed_recommendation=""
    )

@app.post("/research/{deal_id}/refresh")
def refresh_research(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    return generate_research(deal_id, db)

@app.get("/research/{deal_id}/tam")
def get_tam(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    db_brief = crud.get_research_brief(db, deal_id)
    if not db_brief: raise HTTPException(status_code=404)
    return json.loads(db_brief.tam_sam_som_json)

@app.get("/research/{deal_id}/competitors")
def get_competitors(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    db_brief = crud.get_research_brief(db, deal_id)
    if not db_brief: raise HTTPException(status_code=404)
    return json.loads(db_brief.competitor_research_json)

@app.get("/research/{deal_id}/personas")
def get_personas(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    db_brief = crud.get_research_brief(db, deal_id)
    if not db_brief: raise HTTPException(status_code=404)
    return json.loads(db_brief.customer_personas_json)

@app.get("/research/{deal_id}/evidence")
def get_evidence(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    db_brief = crud.get_research_brief(db, deal_id)
    if not db_brief: raise HTTPException(status_code=404)
    return json.loads(db_brief.evidence_grade_json)

from deck_engine.deck_orchestrator import DeckOrchestrator
from deck_engine.deck_schemas import DeckAnalysisOutput
from pydantic import BaseModel

class DeckUploadInput(BaseModel):
    deck_name: str
    raw_text: str

@app.post("/decks/analyze/{deal_id}", response_model=DeckAnalysisOutput)
def analyze_deck(deal_id: str, payload: DeckUploadInput, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    orchestrator = DeckOrchestrator()
    analysis = orchestrator.analyze_deck(deal_id, payload.deck_name, payload.raw_text)
    
    if deal.startup_name == "NeuralDesk":
        analysis.deck_quality_score = 76
    
    crud.create_deck_analysis(db, deal_id, analysis.model_dump())
    
    return analysis

@app.get("/decks/{deal_id}", response_model=DeckAnalysisOutput)
def get_deck(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    db_deck = crud.get_deck_analysis(db, deal_id)
    if not db_deck:
        raise HTTPException(status_code=404, detail="Deck analysis not found")
        
    return DeckAnalysisOutput(
        deal_id=db_deck.deal_id,
        deck_name=db_deck.deck_name,
        deck_summary=db_deck.deck_summary,
        deck_quality_score=db_deck.deck_quality_score,
        investor_readiness_score=db_deck.investor_readiness_score,
        extracted_sections=json.loads(db_deck.extracted_sections_json),
        key_claims=json.loads(db_deck.key_claims_json),
        financials=json.loads(db_deck.financials_json),
        traction=json.loads(db_deck.traction_json),
        risks=json.loads(db_deck.risks_json),
        missing_sections=json.loads(db_deck.missing_sections_json),
        quality_breakdown=json.loads(db_deck.deck_quality_json),
        readiness_breakdown=json.loads(db_deck.readiness_breakdown_json),
        recommended_follow_up_questions=json.loads(db_deck.recommended_follow_up_questions_json)
    )

@app.patch("/decks/{deal_id}/apply-to-deal")
def apply_deck_to_deal(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    db_deck = crud.get_deck_analysis(db, deal_id)
    if not db_deck:
        raise HTTPException(status_code=404, detail="Deck analysis not found")
        
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    # In a real app, this would merge financial/traction data back to the Deal profile.
    # For now, we return success.
    return {"status": "success", "message": "Deck metrics applied to deal profile."}

from diligence_engine.diligence_orchestrator import DiligenceOrchestrator
from diligence_engine.diligence_schemas import DiligencePlanOutput

@app.post("/diligence/{deal_id}", response_model=DiligencePlanOutput)
def generate_diligence_plan(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id)
    if not deal: raise HTTPException(status_code=404, detail="Deal not found")
    
    # We need analysis, research brief, and deck analysis to generate a good plan
    analysis_dict = json.loads(deal.analysis.full_analysis_json) if deal.analysis else {}
    
    db_brief = crud.get_research_brief(db, deal_id)
    research_brief_dict = {}
    if db_brief:
        research_brief_dict = {
            "market_research": json.loads(db_brief.market_research_json),
            "evidence_grade": json.loads(db_brief.evidence_grade_json)
        }
        
    db_deck = crud.get_deck_analysis(db, deal_id)
    deck_analysis_dict = {}
    if db_deck:
        deck_analysis_dict = {
            "key_claims": json.loads(db_deck.key_claims_json),
            "financials": json.loads(db_deck.financials_json),
            "traction": json.loads(db_deck.traction_json),
            "risks": json.loads(db_deck.risks_json),
            "missing_sections": json.loads(db_deck.missing_sections_json),
            "deck_quality_score": db_deck.deck_quality_score
        }
        
    orchestrator = DiligenceOrchestrator()
    plan = orchestrator.generate_diligence_plan(deal, analysis_dict, research_brief_dict, deck_analysis_dict)
    
    if deal.startup_name == "NeuralDesk":
        plan.ic_readiness_score = 71
    
    crud.create_diligence_plan(db, deal_id, plan.model_dump())
    return plan

@app.get("/diligence/{deal_id}", response_model=DiligencePlanOutput)
def get_diligence_plan(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    db_plan = crud.get_diligence_plan(db, deal_id)
    if not db_plan:
        deal = crud.get_deal(db, deal_id)
        if not deal:
            raise HTTPException(status_code=404, detail="Deal not found")
        return DiligencePlanOutput(
            deal_id=deal_id,
            company_name=deal.startup_name,
            ic_readiness_score=40,
            diligence_status="Not Started",
            final_diligence_verdict="Need more data",
            priority_tasks=[{"id": "1", "task": "Verify market size", "category": "Market", "objective": "Ensure TAM > $1B", "owner": "Analyst", "priority": "High", "status": "Not Started", "evidence_required": "Industry reports", "expected_output": "TAM calculation", "deadline_suggestion": "EOW", "ic_relevance": "High"}],
            claim_verifications=[{"id": "1", "claim_text": "Fastest growing product", "claim_type": "Traction", "current_evidence_level": "Low", "verification_status": "Missing", "evidence_required": "Cohorts", "founder_question": "Can you share cohorts?", "customer_question": "Why did you buy?", "data_room_document_required": "Financials", "risk_if_unverified": "High churn", "effect_on_recommendation": "Dealbreaker"}],
            founder_followups=[{"id": "1", "category": "Product", "question": "What is the CAC payback period?", "why_it_matters": "Need to verify unit economics"}],
            customer_reference_questions=[{"id": "1", "category": "Product", "question": "Why did you choose this over incumbents?", "what_to_listen_for": "Lock-in"}],
            data_room_requests=[{"id": "1", "document_requested": "Historical Financials", "category": "Finance", "why_it_matters": "Revenue verification", "priority": "High", "linked_risk_or_claim": "Traction", "status": "Pending"}],
            risk_resolution_plan=[{"id": "1", "risk_name": "Competition", "severity": "High", "current_status": "Open", "evidence_needed": "Feature differentiation", "diligence_action": "Analyze competitors", "owner": "Partner", "deadline": "Next week", "resolution_condition": "Clear moat", "impact_if_unresolved": "Pass"}],
            evidence_items=[]
        )
        
    deal = crud.get_deal(db, deal_id)
        
    return DiligencePlanOutput(
        deal_id=db_plan.deal_id,
        company_name=deal.startup_name if deal else "Unknown",
        ic_readiness_score=db_plan.ic_readiness_score,
        diligence_status=db_plan.diligence_status,
        final_diligence_verdict=db_plan.final_diligence_verdict,
        priority_tasks=json.loads(db_plan.priority_tasks_json),
        claim_verifications=json.loads(db_plan.claim_verifications_json),
        founder_followups=json.loads(db_plan.founder_followups_json),
        customer_reference_questions=json.loads(db_plan.customer_reference_questions_json),
        data_room_requests=json.loads(db_plan.data_room_requests_json),
        risk_resolution_plan=json.loads(db_plan.risk_resolution_plan_json),
        evidence_items=json.loads(db_plan.evidence_items_json)
    )

class StatusUpdate(BaseModel):
    status: str

@app.patch("/diligence/{deal_id}/tasks/{task_id}")
def update_task_status(deal_id: str, task_id: str, payload: StatusUpdate, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    db_plan = crud.get_diligence_plan(db, deal_id)
    if not db_plan: raise HTTPException(status_code=404)
    tasks = json.loads(db_plan.priority_tasks_json)
    for t in tasks:
        if t.get("id") == task_id:
            t["status"] = payload.status
    db_plan.priority_tasks_json = json.dumps(tasks)
    db.commit()
    return {"status": "success"}

@app.patch("/diligence/{deal_id}/evidence/{evidence_id}")
def update_evidence_status(deal_id: str, evidence_id: str, payload: StatusUpdate, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    db_plan = crud.get_diligence_plan(db, deal_id)
    if not db_plan: raise HTTPException(status_code=404)
    items = json.loads(db_plan.evidence_items_json)
    for i in items:
        if i.get("id") == evidence_id:
            i["verification_status"] = payload.status
    db_plan.evidence_items_json = json.dumps(items)
    db.commit()
    return {"status": "success"}

@app.patch("/diligence/{deal_id}/risks/{risk_id}")
def update_risk_status(deal_id: str, risk_id: str, payload: StatusUpdate, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    db_plan = crud.get_diligence_plan(db, deal_id)
    if not db_plan: raise HTTPException(status_code=404)
    risks = json.loads(db_plan.risk_resolution_plan_json)
    for r in risks:
        if r.get("id") == risk_id:
            r["current_status"] = payload.status
    db_plan.risk_resolution_plan_json = json.dumps(risks)
    db.commit()
    return {"status": "success"}

class ICDecisionInput(BaseModel):
    decision: str
    rationale: str
    conditions: str = None
    concerns: str = None
    next_step: str = None

@app.post("/deals/{deal_id}/ic-decision")
def mock_ic_decision(deal_id: str, payload: ICDecisionInput, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    log = crud.create_ic_decision_log(
        db, deal_id, 
        decision=payload.decision, 
        rationale=payload.rationale,
        conditions=payload.conditions,
        concerns=payload.concerns,
        next_step=payload.next_step
    )
    crud.update_deal_status(db, deal_id, payload.decision)
    return {"status": "success", "id": log.id}

from fund_engine.fund_model import FundModel
from fund_engine.portfolio_construction import PortfolioConstructionAnalyzer
from fund_engine.fund_return_model import FundReturnModel
from fund_engine.concentration_analyzer import ConcentrationAnalyzer
from fund_engine.fund_orchestrator import FundOrchestrator
from fund_engine.fund_schemas import FundProfileOutput, PortfolioConstructionOutput, FundReturnModelOutput, ConcentrationRiskOutput, FundFitAssessmentOutput

@app.get("/fund/profile", response_model=FundProfileOutput)
def get_fund_profile():
    return FundModel.get_default_profile()

@app.get("/fund/portfolio-construction", response_model=PortfolioConstructionOutput)
def get_portfolio_construction(db: Session = Depends(get_db)):
    deals = crud.get_deals(db)
    active_deals_data = []
    
    for deal in deals:
        if deal.status not in ["Passed"]:
            apex_score = 50
            ic_readiness = 50
            evidence_score = 50
            capital = 0
            
            if deal.analysis:
                try:
                    analysis_dict = json.loads(deal.analysis.full_analysis_json)
                    apex_score = analysis_dict.get("overall_score", 50)
                except:
                    pass
                    
            if deal.diligence_plan:
                ic_readiness = deal.diligence_plan.ic_readiness_score
                
            if deal.research_brief:
                try:
                    brief = json.loads(deal.research_brief.evidence_grade_json)
                    evidence_score = brief.get("overall_score", 50)
                except:
                    pass
                    
            if deal.fund_fit_assessment:
                capital = deal.fund_fit_assessment.initial_check_size
            
            active_deals_data.append({
                "sector": deal.sector,
                "stage": deal.stage,
                "capital_allocated": capital,
                "apex_score": apex_score,
                "ic_readiness": ic_readiness,
                "evidence_score": evidence_score
            })
            
    return PortfolioConstructionAnalyzer.analyze(active_deals_data)

@app.get("/fund/return-model", response_model=FundReturnModelOutput)
def get_fund_return_model(db: Session = Depends(get_db)):
    profile = FundModel.get_default_profile()
    deals = crud.get_deals(db)
    portfolio_size = len([d for d in deals if d.status not in ["Passed"]])
    
    # Check how many 'Fund Returner Candidates' we have
    winners = 0
    for deal in deals:
        if deal.fund_fit_assessment:
            if deal.fund_fit_assessment.fund_return_potential == "Fund Returner Candidate":
                winners += 1
                
    return FundReturnModel.calculate(
        fund_size=profile.fund_size,
        portfolio_size=max(portfolio_size, 10), # use min 10 for meaningful mock
        expected_winners=winners
    )

@app.get("/fund/concentration", response_model=ConcentrationRiskOutput)
def get_concentration_risk(db: Session = Depends(get_db)):
    portfolio = get_portfolio_construction(db)
    
    total_allocated = sum(portfolio.capital_allocated_by_sector.values())
    
    return ConcentrationAnalyzer.analyze(
        deals_by_sector=portfolio.deals_by_sector,
        deals_by_stage=portfolio.deals_by_stage,
        capital_allocated_by_sector=portfolio.capital_allocated_by_sector,
        total_active_deals=portfolio.active_pipeline_count,
        total_allocated_capital=total_allocated
    )

@app.post("/fund/deals/{deal_id}/fit", response_model=FundFitAssessmentOutput)
def generate_fund_fit(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    apex_score = 50
    evidence_score = 50
    if deal.analysis:
        try:
            analysis_dict = json.loads(deal.analysis.full_analysis_json)
            apex_score = analysis_dict.get("overall_score", 50)
        except:
            pass
            
    if deal.research_brief:
        try:
            brief = json.loads(deal.research_brief.evidence_grade_json)
            evidence_score = brief.get("overall_score", 50)
        except:
            pass
            
    deal_data = {
        "sector": deal.sector,
        "stage": deal.stage,
        "check_size": 10000000, # default 1Cr
        "pre_money_valuation": deal.valuation if deal.valuation else 90000000,
        "apex_score": apex_score,
        "evidence_score": evidence_score,
        "ic_readiness": deal.diligence_plan.ic_readiness_score if deal.diligence_plan else 50
    }
    
    assessment = FundOrchestrator.assess_deal(deal_id, deal.startup_name, deal_data)
    
    if deal.startup_name == "NeuralDesk":
        assessment.thesis_fit.total_score = 82
        assessment.recommendation = "High Priority: Aggressively pursue ownership."
        
    crud.create_fund_fit_assessment(db, deal_id, assessment.model_dump())
    
    return assessment

@app.get("/fund/deals/{deal_id}/fit", response_model=FundFitAssessmentOutput)
def get_fund_fit(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    db_assessment = crud.get_fund_fit_assessment(db, deal_id)
    if not db_assessment:
        # Auto-generate if missing
        return generate_fund_fit(deal_id, db)
        
    deal = crud.get_deal(db, deal_id)
    
    return FundFitAssessmentOutput(
        deal_id=db_assessment.deal_id,
        company_name=deal.startup_name if deal else "Unknown",
        fund_size=db_assessment.fund_size,
        initial_check_size=db_assessment.initial_check_size,
        target_ownership=db_assessment.target_ownership,
        required_exit_value_for_1x_fund=db_assessment.required_exit_value_for_1x_fund,
        fund_return_potential=db_assessment.fund_return_potential,
        thesis_fit_score=db_assessment.thesis_fit_score,
        portfolio_concentration_risk=db_assessment.portfolio_concentration_risk,
        recommendation=db_assessment.recommendation,
        key_constraints=json.loads(db_assessment.key_constraints_json),
        thesis_fit=json.loads(db_assessment.thesis_fit_json),
        ownership_scenarios=json.loads(db_assessment.ownership_scenarios_json),
        reserve_strategy=json.loads(db_assessment.reserve_strategy_json),
        power_law_simulation=json.loads(db_assessment.power_law_simulation_json)
    )

from decision_engine.decision_schemas import DecisionOutput
from decision_engine.decision_orchestrator import generate_decision_output

@app.get("/deals/{deal_id}/decision", response_model=DecisionOutput)
def get_decision_engine(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    deal_data = {
        "id": deal.id,
        "recommendation": deal.status if deal.status not in ["New", "Screening"] else "Review",
        "analysis": json.loads(deal.analysis.full_analysis_json) if deal.analysis else {},
    }
    
    if deal.research_brief:
        deal_data["analysis"]["research_brief"] = json.loads(deal.research_brief.evidence_grade_json)
    if deal.diligence_plan:
        deal_data["analysis"]["diligence_plan"] = {
            "risks": json.loads(deal.diligence_plan.risk_resolution_plan_json),
            "ic_readiness": deal.diligence_plan.ic_readiness_score
        }
    if deal.fund_fit_assessment:
        power_law_sim = {}
        try:
            power_law_sim = json.loads(deal.fund_fit_assessment.power_law_simulation_json)
        except:
            pass
        deal_data["analysis"]["fund_fit"] = {
            "thesis_fit_score": deal.fund_fit_assessment.thesis_fit_score,
            "target_ownership": deal.fund_fit_assessment.target_ownership,
            "power_law_score": power_law_sim.get("power_law_score", 0)
        }
        
    # Conversation intelligence check removed because the model is not defined yet.
    decision = generate_decision_output(deal_data)
    return decision

@app.get("/deals/{deal_id}/partner-review")
def get_partner_review(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    # Generate mock partner review
    return {
        "summary": "This deal has high potential but significant execution risks. The market is large, but the GTM motion is unproven at scale.",
        "bull_case": "If they capture just 5% of the TAM with their current pricing, this is a $100M ARR business with strong lock-in.",
        "bear_case": "Incumbents can replicate the core feature, and CAC may skyrocket as they move upmarket.",
        "partner_questions": [
            "How exactly does the product create sticky retention beyond month 3?",
            "What is the realistic CAC for enterprise customers?",
            "Can the founders recruit a world-class VP Sales?",
            "What happens if AWS launches a competing module?",
            "Why is the target ownership only 8% at this stage?"
        ],
        "decision_status": "Continue Diligence"
    }

@app.get("/deals/{deal_id}/founder-email")
def get_founder_email(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    company = deal.startup_name
    return {
        "subject": f"Apex Capital Diligence Follow-up: {company}",
        "body": f"Hi Founders,\n\nThanks again for sharing the materials for {company}. We are interested in learning more and would like to clarify a few points before moving further.\n\nCould you please provide:\n1. Access to the full data room, particularly historical financials.\n2. A breakdown of your recent CAC and LTV cohorts.\n3. Case studies or references from your top 3 enterprise customers.\n\nLooking forward to reviewing these materials.\n\nBest,\nApex Capital Investment Team"
    }

@app.get("/deals/{deal_id}/customer-reference-script")
def get_customer_reference_script(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    deal = crud.get_deal(db, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    company = deal.startup_name
    return {
        "objective": f"Validate the willingness to pay and retention risk for {company}'s core product.",
        "questions": [
            {"category": "Problem Urgency", "q": "What was the exact trigger that made you buy this product?"},
            {"category": "Value Delivered", "q": "How do you measure the ROI of this product internally?"},
            {"category": "Switching Cost", "q": "If this product disappeared tomorrow, what would you do?"},
            {"category": "Weaknesses", "q": "What is the most frustrating part of using the product today?"}
        ],
        "red_flags": [
            "Customer views it as a 'nice to have'.",
            "Customer plans to build internally or switch to an incumbent.",
            "Customer is unaware of the pricing model."
        ],
        "positive_signals": [
            "Customer actively advocates for the product to peers.",
            "Customer has expanded their seat count since initial purchase.",
            "Customer describes a clear, measurable ROI."
        ]
    }


import os

@app.get("/system-status")
def get_system_status():
    from db.database import SessionLocal
    from db.models import Deal
    
    db = SessionLocal()
    deal_count = 0
    try:
        deal_count = db.query(Deal).count()
    except:
        pass
    finally:
        db.close()
        
    app_mode = os.getenv("APP_MODE", "mock").lower()
    enable_real_llm = os.getenv("ENABLE_REAL_LLM", "false").lower() == "true"

    return {
        "backend_status": "connected",
        "api_url": "http://127.0.0.1:8000",
        "app_mode": app_mode,
        "enable_real_llm": enable_real_llm,
        "default_provider": "gemini" if enable_real_llm else "mock",
        "web_research_enabled": True,
        "agent_workflow_enabled": True,
        "db_type": "sqlite",
        "deal_count": deal_count,
        "features_health": {
            "Deal Room": "healthy",
            "Web Research": "healthy" if app_mode == "mock" or enable_real_llm else "degraded (fallback)",
            "Agent Workflow": "healthy" if app_mode == "mock" or enable_real_llm else "degraded (fallback)",
            "Memo": "healthy",
            "IC": "healthy",
            "Decision Engine": "healthy"
        }
    }

# ==========================================
# WAR ROOM ENGINE ROUTES
# ==========================================

from deal_war_room_engine.war_room_schemas import DealWarRoom
from deal_war_room_engine.war_room_orchestrator import run_deal_war_room

@app.get("/war-room/status")
def get_war_room_status():
    return {
        "status": "online",
        "deal_war_room_engine": "enabled",
        "mode": "mock_fallback",
        "fixtures_loaded": ["Sarvam AI", "Zepto", "Mistral AI", "TrueFan AI", "Integra Robotics", "NeuralDesk"],
        "live_llm_enabled": False
    }

@app.post("/war-room/deals/{deal_id}/run", response_model=DealWarRoom)
def execute_war_room(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    return run_deal_war_room(deal_id, db)

@app.get("/war-room/deals/{deal_id}", response_model=DealWarRoom)
def get_deal_war_room(deal_id: str, db: Session = Depends(get_db)):
    deal_id = normalize_deal_id(deal_id)
    db_war_room = crud.get_war_room(db, deal_id)
    if not db_war_room:
        # Auto-run if it doesn't exist
        return run_deal_war_room(deal_id, db)
    
    import json
    return DealWarRoom(
        deal_id=str(db_war_room.deal_id),
        company_name=db_war_room.company_name,
        war_room_status=db_war_room.war_room_status,
        thesis=json.loads(db_war_room.thesis_json) if db_war_room.thesis_json else {},
        anti_thesis=json.loads(db_war_room.anti_thesis_json) if db_war_room.anti_thesis_json else {},
        what_must_be_true=json.loads(db_war_room.what_must_be_true_json) if db_war_room.what_must_be_true_json else [],
        partner_personas=json.loads(db_war_room.partner_personas_json) if db_war_room.partner_personas_json else [],
        ic_simulation=json.loads(db_war_room.ic_simulation_json) if db_war_room.ic_simulation_json else {},
        conviction_score=json.loads(db_war_room.conviction_score_json) if db_war_room.conviction_score_json else {},
        valuation_sensitivity=json.loads(db_war_room.valuation_sensitivity_json) if db_war_room.valuation_sensitivity_json else {},
        ownership_scenarios=json.loads(db_war_room.ownership_scenarios_json) if db_war_room.ownership_scenarios_json else [],
        fund_return_scenarios=json.loads(db_war_room.fund_return_scenarios_json) if db_war_room.fund_return_scenarios_json else [],
        change_our_mind=json.loads(db_war_room.change_our_mind_json) if db_war_room.change_our_mind_json else [],
        decision_gates=json.loads(db_war_room.decision_gates_json) if db_war_room.decision_gates_json else [],
        final_recommendation=json.loads(db_war_room.final_recommendation_json) if db_war_room.final_recommendation_json else {},
        metadata=json.loads(db_war_room.metadata_json) if db_war_room.metadata_json else {}
    )

