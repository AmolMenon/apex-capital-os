import uuid
from typing import List, Dict, Any
from .diligence_schemas import FounderFollowupOutput

def generate_founder_followups(deal: Any, analysis: Dict[str, Any], deck_analysis: Dict[str, Any]) -> List[FounderFollowupOutput]:
    """Generates sharp, investor-like follow-up questions for the founder."""
    followups = []
    
    # Unit Economics / Revenue Quality
    if deal.cac and deal.ltv:
        ltv_cac = deal.ltv / deal.cac if deal.cac > 0 else 0
        if ltv_cac < 3:
            followups.append(FounderFollowupOutput(
                id=str(uuid.uuid4()),
                category="Unit Economics",
                question=f"Your LTV:CAC ratio is currently {ltv_cac:.1f}x. What specific levers are you pulling in the next 6 months to improve payback periods?",
                why_it_matters="A sub-3x LTV:CAC indicates inefficient growth. We need to know if this is a structural market issue or early-stage optimization."
            ))
            
    # GTM Strategy
    followups.append(FounderFollowupOutput(
        id=str(uuid.uuid4()),
        category="GTM Strategy",
        question="Which customer segment has converted fastest so far, and what evidence suggests that this channel can scale beyond founder-led sales?",
        why_it_matters="Identifies if early traction is scalable or relies purely on the founder's personal network."
    ))
    
    # Competition
    if deal.competitors:
        followups.append(FounderFollowupOutput(
            id=str(uuid.uuid4()),
            category="Competition",
            question=f"You mentioned {deal.competitors} as competitors. When you lose a deal to them, what is the most common reason the prospect gives?",
            why_it_matters="Forces the founder to acknowledge weaknesses and reveals their true competitive position."
        ))
        
    # Product Differentiation
    followups.append(FounderFollowupOutput(
        id=str(uuid.uuid4()),
        category="Product Differentiation",
        question="If an incumbent decided to copy your core feature tomorrow, why wouldn't your customers switch to the bundled offering?",
        why_it_matters="Tests the depth of the moat beyond just 'first mover' or 'better UI'."
    ))
    
    # Based on deck risks
    risks = deck_analysis.get("risks", [])
    for risk in risks[:2]: # Take top 2 deck risks
        followups.append(FounderFollowupOutput(
            id=str(uuid.uuid4()),
            category="Deck Risk",
            question=f"Regarding the risk of '{risk.get('risk_factor', '')}': How are you structurally mitigating this in the next 12 months?",
            why_it_matters=f"Addresses explicitly flagged concern: {risk.get('why_it_matters', '')}"
        ))

    return followups
