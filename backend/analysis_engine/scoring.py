def generate_scorecard(deal_dict: dict) -> dict:
    scores = {}
    
    market_size = deal_dict.get('market_size')
    if market_size:
        if market_size > 10000:
            scores['market_size_score'] = 10
        elif market_size > 5000:
            scores['market_size_score'] = 8
        elif market_size > 1000:
            scores['market_size_score'] = 6
        else:
            scores['market_size_score'] = 4
    else:
        scores['market_size_score'] = 5

    timing_keywords = ['ai', 'climate', 'sustainability', 'healthtech', 'automation', 'embedded']
    desc = (deal_dict.get('description') or "").lower()
    if any(k in desc for k in timing_keywords):
        scores['market_timing_score'] = 8
    else:
        scores['market_timing_score'] = 5

    fb = (deal_dict.get('founder_background') or "").lower()
    if 'serial' in fb or 'exited' in fb or 'phd' in fb or 'stanford' in fb or 'mit' in fb:
        scores['founder_quality_score'] = 9
    elif len(fb) > 50:
        scores['founder_quality_score'] = 7
    else:
        scores['founder_quality_score'] = 5

    scores['founder_market_fit_score'] = min(10, scores['founder_quality_score'] + (1 if deal_dict.get('sector', '').lower() in fb else 0))

    pd = (deal_dict.get('description') or "").lower()
    if 'proprietary' in pd or 'patent' in pd or 'unique' in pd or 'first' in pd:
        scores['product_differentiation_score'] = 8
    else:
        scores['product_differentiation_score'] = 6

    revenue = deal_dict.get('revenue')
    mrr = deal_dict.get('mrr')
    users = deal_dict.get('users')
    stage = deal_dict.get('stage', '')
    
    if revenue and revenue > 1000000:
        scores['traction_quality_score'] = 9
    elif mrr and mrr > 50000:
        scores['traction_quality_score'] = 8
    elif users and users > 10000:
        scores['traction_quality_score'] = 7
    elif stage.lower() == 'idea':
        scores['traction_quality_score'] = 4
    else:
        scores['traction_quality_score'] = 5

    gross_margin = deal_dict.get('gross_margin')
    business_model = (deal_dict.get('business_model') or "").lower()
    if gross_margin:
        if gross_margin > 80:
            scores['business_model_score'] = 9
        elif gross_margin > 60:
            scores['business_model_score'] = 7
        else:
            scores['business_model_score'] = 5
    elif 'saas' in business_model:
        scores['business_model_score'] = 8
    else:
        scores['business_model_score'] = 6

    if 'network effect' in pd or 'viral' in pd or 'community' in pd:
        scores['distribution_score'] = 8
    elif 'b2b' in business_model:
        scores['distribution_score'] = 6
    else:
        scores['distribution_score'] = 5

    if 'data' in pd or 'network effect' in pd or 'deeptech' in business_model:
        scores['moat_score'] = 8
    else:
        scores['moat_score'] = 5

    if scores['market_size_score'] >= 8 and scores['traction_quality_score'] >= 7:
        scores['exit_score'] = 8
    else:
        scores['exit_score'] = 6

    return scores
