def generate_market_research(deal_dict: dict) -> dict:
    sector = str(deal_dict.get('sector', '')).lower()
    
    if 'ai' in sector or 'saas' in sector:
        drivers = ["Automation pressure", "Enterprise AI adoption", "Workflow fragmentation"]
        constraints = ["Data privacy regulation", "Incumbent bundling", "Change management friction"]
        maturity = "Rapid growth"
        why_now = ["Commoditization of foundational models", "APIs have reached enterprise reliability", "Tightening labor markets demanding efficiency"]
        score = 85
    elif 'pet' in sector or 'consumer' in sector:
        drivers = ["Pet humanization", "Premium nutrition awareness", "Preventive care shift"]
        constraints = ["Discretionary spending cuts", "High CAC via Meta/Google", "Supply chain fragility"]
        maturity = "Competitive growth"
        why_now = ["Post-COVID pet ownership spike", "Maturation of D2C logistics", "Veterinary labor shortages driving telehealth"]
        score = 75
    elif 'climate' in sector:
        drivers = ["Compliance pressure", "Scope 3 reporting mandates", "Supplier emissions transparency"]
        constraints = ["Long enterprise sales cycles", "Lack of standardized frameworks", "Budget sensitivity"]
        maturity = "Emerging"
        why_now = ["New SEC/EU regulations", "Corporate net-zero pledges coming due", "Better satellite/sensor data availability"]
        score = 88
    elif 'fintech' in sector:
        drivers = ["Merchant digitization", "Embedded finance trends", "Credit access gaps"]
        constraints = ["Regulatory scrutiny", "High cost of capital", "Incumbent bank defensive maneuvers"]
        maturity = "Competitive growth"
        why_now = ["BaaS infrastructure maturation", "SME demand for integrated tools", "Rising rates squeezing traditional lenders"]
        score = 72
    elif 'bio' in sector or 'deeptech' in sector:
        drivers = ["Falling sequencing costs", "Translational research advances", "Biomarker discovery needs"]
        constraints = ["FDA regulatory hurdles", "High R&D burn", "Binary clinical risk"]
        maturity = "Emerging"
        why_now = ["Convergence of AI and biology", "CRISPR maturation", "Pharma pipeline cliffs forcing acquisitions"]
        score = 90
    else:
        drivers = ["Digital transformation", "Remote work enablement", "Cost reduction"]
        constraints = ["Budget tightening", "Incumbent inertia", "Integration friction"]
        maturity = "Mature"
        why_now = ["Legacy system end-of-life", "Macro pressure on efficiency", "API ecosystem growth"]
        score = 65

    return {
        "category": deal_dict.get('sector', 'Software'),
        "maturity": maturity,
        "drivers": drivers,
        "constraints": constraints,
        "why_now_analysis": why_now,
        "attractiveness_score": score
    }
