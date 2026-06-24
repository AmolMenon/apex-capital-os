import uuid
from typing import List, Dict, Any
from .diligence_schemas import DataRoomRequestOutput

def generate_dataroom_requests(deal: Any) -> List[DataRoomRequestOutput]:
    """Generates a checklist of required data room documents."""
    requests = []
    
    # Financials
    requests.append(DataRoomRequestOutput(
        id=str(uuid.uuid4()),
        document_requested="Historical P&L (Last 24 months, monthly breakdown)",
        category="Financials",
        why_it_matters="Verifies revenue growth, gross margins, and burn rate.",
        priority="High",
        linked_risk_or_claim="Financial Diligence",
        status="Missing"
    ))
    
    requests.append(DataRoomRequestOutput(
        id=str(uuid.uuid4()),
        document_requested="Financial Projections (Next 24 months)",
        category="Financials",
        why_it_matters="Assesses the ambition and realism of the founder's growth plan.",
        priority="Medium",
        linked_risk_or_claim="Future Growth",
        status="Missing"
    ))
    
    # Corporate
    requests.append(DataRoomRequestOutput(
        id=str(uuid.uuid4()),
        document_requested="Fully Diluted Cap Table",
        category="Corporate",
        why_it_matters="Ensures the founders still have enough equity to stay motivated and checks for dead equity.",
        priority="High",
        linked_risk_or_claim="Founder Alignment",
        status="Missing"
    ))
    
    # Customers
    requests.append(DataRoomRequestOutput(
        id=str(uuid.uuid4()),
        document_requested="Anonymized Customer Cohort Retention Data",
        category="Customers",
        why_it_matters="Proves product stickiness and Net Revenue Retention (NRR).",
        priority="Critical",
        linked_risk_or_claim="Traction Quality",
        status="Missing"
    ))
    
    requests.append(DataRoomRequestOutput(
        id=str(uuid.uuid4()),
        document_requested="List of top 10 customers to use for reference calls",
        category="Customers",
        why_it_matters="Need unbiased feedback on product ROI.",
        priority="Critical",
        linked_risk_or_claim="Customer Diligence",
        status="Missing"
    ))
    
    # GTM
    requests.append(DataRoomRequestOutput(
        id=str(uuid.uuid4()),
        document_requested="Current Sales Pipeline (CRM export)",
        category="GTM",
        why_it_matters="Validates short-term revenue predictability.",
        priority="Medium",
        linked_risk_or_claim="Revenue Predictability",
        status="Missing"
    ))
    
    return requests
