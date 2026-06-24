with open("backend/main.py", "r") as f:
    content = f.read()

import re

injection = """
import os

@app.get("/system-status")
def get_system_status():
    from database import SessionLocal
    from models import DealModel
    
    db = SessionLocal()
    deal_count = 0
    try:
        deal_count = db.query(DealModel).count()
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
"""

if "@app.get(\"/system-status\")" not in content:
    content += "\n" + injection
    with open("backend/main.py", "w") as f:
        f.write(content)
