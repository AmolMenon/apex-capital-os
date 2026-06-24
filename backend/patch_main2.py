import re

with open("backend/main.py", "r") as f:
    content = f.read()

content = re.sub(r'from routes\.metrics import router as metrics_router\n', '', content)
content = re.sub(r'app\.include_router\(metrics_router, prefix="/api/metrics", tags=\\["Metrics"\\]\)\n', '', content)

with open("backend/main.py", "w") as f:
    f.write(content)
