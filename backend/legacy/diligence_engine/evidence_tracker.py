import uuid
from typing import List, Dict, Any
from .diligence_schemas import EvidenceItemOutput

def generate_evidence_tracker(deal: Any, analysis: Dict[str, Any], deck_analysis: Dict[str, Any]) -> List[EvidenceItemOutput]:
    """Generates a tracking list for required evidence based on the deal profile and identified gaps."""
    evidence_items = []
    
    # Standard Evidence Requirements
    evidence_items.append(EvidenceItemOutput(
        id=str(uuid.uuid4()),
        evidence_name="Founder LinkedIn/Resume",
        evidence_type="Founder-provided document",
        linked_claim_or_risk="Founder Background Check",
        confidence_level="Low",
        verification_status="Requested",
        source="Founder",
        date_collected="",
        notes="",
        impact_on_recommendation="Low"
    ))
    
    evidence_items.append(EvidenceItemOutput(
        id=str(uuid.uuid4()),
        evidence_name="Trailing 12-Month P&L",
        evidence_type="Financial model",
        linked_claim_or_risk="Financial Diligence",
        confidence_level="Low",
        verification_status="Requested",
        source="Data Room",
        date_collected="",
        notes="",
        impact_on_recommendation="High"
    ))
    
    # Evidence based on deck claims
    claims = deck_analysis.get("key_claims", [])
    for claim in claims:
        if claim.get("evidence_level") in ["Unsupported", "Weak"]:
            evidence_items.append(EvidenceItemOutput(
                id=str(uuid.uuid4()),
                evidence_name=f"Data for: '{claim.get('claim', 'Unknown claim')}'",
                evidence_type="Pitch deck claim",
                linked_claim_or_risk=f"Deck Claim Verification",
                confidence_level="Low",
                verification_status="Missing",
                source="Founder",
                date_collected="",
                notes=f"Needs verification because deck evidence was graded as {claim.get('evidence_level')}.",
                impact_on_recommendation="High" if claim.get("category") in ["Traction", "Financials"] else "Medium"
            ))

    # Evidence based on missing deck info
    missing_info = deck_analysis.get("missing_sections", [])
    for missing in missing_info:
        evidence_items.append(EvidenceItemOutput(
            id=str(uuid.uuid4()),
            evidence_name=f"Information on: {missing.get('section', 'Unknown')}",
            evidence_type="Missing Info",
            linked_claim_or_risk="Missing Deck Section",
            confidence_level="Low",
            verification_status="Requested",
            source="Founder",
            date_collected="",
            notes=f"Why it matters: {missing.get('why_it_matters', '')}",
            impact_on_recommendation="High"
        ))
        
    return evidence_items
