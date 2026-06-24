def generate_competitor_research(deal_dict: dict) -> dict:
    sector = str(deal_dict.get('sector', '')).lower()
    
    competitors = []
    if 'ai' in sector or 'saas' in sector:
        competitors = [
            {"name": "UiPath / Automation Anywhere", "type": "Incumbent", "scale": "$1B+ ARR", "strengths": "Deep enterprise penetration", "weaknesses": "Legacy tech, high implementation cost", "pricing_model": "Enterprise License", "distribution_advantage": "SI Partnerships", "why_choose": "Safe choice", "why_switch": "Too slow to deploy", "threat_level": "High"},
            {"name": "Scale AI", "type": "Direct", "scale": "$500M+ ARR", "strengths": "Brand, capital", "weaknesses": "Horizontal focus", "pricing_model": "Usage-based", "distribution_advantage": "Developer mindshare", "why_choose": "API ease", "why_switch": "Lack of vertical workflow", "threat_level": "Critical"}
        ]
        ws = "Verticalized workflows combining data ingestion and action, bypassing generic RPA."
    elif 'climate' in sector:
        competitors = [
            {"name": "Watershed", "type": "Direct", "scale": "$100M+ ARR", "strengths": "Brand, capital", "weaknesses": "Expensive, top-down focus", "pricing_model": "SaaS", "distribution_advantage": "Top-tier VC network", "why_choose": "Market leader", "why_switch": "Need deeper supplier integrations", "threat_level": "Critical"},
            {"name": "Internal Excel", "type": "Substitute", "scale": "N/A", "strengths": "Free, customizable", "weaknesses": "Error-prone, unscalable", "pricing_model": "N/A", "distribution_advantage": "Already installed", "why_choose": "Status quo", "why_switch": "Audit failure", "threat_level": "Medium"}
        ]
        ws = "Bottom-up, API-driven supplier data integration rather than top-down estimated averages."
    else:
        competitors = [
            {"name": "LegacyCorp", "type": "Incumbent", "scale": "$5B Market Cap", "strengths": "Distribution, Balance Sheet", "weaknesses": "Tech debt, UX", "pricing_model": "Per Seat", "distribution_advantage": "Field Sales", "why_choose": "Bundled pricing", "why_switch": "Need modern UX", "threat_level": "Medium"},
            {"name": "FastFollower.io", "type": "Direct", "scale": "$10M ARR", "strengths": "Agility", "weaknesses": "No moat", "pricing_model": "Freemium", "distribution_advantage": "PLG", "why_choose": "Cheap", "why_switch": "Lacks enterprise security", "threat_level": "High"}
        ]
        ws = "Premium enterprise tier with consumer-grade UX."

    return {
        "competitors": competitors,
        "competitive_intensity_score": 85 if 'ai' in sector else 70,
        "white_space_analysis": ws,
        "defensibility_assessment": "Moderate early on. True defensibility requires embedding deeply into the system of record or creating a proprietary data asset.",
        "incumbent_response_risk": "High. Incumbents will likely attempt to bundle a 'good enough' version into existing enterprise agreements."
    }
