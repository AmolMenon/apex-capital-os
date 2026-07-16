from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
from db.database import engine, Base

# Import Routers
from auth.routes import router as auth_router
from routes.decisions import router as decisions_router
from routes.evidence import router as evidence_router
from routes.reasoning import router as reasoning_router
from routes.execution import router as execution_router
from routes.investor_review import router as investor_review_router
from routes.events import router as events_router
from core.connectors.mock_news import MockNewsConnector
import asyncio

from routes.users import router as users_router

# Import Middleware
from core.logging_middleware import LoggingMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import db.models as models
from core.config import settings

# Create DB tables ONLY in development/mock modes, not staging/prod
if settings.APP_ENV in ["development", "test"]:
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Apex Decision Intelligence OS API",
    version="5.0.0",
    description="Production-grade API for Apex Decision Intelligence OS, a universal platform for high-stakes decisions.",
)

# Parse CORS origins
cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")] if settings.CORS_ORIGINS else []

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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
app.include_router(decisions_router, prefix=f"{api_prefix}/decisions", tags=["Decisions"])
app.include_router(evidence_router, prefix=f"{api_prefix}/decisions", tags=["Evidence"])
app.include_router(reasoning_router, prefix=f"{api_prefix}/decisions", tags=["Reasoning"])
app.include_router(execution_router, prefix=f"{api_prefix}/decisions", tags=["Execution"])
app.include_router(investor_review_router, prefix=f"{api_prefix}/decisions", tags=["Investor Review"])
app.include_router(events_router, prefix=f"{api_prefix}/events", tags=["Events"])

@app.get(f"{api_prefix}/health/liveness", tags=["System"])
def liveness_check():
    return {"status": "ok", "service": "Apex Capital OS API"}

from sqlalchemy.sql import text
from db.database import get_db
from sqlalchemy.orm import Session

@app.get(f"{api_prefix}/health/readiness", tags=["System"])
def readiness_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        logger.error(f"Readiness check failed: {str(e)}")
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="Service Unavailable: Database not connected")

@app.get("/", include_in_schema=False)
def root_health_check():
    return {"status": "ok", "service": "Apex Capital OS API"}

from core.connectors.mock_news import MockNewsConnector
from core.connectors.mock_github import MockGitHubConnector
from core.connectors.mock_linkedin import MockLinkedInConnector
from core.connectors.mock_regulatory import MockRegulatoryConnector
from core.connectors.mock_rss import MockRSSConnector

async def background_connector_loop():
    """
    Simulates a daemon that periodically triggers connectors.
    In production, this might be handled by Celery/Temporal/etc.
    """
    connectors = [
        MockNewsConnector(),
        MockGitHubConnector(),
        MockLinkedInConnector(),
        MockRegulatoryConnector(),
        MockRSSConnector()
    ]
    
    while True:
        try:
            # Staggered fetch to simulate real-time irregular events
            for connector in connectors:
                await connector.publish(event_bus)
                await asyncio.sleep(2)
                
            # Wait before next polling cycle
            await asyncio.sleep(10)
        except asyncio.CancelledError:
            logger.info("Connector loop cancelled.")
            break
        except Exception as e:
            logger.error(f"Connector loop error: {e}")

from core.intelligence_engine import setup_intelligence_engine

@app.on_event("startup")
async def startup_event():
    setup_intelligence_engine()
    if settings.APP_ENV in ["development", "test"]:
        asyncio.create_task(background_connector_loop())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
