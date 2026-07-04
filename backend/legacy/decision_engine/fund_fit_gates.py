from typing import Dict, Any

def apply_fund_fit_gates(deal: Dict[str, Any], current_recommendation: str) -> Dict[str, Any]:
    # Weak fund fit should downgrade recommendation even if the company is good.
    # Low ownership feasibility should flag “good company, weak fund outcome.”

    thesis_fit_score = 0
    target_ownership = 0.0

    if deal.get("analysis") and deal["analysis"].get("fund_fit"):
        fit = deal["analysis"]["fund_fit"]
        thesis_fit_score = fit.get("thesis_fit_score", 0)
        target_ownership = fit.get("target_ownership", 0.0)

    is_downgraded = False
    reasons = []
    signals = []
    new_rec = current_recommendation

    if thesis_fit_score < 50:
        if current_recommendation in ["Invest", "IC Ready", "Proceed to Diligence"]:
            new_rec = "Watchlist"
            is_downgraded = True
            reasons.append("Thesis fit score is weak.")
    
    if target_ownership < 0.05 and current_recommendation in ["Invest", "IC Ready"]:
        reasons.append("Low ownership feasibility: good company, weak fund outcome.")
        new_rec = "Watchlist"
        is_downgraded = True
        
    return {
        "calibrated_recommendation": new_rec,
        "is_downgraded": is_downgraded,
        "reason": " | ".join(reasons) if reasons else "Fund fit passes gates.",
        "signals": signals
    }
