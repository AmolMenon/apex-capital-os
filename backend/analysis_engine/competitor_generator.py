import json

def generate_competitors(sector):
    sector = sector.lower()
    competitors = []
    
    if 'ai' in sector or 'saas' in sector:
        competitors = [
            {"name": "LegacyCorp", "category": "Incumbent", "strength": "Distribution, capital", "weakness": "Slow, poor UI, tech debt", "why_we_win": "10x better UX, modern stack"},
            {"name": "FastStartup", "category": "Startup", "strength": "Agility, modern tech", "weakness": "Low capital, no enterprise features", "why_we_win": "Better GTM, enterprise-ready"}
        ]
    elif 'fintech' in sector:
        competitors = [
            {"name": "BigBank", "category": "Incumbent", "strength": "Trust, balance sheet", "weakness": "Regulatory burden, slow innovation", "why_we_win": "API-first, developer friendly"},
            {"name": "Stripe/Plaid", "category": "Giant", "strength": "Platform effects", "weakness": "Not specialized", "why_we_win": "Niche focus, verticalized"}
        ]
    else:
        competitors = [
            {"name": "Status Quo (Excel/Pen & Paper)", "category": "Behavior", "strength": "Zero friction, free", "weakness": "Unscalable, error-prone", "why_we_win": "Automated, collaborative"},
            {"name": "Fragmented Point Solutions", "category": "Current Market", "strength": "Cheap", "weakness": "Siloed data", "why_we_win": "All-in-one system of record"}
        ]
        
    return json.dumps(competitors)
