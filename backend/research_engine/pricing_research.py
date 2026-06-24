def generate_pricing_research(deal_dict: dict) -> dict:
    sector = str(deal_dict.get('sector', '')).lower()
    
    if 'ai' in sector:
        current_model = "Per-seat SaaS"
        suggested_model = "Usage-based or Outcome-based"
        wtp_logic = "Buyers map AI value to FTE replacement or task automation volume, not human seat licenses."
        margin = "Potentially lower initially due to compute costs (60-70%), scaling to 80%+ with model optimization."
        expansion = "High. Land-and-expand via API call volume increases."
        risk = "Compute costs scaling faster than revenue, leading to negative gross margins on power users."
        benchmark = "$500/mo platform fee + $0.02 per automated task"
        experiments = [
            "Test flat platform fee vs pure pay-as-you-go",
            "Introduce volume tiering discounts"
        ]
    elif 'fintech' in sector:
        current_model = "Transaction fee (Bps)"
        suggested_model = "SaaS base + Transaction fee"
        wtp_logic = "Merchants want predictable base costs but will share upside on net-new revenue."
        margin = "High (80%+) on SaaS, variable (40-60%) on payments depending on interchange."
        expansion = "Moderate. Tied to customer GMV growth."
        risk = "Race to the bottom on take rates from larger incumbents."
        benchmark = "$99/mo + 2.9% + 30c per transaction"
        experiments = [
            "Test higher SaaS fee with lower take rate",
            "Test charging for premium analytics modules"
        ]
    else:
        current_model = "Tiered SaaS"
        suggested_model = "Usage-based SaaS"
        wtp_logic = "Customers prefer paying for value realized rather than arbitrary seat limits."
        margin = "Standard SaaS (80%+)"
        expansion = "High via upsell to enterprise tiers"
        risk = "Shelfware (paying but not using, leading to churn)"
        benchmark = "$15k ACV for Mid-Market"
        experiments = [
            "Test removing seat limits and charging by data volume",
            "A/B test annual upfront vs monthly payments"
        ]

    return {
        "current_model": current_model,
        "suggested_model": suggested_model,
        "willingness_to_pay_logic": wtp_logic,
        "gross_margin_implication": margin,
        "expansion_revenue_potential": expansion,
        "pricing_risk": risk,
        "benchmark_pricing": benchmark,
        "recommended_experiments": experiments
    }
