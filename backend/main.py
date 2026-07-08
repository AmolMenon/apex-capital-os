from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
from db.database import engine, Base

# Import Routers
from auth.routes import router as auth_router
from routes.decisions import router as decisions_router
from routes.domains import router as domains_router
from routes.evidence import router as evidence_router
from routes.reasoning import router as reasoning_router
from routes.execution import router as execution_router

from routes.users import router as users_router
from routes.workspace import router as workspace_router
from routes.memory import router as memory_router

# Import Middleware
from core.logging_middleware import LoggingMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import db.models as models

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Apex Decision Intelligence OS API",
    version="5.0.0",
    description="Production-grade API for Apex Decision Intelligence OS, a universal platform for high-stakes decisions.",
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
app.include_router(decisions_router, prefix=f"{api_prefix}/decisions", tags=["Decisions"])
app.include_router(domains_router, prefix=f"{api_prefix}/domains", tags=["Domain Packs"])
app.include_router(evidence_router, prefix=f"{api_prefix}/decisions", tags=["Evidence"])
app.include_router(reasoning_router, prefix=f"{api_prefix}/decisions", tags=["Reasoning"])
app.include_router(execution_router, prefix=f"{api_prefix}/decisions", tags=["Execution"])
app.include_router(workspace_router, prefix=f"{api_prefix}/workspace", tags=["Workspace"])
app.include_router(memory_router, prefix=f"{api_prefix}", tags=["Memory"])

@app.get(f"{api_prefix}/health", tags=["System"])
def health_check():
    from core.config import settings
    return {"status": "ok", "version": "5.0.0", "llm_mode": settings.APEX_LLM_MODE}

@app.get("/", include_in_schema=False)
def root_health_check():
    return {"status": "ok", "service": "Apex Capital OS API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
