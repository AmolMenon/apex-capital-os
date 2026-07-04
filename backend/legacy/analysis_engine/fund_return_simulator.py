def simulate_fund_return(deal: dict) -> dict:
    fund_size_m = 100.0 # Default $100M fund
    entry_valuation_m = deal.get("valuation", 20.0) or 20.0
    investment_amount_m = 2.0 # Default $2M check
    
    # Simple ownership math (ignoring dilution)
    ownership_percentage = (investment_amount_m / entry_valuation_m) * 100
    
    # Assume a standard exit for this exercise, or something based on stage
    exit_valuation_m = 500.0 if deal.get("stage") == "Seed" else 1000.0
    
    return_to_fund_m = exit_valuation_m * (ownership_percentage / 100)
    moic = return_to_fund_m / investment_amount_m
    fund_returned_percentage = (return_to_fund_m / fund_size_m) * 100
    
    if return_to_fund_m >= fund_size_m:
        verdict = "Fund Returner"
    elif return_to_fund_m >= (fund_size_m * 0.5):
        verdict = "Major Outcome"
    elif return_to_fund_m >= (fund_size_m * 0.1):
        verdict = "Meaningful Outcome"
    else:
        verdict = "Does Not Move Fund"
        
    return {
        "fund_size_m": fund_size_m,
        "entry_valuation_m": entry_valuation_m,
        "exit_valuation_m": exit_valuation_m,
        "ownership_percentage": round(ownership_percentage, 2),
        "return_to_fund_m": round(return_to_fund_m, 2),
        "moic": round(moic, 1),
        "fund_returned_percentage": round(fund_returned_percentage, 1),
        "verdict": verdict
    }
