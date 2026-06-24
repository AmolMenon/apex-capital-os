with open("backend/main.py", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "metrics_router" in line:
        continue
    if "from routes.portfolio import router as portfolio_router" in line and len([l for l in new_lines if "portfolio_router" in l]) > 0:
        continue # Remove duplicate imports
    if "app.include_router(portfolio_router" in line and len([l for l in new_lines if "app.include_router(portfolio_router" in l]) > 0:
        continue # Remove duplicate includes
    new_lines.append(line)

with open("backend/main.py", "w") as f:
    f.writelines(new_lines)
