def detect_risks(deal_dict: dict) -> list:
    risks = []
    
    founder_bg = deal_dict.get('founder_background') or ""
    if len(founder_bg) < 20:
        risks.append({"severity": "High", "risk": "Weak or unclear founder background"})
        
    gross_margin = deal_dict.get('gross_margin')
    if gross_margin and gross_margin < 40:
        risks.append({"severity": "High", "risk": f"Poor gross margin ({gross_margin}%)"})
        
    cac = deal_dict.get('cac')
    ltv = deal_dict.get('ltv')
    if cac and ltv and ltv / cac < 2:
        risks.append({"severity": "Critical", "risk": f"Weak unit economics (LTV/CAC = {round(ltv/cac, 1)})"})
        
    competitors = deal_dict.get('competitors') or ""
    if len(competitors) < 10:
        risks.append({"severity": "Medium", "risk": "Lack of clear competitive landscape analysis"})
        
    revenue = deal_dict.get('revenue')
    valuation = deal_dict.get('valuation')
    if revenue and valuation and revenue > 0:
        multiple = valuation / revenue
        if multiple > 100:
            risks.append({"severity": "Critical", "risk": f"Extremely high valuation multiple ({round(multiple, 1)}x)"})
        elif multiple > 50:
            risks.append({"severity": "High", "risk": f"High valuation multiple ({round(multiple, 1)}x)"})

    retention_rate = deal_dict.get('retention_rate')
    if retention_rate and retention_rate < 80:
        risks.append({"severity": "High", "risk": "Low retention rate indicates leaky bucket"})
        
    stage = (deal_dict.get('stage') or "").lower()
    if stage in ['seed', 'series a'] and not revenue:
        risks.append({"severity": "Medium", "risk": "Pre-revenue at an advanced stage"})

    if not risks:
        risks.append({"severity": "Low", "risk": "Execution risk inherent to early stage startups"})
        
    return risks
