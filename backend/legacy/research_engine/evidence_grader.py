def grade_evidence(deal_dict: dict) -> dict:
    metrics = str(deal_dict.get('metrics', '')).lower()
    revenue = deal_dict.get('revenue') or 0
    
    if revenue > 500000:
        overall_score = 75
        confidence = "Medium"
        revenue_grade = {"category": "Revenue", "grade": "B", "explanation": "Demonstrated initial traction >$500k ARR.", "missing_evidence": "Need audited financials.", "how_to_validate": "Request P&L and bank statements."}
    else:
        overall_score = 45
        confidence = "Low"
        revenue_grade = {"category": "Revenue", "grade": "D", "explanation": "Pre-revenue or negligible revenue.", "missing_evidence": "No proof of willingness to pay.", "how_to_validate": "Wait for paid pilots to convert."}

    categories = [
        {"category": "Founder", "grade": "B", "explanation": "Domain expertise claimed.", "missing_evidence": "Reference checks from previous managers.", "how_to_validate": "Backchannel via LinkedIn."},
        {"category": "Market", "grade": "A", "explanation": "Market size is objectively large.", "missing_evidence": "None", "how_to_validate": "N/A"},
        {"category": "Product", "grade": "C", "explanation": "Demo exists, but scalability unproven.", "missing_evidence": "Architecture review.", "how_to_validate": "Technical DD session."},
        {"category": "Customer", "grade": "C", "explanation": "Logos claimed on deck.", "missing_evidence": "Direct customer interviews.", "how_to_validate": "Call 3 current customers."},
        revenue_grade,
        {"category": "Retention", "grade": "Unknown", "explanation": "Too early for cohort data.", "missing_evidence": "12-month net revenue retention.", "how_to_validate": "Review raw stripe data in 6 months."},
        {"category": "Unit Economics", "grade": "C", "explanation": "LTV/CAC looks good on paper, but CAC is likely artificially low.", "missing_evidence": "Paid marketing channel scalability.", "how_to_validate": "Review ad account spend."},
        {"category": "Competitive", "grade": "D", "explanation": "Founder claims 'no competitors'.", "missing_evidence": "Objective market map.", "how_to_validate": "Use analyst resources to find stealth competitors."},
        {"category": "Exit", "grade": "C", "explanation": "Recent M&A in space, but multiples are dropping.", "missing_evidence": "Acquirer appetite.", "how_to_validate": "Talk to corp dev at target acquirers."}
    ]

    narrative_warning = "Strong story, weak evidence" if overall_score < 60 else None

    return {
        "categories": categories,
        "overall_score": overall_score,
        "confidence_level": confidence,
        "narrative_warning": narrative_warning
    }
