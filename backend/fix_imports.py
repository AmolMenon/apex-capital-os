with open("main.py", "r") as f:
    content = f.read()

import re

injection = """from auth.routes import router as auth_router
from storage.routes import router as storage_router
from routes.web_research import router as web_research_router
from routes.agent_workflow import router as agent_workflow_router"""

content = content.replace(
    "from auth.routes import router as auth_router\nfrom storage.routes import router as storage_router",
    injection
)

if "app.include_router(agent_workflow_router" not in content:
    content = content.replace(
        'app.include_router(web_research_router, prefix="/web-research", tags=["Web Research"])',
        'app.include_router(web_research_router, prefix="/web-research", tags=["Web Research"])\napp.include_router(agent_workflow_router, prefix="/agent-workflow", tags=["Agent Workflow"])'
    )

with open("main.py", "w") as f:
    f.write(content)
