import re

with open('backend/main.py', 'r') as f:
    content = f.read()

replacement = """
        return DiligencePlanOutput(
            deal_id=deal_id,
            company_name=deal.startup_name,
            ic_readiness_score=40,
            diligence_status="Not Started",
            final_diligence_verdict="Need more data",
            priority_tasks=[{"id": "1", "task": "Verify market size", "category": "Market", "objective": "Ensure TAM > $1B", "owner": "Analyst", "priority": "High", "status": "Not Started", "evidence_required": "Industry reports", "expected_output": "TAM calculation", "deadline_suggestion": "EOW", "ic_relevance": "High"}],
            claim_verifications=[{"id": "1", "claim_text": "Fastest growing product", "claim_type": "Traction", "current_evidence_level": "Low", "verification_status": "Missing", "evidence_required": "Cohorts", "founder_question": "Can you share cohorts?", "customer_question": "Why did you buy?", "data_room_document_required": "Financials", "risk_if_unverified": "High churn", "effect_on_recommendation": "Dealbreaker"}],
            founder_followups=[{"id": "1", "category": "Product", "question": "What is the CAC payback period?", "why_it_matters": "Need to verify unit economics"}],
            customer_reference_questions=[{"id": "1", "category": "Product", "question": "Why did you choose this over incumbents?", "what_to_listen_for": "Lock-in"}],
            data_room_requests=[{"id": "1", "document_requested": "Historical Financials", "category": "Finance", "why_it_matters": "Revenue verification", "priority": "High", "linked_risk_or_claim": "Traction", "status": "Pending"}],
            risk_resolution_plan=[{"id": "1", "risk_name": "Competition", "severity": "High", "current_status": "Open", "evidence_needed": "Feature differentiation", "diligence_action": "Analyze competitors", "owner": "Partner", "deadline": "Next week", "resolution_condition": "Clear moat", "impact_if_unresolved": "Pass"}],
            evidence_items=[]
        )
"""

content = re.sub(r'return DiligencePlanOutput\(\s*deal_id=deal_id,\s*company_name=deal.startup_name,[\s\S]*?evidence_items=\[\]\s*\)', replacement.strip(), content)

with open('backend/main.py', 'w') as f:
    f.write(content)

print("Patched diligence mock")
