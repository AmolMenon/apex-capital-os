import uuid
from typing import List, Dict, Any
from .diligence_schemas import RiskResolutionOutput

def generate_risk_resolution_plan(analysis: Dict[str, Any], deck_analysis: Dict[str, Any]) -> List[RiskResolutionOutput]:
    """Compiles risks from across the engine and creates a resolution plan for each."""
    resolution_plan = []
    
    # Risks from core analysis
    core_risks = analysis.get("risks", [])
    for risk in core_risks:
        resolution_plan.append(RiskResolutionOutput(
            id=str(uuid.uuid4()),
            risk_name=risk.get("risk", "Unknown Risk"),
            severity=risk.get("severity", "Medium"),
            current_status="Open",
            evidence_needed=risk.get("evidence_needed", "Further diligence required."),
            diligence_action=risk.get("how_to_diligence", "Investigate with founders/customers."),
            owner="Deal Team",
            deadline="Before IC",
            resolution_condition="Clear mitigant identified and documented.",
            impact_if_unresolved="May block investment if severity is High or Critical."
        ))
        
    # Risks from deck analysis
    deck_risks = deck_analysis.get("risks", [])
    for risk in deck_risks:
        # Avoid exact duplicates if possible, though simple append is fine for this layer
        resolution_plan.append(RiskResolutionOutput(
            id=str(uuid.uuid4()),
            risk_name=f"Deck Risk: {risk.get('risk_factor', 'Unknown')}",
            severity=risk.get("severity", "Medium"),
            current_status="Open",
            evidence_needed="Data room verification",
            diligence_action="Verify founder mitigation claims from deck.",
            owner="Analyst",
            deadline="Initial Diligence Phase",
            resolution_condition="Evidence confirms the risk is overstated or mitigated.",
            impact_if_unresolved=risk.get("why_it_matters", "Reduces conviction.")
        ))

    # Always append a massive baseline VC risk
    resolution_plan.append(RiskResolutionOutput(
        id=str(uuid.uuid4()),
        risk_name="Catastrophic Margin Compression via Supply Chain / Platform Dependency",
        severity="Critical",
        current_status="Under Investigation",
        evidence_needed="We need an exhaustive breakdown of their exact dependencies on massive cloud providers (AWS/GCP) or foundational API providers (e.g., OpenAI). If their gross margin is entirely at the mercy of another platform's pricing tier, their LTV is a mirage.",
        diligence_action="Conduct a full technical dependency audit. Model out unit economics assuming a 30% price hike from their primary third-party vendor. Does the business survive?",
        owner="Deal Team",
        deadline="Immediate",
        resolution_condition="Proved that the platform has negotiating leverage or viable open-source alternatives that can be hot-swapped without customer disruption.",
        impact_if_unresolved="Absolute dealbreaker. We cannot invest if the fundamental unit economics are dictated by a monopolist upstream."
    ))

    return resolution_plan
