def generate_customer_personas(deal_dict: dict) -> list:
    sector = str(deal_dict.get('sector', '')).lower()
    
    if 'pet' in sector or 'consumer' in sector:
        return [
            {
                "name": "First-time Urban Pet Parent",
                "role": "Consumer",
                "company_type": "N/A",
                "pain_points": ["Anxiety about pet health", "Information overload"],
                "current_workaround": "Google searches, asking vet",
                "willingness_to_pay": "High ($100+/mo) for peace of mind",
                "buying_trigger": "Getting a new puppy or noticing a minor health issue",
                "buying_objections": ["Price", "Subscription fatigue"],
                "decision_making_process": "Impulse buy driven by Instagram/TikTok ads",
                "sales_cycle_estimate": "1 day",
                "why_adopt": "Convenience and premium branding",
                "why_not_adopt": "Can't afford it long-term"
            },
            {
                "name": "Vet Clinic Operator",
                "role": "B2B Partner",
                "company_type": "Independent Clinic",
                "pain_points": ["Client compliance", "Staffing shortages"],
                "current_workaround": "Manual follow-up calls",
                "willingness_to_pay": "Low, wants a revenue share",
                "buying_trigger": "Desire to increase LTV per patient",
                "buying_objections": ["Integration effort", "Loss of direct client control"],
                "decision_making_process": "Committee (Owner + Practice Manager)",
                "sales_cycle_estimate": "3 months",
                "why_adopt": "Passive revenue stream",
                "why_not_adopt": "Too busy to train staff"
            }
        ]
    
    # Default B2B / SaaS
    return [
        {
            "name": "VP of Operations",
            "role": "Economic Buyer",
            "company_type": "Mid-Market ($50M-$500M)",
            "pain_points": ["Margin compression", "Headcount bloat in back office"],
            "current_workaround": "Outsourcing to BPO, manual Excel reconciliation",
            "willingness_to_pay": "High (will pay $50k+ if it saves $100k in headcount)",
            "buying_trigger": "Missing quarterly margin targets",
            "buying_objections": ["Implementation risk", "Data security"],
            "decision_making_process": "Requires CFO sign-off",
            "sales_cycle_estimate": "3-6 months",
            "why_adopt": "Clear, measurable ROI",
            "why_not_adopt": "Existing BPO contract is locked in for 2 years"
        },
        {
            "name": "Automation Lead / RevOps",
            "role": "Champion",
            "company_type": "Mid-Market",
            "pain_points": ["Constantly fixing broken Zapier flows", "Siloed data"],
            "current_workaround": "Custom Python scripts",
            "willingness_to_pay": "N/A (Influencer)",
            "buying_trigger": "System breaks during end-of-month close",
            "buying_objections": ["Black box AI", "Lack of API access"],
            "decision_making_process": "Technical evaluation, POC",
            "sales_cycle_estimate": "1 month for POC",
            "why_adopt": "Makes their life easier, looks good to boss",
            "why_not_adopt": "Feels threatened it will automate their job"
        }
    ]
