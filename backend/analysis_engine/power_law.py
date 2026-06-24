def calculate_power_law_score(deal_dict: dict) -> float:
    score = 0.0
    
    market_size = deal_dict.get("market_size") or 0
    if market_size > 10000:
        score += 4.0
    elif market_size > 5000:
        score += 2.0
        
    desc = (deal_dict.get("description") or "").lower()
    if "network effect" in desc or "platform" in desc or "marketplace" in desc:
        score += 3.0
        
    bm = (deal_dict.get("business_model") or "").lower()
    if "saas" in bm or "api" in bm:
        score += 3.0
        
    return min(10.0, score)
