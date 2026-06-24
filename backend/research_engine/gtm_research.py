def generate_gtm_research(deal_dict: dict) -> dict:
    sector = str(deal_dict.get('sector', '')).lower()
    
    if 'consumer' in sector or 'pet' in sector:
        motion = "Community-led / Paid Social"
        segment = "High-income coastal millennials"
        wedge = "Aesthetic, single-purpose premium product"
        channels = ["Instagram/TikTok ads", "Influencer seeding", "Retail pop-ups"]
        cycle = "1-7 days"
        cac = "High risk. iOS privacy changes make paid social volatile."
        score = 60
        risks = ["LTV:CAC ratio decay", "Copycat brands"]
        proof = "Must prove CAC stabilizes below $50 at >$100k/mo spend"
        exp = [
            {"experiment": "Micro-influencer affiliate program", "objective": "Lower blended CAC", "metric": "Affiliate CPA", "expected_signal": "<$30 CPA", "timeline": "30 days"}
        ]
    elif 'devtool' in sector or 'ai' in sector:
        motion = "Product-led Growth (PLG)"
        segment = "Senior engineers at mid-stage startups"
        wedge = "Open-source tool solving a specific integration pain"
        channels = ["GitHub", "HackerNews", "Twitter", "Dev rel content"]
        cycle = "14-30 days"
        cac = "Low initially, high later (needs enterprise sales team)"
        score = 80
        risks = ["Failure to convert free to paid", "Security blockers in enterprise"]
        proof = "Must prove bottom-up adoption leads to top-down enterprise contracts"
        exp = [
            {"experiment": "Self-serve team tier", "objective": "Drive natural expansion", "metric": "Free-to-paid conversion rate", "expected_signal": ">4%", "timeline": "60 days"}
        ]
    else:
        motion = "Founder-led outbound sales"
        segment = "Mid-market VP/Directors"
        wedge = "Point solution replacing manual process"
        channels = ["Cold email", "LinkedIn outbound", "Conferences"]
        cycle = "3-6 months"
        cac = "Moderate (requires SDR scaling)"
        score = 75
        risks = ["Founder magic doesn't scale to AEs", "Long sales cycles drain cash"]
        proof = "First non-founder AE needs to hit quota 2 quarters in a row"
        exp = [
            {"experiment": "Outbound email sequence targeted at specific vertical", "objective": "Find repeatable messaging", "metric": "Meeting book rate", "expected_signal": ">2%", "timeline": "45 days"}
        ]

    return {
        "primary_motion": motion,
        "best_early_segment": segment,
        "first_wedge": wedge,
        "distribution_channels": channels,
        "sales_cycle_estimate": cycle,
        "cac_risk": cac,
        "repeatability_score": score,
        "gtm_risks": risks,
        "next_90_days_proof": proof,
        "recommended_experiments": exp
    }
