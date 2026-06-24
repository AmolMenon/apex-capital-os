from typing import Dict, Any

def apply_evidence_gates(deal: Dict[str, Any], current_recommendation: str) -> Dict[str, Any]:
    # Evidence Score below 60 should cap recommendation at Watchlist or Needs Diligence.
    evidence_score = 0
    
    # Try parsing evidence_score
    if deal.get("analysis") and deal["analysis"].get("research_brief"):
        research = deal["analysis"]["research_brief"]
        if isinstance(research, dict):
            evidence_score = research.get("overall_score", 0)

    is_capped = False
    new_rec = current_recommendation

    if evidence_score < 60 and current_recommendation in ["Invest", "IC Ready", "Proceed to Diligence"]:
        new_rec = "Needs Diligence"
        is_capped = True

    return {
        "calibrated_recommendation": new_rec,
        "is_capped": is_capped,
        "reason": f"Evidence score is {evidence_score}, which is below 60." if is_capped else "Evidence passes gates.",
        "evidence_gaps": ["Weak evidence score requires further validation."] if is_capped else []
    }
