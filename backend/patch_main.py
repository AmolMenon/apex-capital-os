import re

with open("backend/main.py", "r") as f:
    content = f.read()

# Remove the duplicates I just introduced
content = re.sub(r'from backend\.routes\.web_research import router as web_research_router\nfrom backend\.routes\.copilot import router as copilot_router\nfrom backend\.routes\.sourcing import router as sourcing_router\n', '', content)

content = re.sub(r'app\.include_router\(web_research_router\)\napp\.include_router\(copilot_router\)\napp\.include_router\(sourcing_router\)\napp\.include_router\(portfolio_router, prefix="/api/portfolio", tags=\["Portfolio"\]\)\n', '', content)

content = re.sub(r'app\.include_router\(portfolio_router, prefix="/api", tags=\["Portfolio"\]\)\n', 'app.include_router(portfolio_router, prefix="/api", tags=["Portfolio"])\n', content)

with open("backend/main.py", "w") as f:
    f.write(content)
