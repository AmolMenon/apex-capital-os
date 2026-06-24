def generate_exit_analysis(deal_dict: dict, fund_return_data: dict) -> dict:
    entry_val = fund_return_data.get('entry_valuation_m', 20.0)
    
    # Bear case
    bear_val = entry_val * 0.5
    bear_moic = 0.5
    
    # Base case
    base_val = entry_val * 5.0
    base_moic = 5.0
    
    # Bull case
    bull_val = entry_val * 25.0
    bull_moic = 25.0
    
    scenarios = [
        {
            "case_type": "Bear Case",
            "exit_valuation_m": bear_val,
            "probability_percentage": 20,
            "return_multiple": bear_moic,
            "reason": "Fails to reach scale; acqui-hire or distressed asset sale to an incumbent."
        },
        {
            "case_type": "Base Case",
            "exit_valuation_m": base_val,
            "probability_percentage": 60,
            "return_multiple": base_moic,
            "reason": "Solid growth but hits a TAM ceiling; acquired by a mid-cap PE firm or strategic buyer."
        },
        {
            "case_type": "Bull Case",
            "exit_valuation_m": bull_val,
            "probability_percentage": 20,
            "return_multiple": bull_moic,
            "reason": "Becomes the category-defining platform with unassailable network effects."
        }
    ]
    
    sector = str(deal_dict.get('sector', '')).lower()
    if 'health' in sector or 'bio' in sector:
        acquirers = ["Johnson & Johnson", "Roche", "Novartis", "Teladoc"]
    elif 'fintech' in sector:
        acquirers = ["Stripe", "Visa", "Mastercard", "JPMorgan"]
    elif 'climate' in sector:
        acquirers = ["NextEra", "BP", "Shell", "Brookfield"]
    else:
        acquirers = ["Microsoft", "Salesforce", "Oracle", "Private Equity"]
        
    return {
        "scenarios": scenarios,
        "potential_acquirers": acquirers,
        "ipo_likelihood": "Low (requires $100M+ ARR and strong macro conditions)",
        "strategic_logic": "Incumbents will buy rather than build to capture the modern workflow and data.",
        "exit_constraints": "May require significant capital to reach exit velocity, risking heavy dilution."
    }
