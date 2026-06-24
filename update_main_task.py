import re

with open("backend/main.py", "r") as f:
    content = f.read()

injection = """    deal_dict = {
        "id": deal.id,
        "startup_name": deal.startup_name,
        "sector": deal.sector,
        "description": deal.description,
        "revenue": deal.revenue,
        "metrics": deal.description, # using description as proxy
        "is_public_benchmark": deal.is_public_benchmark,
    }
    
    # Inject Web Research if available
    from models import WebResearchBriefModel
    import json
    web_brief = db.query(WebResearchBriefModel).filter_by(deal_id=deal.id).first()
    if web_brief:
        deal_dict["web_research"] = {
            "source_quality_score": web_brief.source_quality_score,
            "public_data_confidence": web_brief.public_data_confidence,
            "verified_public_facts": json.loads(web_brief.claims_json), # simple proxy for now
            "source_conflicts": json.loads(web_brief.conflicts_json),
            "unknown_private_metrics": json.loads(web_brief.unknown_metrics_json),
            "vc_synthesis": json.loads(web_brief.synthesis_json)
        }
"""

if "Inject Web Research if available" not in content:
    content = re.sub(r'    deal_dict = \{[\s\S]*?\}', injection, content, count=1)

with open("backend/main.py", "w") as f:
    f.write(content)
