from typing import Dict, Any, List
from .diligence_schemas import ICReadinessOutput

def calculate_ic_readiness(
    analysis: Dict[str, Any], 
    deck_analysis: Dict[str, Any],
    risk_plan: List[Any],
    evidence_items: List[Any]
) -> ICReadinessOutput:
    """Calculates an IC Readiness score (0-100) based on completion of diligence phases."""
    
    score = 0
    blockers = []
    
    # Base calculation
    # 1. Deal profile completeness & initial score (Max 20)
    base_score = analysis.get("overall_score", 0)
    score += min(20, base_score * 0.2)
    
    # 2. Deck Quality (Max 15)
    deck_score = deck_analysis.get("deck_quality_score", 0)
    if deck_score > 80:
        score += 15
    elif deck_score > 60:
        score += 10
    else:
        score += 5
        blockers.append("Deck quality is low; fundamental information missing.")
        
    # 3. Evidence Quality (Max 25)
    total_evidence = len(evidence_items)
    if total_evidence == 0:
        score += 25 # Assuming no evidence needed yet
    else:
        verified_evidence = sum(1 for e in evidence_items if getattr(e, 'verification_status', '') in ['Verified', 'Received'])
        evidence_ratio = verified_evidence / total_evidence
        score += int(25 * evidence_ratio)
        if evidence_ratio < 0.5:
            blockers.append(f"Only {verified_evidence}/{total_evidence} evidence items collected.")
            
    # 4. Risk Resolution (Max 40)
    total_risks = len(risk_plan)
    if total_risks == 0:
        score += 40
    else:
        resolved_risks = sum(1 for r in risk_plan if getattr(r, 'current_status', '') in ['Resolved', 'Partially Resolved'])
        risk_ratio = resolved_risks / total_risks
        score += int(40 * risk_ratio)
        if risk_ratio < 0.7:
            blockers.append("Too many unresolved risks.")
            
        critical_unresolved = sum(1 for r in risk_plan if getattr(r, 'severity', '') in ['Critical', 'High'] and getattr(r, 'current_status', '') not in ['Resolved'])
        if critical_unresolved > 0:
            blockers.append(f"{critical_unresolved} High/Critical risks remain unresolved.")
            
    # Score caps
    if any("High/Critical" in b for b in blockers):
        score = min(score, 69)
    if any("evidence" in b.lower() for b in blockers):
        score = min(score, 64)
        
    score = min(100, max(0, int(score)))
    
    # Verdict
    verdict = ""
    next_action = ""
    if score >= 85:
        verdict = "IC Ready"
        next_action = "Schedule IC Meeting"
    elif score >= 70:
        verdict = "Nearly Ready"
        next_action = "Resolve remaining open risks and final evidence requests"
    elif score >= 55:
        verdict = "Needs More Evidence"
        next_action = "Focus on critical customer and financial data room requests"
    else:
        verdict = "Not IC Ready"
        next_action = "Halt process until fundamental blockers are cleared"
        
    return ICReadinessOutput(
        ic_readiness_score=score,
        readiness_verdict=verdict,
        readiness_blockers=blockers,
        next_best_action=next_action
    )
