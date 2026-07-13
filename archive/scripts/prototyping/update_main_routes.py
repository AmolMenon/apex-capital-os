import re

with open("backend/main.py", "r") as f:
    content = f.read()

if "from backend.routes.agent_workflow import router as agent_workflow_router" not in content:
    content = content.replace(
        "from backend.routes.web_research import router as web_research_router",
        "from backend.routes.web_research import router as web_research_router\nfrom backend.routes.agent_workflow import router as agent_workflow_router"
    )
    
    content = content.replace(
        'app.include_router(web_research_router, prefix="/web-research", tags=["web_research"])',
        'app.include_router(web_research_router, prefix="/web-research", tags=["web_research"])\napp.include_router(agent_workflow_router, prefix="/agent-workflow", tags=["agent_workflow"])'
    )
    
    with open("backend/main.py", "w") as f:
        f.write(content)
