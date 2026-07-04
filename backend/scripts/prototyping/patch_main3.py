import re

with open("backend/main.py", "r") as f:
    content = f.read()

imports = """
from routes.web_research import router as web_research_router
from routes.agent_workflow import router as agent_workflow_router
from routes.copilot import router as copilot_router
"""

content = re.sub(r'from routes\.conversation import router as conversation_router\n', 'from routes.conversation import router as conversation_router\n' + imports, content)

with open("backend/main.py", "w") as f:
    f.write(content)
