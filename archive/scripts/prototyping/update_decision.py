with open("backend/decision_engine/decision_orchestrator.py", "r") as f:
    content = f.read()

injection = """    # Web Research Impact
    web_research = deal.get("web_research", {})
    if web_research:
        if web_research.get("source_quality_score", 0) > 80:
            positive_signals.append("High source quality for public claims")
        
        conflicts = web_research.get("source_conflicts", [])
        if conflicts:
            calibrated["blocking_issues"].append(f"{len(conflicts)} source conflict(s) detected. Verification needed.")
            
        if is_public_benchmark:
            calibrated["final_recommendation"] = web_research.get("vc_synthesis", {}).get("vc_benchmark_conclusion", "Public benchmark conclusion")
"""

if "# Web Research Impact" not in content:
    content = content.replace("    # Construct What Would Change Our Mind", injection + "\n    # Construct What Would Change Our Mind")

with open("backend/decision_engine/decision_orchestrator.py", "w") as f:
    f.write(content)
