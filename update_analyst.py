with open("backend/analysis_engine/analyst_orchestrator.py", "r") as f:
    content = f.read()

injection = """        # Web Research Evidence
        web_research = deal_dict.get("web_research", {})
        if web_research:
            memo['web_research_evidence'] = {
                "source_quality": web_research.get("source_quality_score", 0),
                "verified_facts": web_research.get("verified_public_facts", []),
                "media_reported_facts": web_research.get("media_reported_facts", []),
                "conflicts": web_research.get("source_conflicts", []),
                "unknown_private_metrics": web_research.get("unknown_private_metrics", [])
            }
"""

if "web_research_evidence" not in content:
    content = content.replace("        # Override specific IC pager fields to match deterministic data", injection + "\n        # Override specific IC pager fields to match deterministic data")

with open("backend/analysis_engine/analyst_orchestrator.py", "w") as f:
    f.write(content)
