import uuid
from typing import List, Dict, Any
from .diligence_schemas import CustomerReferenceOutput

def generate_customer_references(deal: Any, research_brief: Dict[str, Any]) -> List[CustomerReferenceOutput]:
    """Generates customer reference questions to validate product-market fit."""
    references = []
    
    # 1. Problem Urgency
    references.append(CustomerReferenceOutput(
        id=str(uuid.uuid4()),
        category="Problem Urgency",
        question="Before buying this product, how were you solving this problem, and what was the specific trigger that made you finally purchase it?",
        what_to_listen_for="Listen for a clear, acute pain point vs. 'nice to have'. If they couldn't name a trigger, the sales cycle might be unscalable."
    ))
    
    # 2. Switching Behavior
    references.append(CustomerReferenceOutput(
        id=str(uuid.uuid4()),
        category="Switching Behavior",
        question="What would you do if this product disappeared tomorrow?",
        what_to_listen_for="The ideal answer is 'we would panic and build it internally' or 'our workflow would stop'. If they say 'we'd go back to Excel', the moat is weak."
    ))
    
    # 3. ROI/Value Delivered
    references.append(CustomerReferenceOutput(
        id=str(uuid.uuid4()),
        category="ROI / Value",
        question="How do you internally measure the ROI of this product? Have you seen the results promised in the sales pitch?",
        what_to_listen_for="Concrete metrics (hours saved, revenue increased). Vague answers indicate low stickiness."
    ))
    
    # 4. Product Weaknesses
    references.append(CustomerReferenceOutput(
        id=str(uuid.uuid4()),
        category="Product Weaknesses",
        question="What is the most frustrating part of using the product today, and how responsive is the team to feature requests?",
        what_to_listen_for="Every product has flaws. Ensure the flaws aren't core architecture issues, and validate the team's customer obsession."
    ))
    
    # 5. Pricing Sensitivity
    references.append(CustomerReferenceOutput(
        id=str(uuid.uuid4()),
        category="Pricing Sensitivity",
        question="If they doubled the price at renewal, would you churn, negotiate, or just pay it?",
        what_to_listen_for="Tests true pricing power and reliance on the product."
    ))

    return references
