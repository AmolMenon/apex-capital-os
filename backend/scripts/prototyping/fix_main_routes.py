with open("main.py", "r") as f:
    content = f.read()

import re

# Add the imports if missing
if "from routes.web_research import router as web_research_router" not in content:
    content = content.replace("from routes.storage import router as storage_router", "from routes.storage import router as storage_router\nfrom routes.web_research import router as web_research_router\nfrom routes.agent_workflow import router as agent_workflow_router")
    
if "app.include_router(agent_workflow_router" not in content:
    content = content.replace('app.include_router(web_research_router, prefix="/web-research", tags=["Web Research"])', 'app.include_router(web_research_router, prefix="/web-research", tags=["Web Research"])\napp.include_router(agent_workflow_router, prefix="/agent-workflow", tags=["Agent Workflow"])')

with open("main.py", "w") as f:
    f.write(content)
