from typing import Dict, Any
from .evidence_gates import apply_evidence_gates
from .risk_gates import apply_risk_gates
from .fund_fit_gates import apply_fund_fit_gates

def calibrate_recommendation(deal: Dict[str, Any]) -> Dict[str, Any]:
    # Start with base recommendation
    base_rec = deal.get("recommendation", "Review")
    
    # 1. Evidence
    ev_res = apply_evidence_gates(deal, base_rec)
    rec1 = ev_res["calibrated_recommendation"]

    # 2. Risk
    risk_res = apply_risk_gates(deal, rec1)
    rec2 = risk_res["calibrated_recommendation"]

    # 3. Fund Fit
    ff_res = apply_fund_fit_gates(deal, rec2)
    final_rec = ff_res["calibrated_recommendation"]

    # Aggregate reasons
    reasons = []
    if ev_res.get("is_capped"): reasons.append(ev_res["reason"])
    if risk_res.get("is_blocked"): reasons.append(risk_res["reason"])
    if ff_res.get("is_downgraded"): reasons.append(ff_res["reason"])

    if not reasons:
        reasons.append("All gates passed. Strong thesis and evidence.")

    return {
        "final_recommendation": final_rec,
        "base_recommendation": base_rec,
        "evidence_gaps": ev_res.get("evidence_gaps", []),
        "blocking_issues": risk_res.get("blocking_issues", []),
        "reasons": reasons
    }
