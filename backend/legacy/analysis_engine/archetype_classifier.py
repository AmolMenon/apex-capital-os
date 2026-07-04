def classify_archetype(deal_dict: dict) -> dict:
    sector = str(deal_dict.get('sector', '')).lower()
    desc = str(deal_dict.get('description', '')).lower()
    bm = str(deal_dict.get('business_model', '')).lower()
    
    if 'health' in sector or 'bio' in sector:
        if 'platform' in desc or 'discovery' in desc:
            return {
                "name": "Bioinformatics / Deeptech",
                "what_matters_most": "Scientific validation, IP moats, and partnership milestones.",
                "typical_risks": ["Binary technical risk", "Long regulatory timelines", "High capital intensity"],
                "key_metrics": ["Milestone achievement", "Pharma partnership pipeline", "Burn rate vs milestone"],
                "relevant_comparables": ["Schrodinger", "Recursion", "Tempus"],
                "exit_pathways": "Acquisition by big pharma or specialized biotech IPO."
            }
        else:
            return {
                "name": "Healthtech Platform",
                "what_matters_most": "Distribution, integration with legacy EHRs, and provable ROI.",
                "typical_risks": ["Long sales cycles", "Integration barriers", "Regulatory compliance (HIPAA)"],
                "key_metrics": ["Live deployments", "Sales cycle length", "Net revenue retention"],
                "relevant_comparables": ["Veeva", "Epic (Private)", "Doximity"],
                "exit_pathways": "Strategic M&A by healthcare conglomerates or IPO."
            }
            
    if 'climate' in sector or 'energy' in sector:
        return {
            "name": "Climate Infrastructure",
            "what_matters_most": "Scalability of tech, regulatory tailwinds, and project finance.",
            "typical_risks": ["Hardware scaling risk", "Policy changes", "Commodity pricing"],
            "key_metrics": ["Cost per ton/unit", "Offtake agreements", "Deployment velocity"],
            "relevant_comparables": ["Tesla (Energy)", "Enphase", "NextEra Energy"],
            "exit_pathways": "Strategic acquisition by energy majors or infrastructure funds."
        }
        
    if 'fintech' in sector or 'credit' in desc or 'payment' in desc:
        return {
            "name": "Fintech Infrastructure",
            "what_matters_most": "Unit economics, regulatory arbitrage, and cost of capital.",
            "typical_risks": ["Regulatory clampdowns", "Credit risk", "Margin compression from incumbents"],
            "key_metrics": ["Take rate", "Cost of acquisition", "Default rates"],
            "relevant_comparables": ["Stripe", "Plaid", "Adyen"],
            "exit_pathways": "Acquisition by legacy financial institutions or fintech decacorns."
        }
        
    if 'market' in bm or 'market' in desc:
        return {
            "name": "Marketplace",
            "what_matters_most": "Liquidity, network effects, and solving the chicken-or-egg problem.",
            "typical_risks": ["Disintermediation", "Low frequency of use", "Multi-tenanting"],
            "key_metrics": ["GMV", "Take rate", "Buyer/Seller retention", "CAC payback"],
            "relevant_comparables": ["Airbnb", "Uber", "Etsy"],
            "exit_pathways": "Large scale IPO if category winner."
        }
        
    if 'ai' in desc or 'automate' in desc or 'workflow' in desc:
        return {
            "name": "AI SaaS Workflow Tool",
            "what_matters_most": "Workflow integration, data moats, and stickiness.",
            "typical_risks": ["Wrapper risk (commoditization)", "High churn", "Incumbent features"],
            "key_metrics": ["Daily active users / Monthly active users", "NRR", "Gross Margin (Compute costs)"],
            "relevant_comparables": ["Notion", "Airtable", "Harvey"],
            "exit_pathways": "Strategic M&A by tech giants (Microsoft, Salesforce)."
        }
        
    if 'pet' in desc or 'consumer' in sector:
        return {
            "name": "Pet Care / Consumer Health",
            "what_matters_most": "Brand moat, LTV/CAC, and community engagement.",
            "typical_risks": ["High CAC", "Fad risk", "Supply chain issues"],
            "key_metrics": ["LTV/CAC", "AOV", "Repeat purchase rate", "Contribution margin"],
            "relevant_comparables": ["Chewy", "Rover", "BarkBox"],
            "exit_pathways": "Private equity buyout or strategic acquisition by FMCG."
        }
        
    # Default fallback
    return {
        "name": "Vertical SaaS",
        "what_matters_most": "Deep industry specific workflows and high switching costs.",
        "typical_risks": ["Small TAM", "Slow adoption in legacy industries", "Long sales cycles"],
        "key_metrics": ["ACV", "Net Revenue Retention", "CAC Payback"],
        "relevant_comparables": ["Procore", "Toast", "Veeva"],
        "exit_pathways": "PE buyout or dominant category IPO."
    }
