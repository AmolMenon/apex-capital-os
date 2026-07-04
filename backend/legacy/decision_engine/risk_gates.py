from typing import Dict, Any

def apply_risk_gates(deal: Dict[str, Any], current_recommendation: str) -> Dict[str, Any]:
    # IC Readiness below 70 should block Invest.
    # Critical unresolved risks should block Invest.
    
    ic_readiness = 0
    if deal.get("analysis"):
        dp = deal["analysis"].get("diligence_plan")
        if dp and isinstance(dp, dict):
            ic_readiness = dp.get("ic_readiness", 0)
        elif deal["analysis"].get("one_pager") and isinstance(deal["analysis"]["one_pager"], dict):
            ic_readiness = deal["analysis"]["one_pager"].get("Apex Score", 0)
        elif deal["analysis"].get("apex_score") and isinstance(deal["analysis"]["apex_score"], dict):
            ic_readiness = deal["analysis"]["apex_score"].get("score", 0)

    has_critical_risks = False
    blocking_risks = []
    
    if deal.get("analysis"):
        dp = deal["analysis"].get("diligence_plan")
        if dp and isinstance(dp, dict):
            risks = dp.get("risks", [])
            if isinstance(risks, list):
                for r in risks:
                    if isinstance(r, dict) and r.get("severity") == "High" and not r.get("is_resolved", False):
                        has_critical_risks = True
                        blocking_risks.append(r.get("description"))

    # Conversation Intelligence Checks
    founder_credibility = 100
    contradiction_risk = 0
    
    if deal.get("analysis"):
        conv = deal["analysis"].get("conversation")
        if conv and isinstance(conv, dict):
            founder_credibility = conv.get("credibility_score", 100)
            contradiction_risk = conv.get("contradiction_risk_score", 0)

    new_rec = current_recommendation
    is_blocked = False
    reasons = []

    if current_recommendation in ["Invest", "IC Ready"]:
        if ic_readiness < 70:
            new_rec = "Needs Diligence"
            is_blocked = True
            reasons.append(f"IC Readiness is {ic_readiness}, below 70.")
        if has_critical_risks:
            new_rec = "Needs Diligence"
            is_blocked = True
            reasons.append("Critical unresolved risks exist.")
        if founder_credibility < 50:
            new_rec = "Needs Diligence"
            is_blocked = True
            reasons.append(f"Founder credibility is critically low ({founder_credibility}).")
        if contradiction_risk > 50:
            new_rec = "Needs Diligence"
            is_blocked = True
            reasons.append(f"High contradiction risk ({contradiction_risk}) between pitch claims and conversation reality.")

    return {
        "calibrated_recommendation": new_rec,
        "is_blocked": is_blocked,
        "reason": " | ".join(reasons) if reasons else "Risk profile passes gates.",
        "blocking_issues": blocking_risks if has_critical_risks else []
    }
