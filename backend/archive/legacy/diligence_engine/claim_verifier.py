import uuid
from typing import List, Dict, Any
from .diligence_schemas import ClaimVerificationOutput

def generate_claim_verifications(deck_analysis: Dict[str, Any]) -> List[ClaimVerificationOutput]:
    """Generates verification checklists for claims extracted from the pitch deck."""
    verifications = []
    
    claims = deck_analysis.get("key_claims", [])
    for claim in claims:
        evidence_level = claim.get("evidence_level", "Unknown")
        
        # Only verify claims that are not already strongly supported
        if evidence_level in ["Unsupported", "Weak", "Medium"]:
            claim_text = claim.get("claim", "")
            claim_type = claim.get("category", "General")
            
            evidence_required = ""
            founder_question = ""
            customer_question = ""
            data_room_req = ""
            
            if claim_type == "Market":
                evidence_required = "Bottom-up market sizing model, third-party industry reports."
                founder_question = "Can you walk us through the assumptions in your bottom-up TAM build?"
                data_room_req = "Market sizing Excel model"
            elif claim_type == "Traction":
                evidence_required = "Historical P&L, cohort retention data."
                founder_question = "What is driving the recent uptick in growth, and is it repeatable?"
                data_room_req = "Monthly P&L, Cohort Data"
            elif claim_type == "Product":
                evidence_required = "Product demo, customer case studies."
                founder_question = "What is the hardest technical challenge you've solved?"
                customer_question = "Does the product actually deliver the ROI promised in the deck?"
                data_room_req = "Architecture diagrams"
            else:
                evidence_required = "Supporting documentation or data."
                founder_question = f"What data supports your claim that: '{claim_text}'?"
                data_room_req = "Relevant supporting data"
                
            verifications.append(ClaimVerificationOutput(
                id=str(uuid.uuid4()),
                claim_text=claim_text,
                claim_type=claim_type,
                current_evidence_level=evidence_level,
                verification_status="Missing" if evidence_level == "Unsupported" else "Requested",
                evidence_required=evidence_required,
                founder_question=founder_question,
                customer_question=customer_question if customer_question else None,
                data_room_document_required=data_room_req,
                risk_if_unverified=f"Unverified {claim_type} claims reduce conviction in the investment thesis.",
                effect_on_recommendation="May downgrade to Pass" if evidence_level == "Unsupported" else "Could delay IC approval"
            ))
            
    return verifications
