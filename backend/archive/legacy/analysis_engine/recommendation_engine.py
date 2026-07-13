import json

def get_recommendation(overall_score, risks_json):
    """
    Determine Invest / Watchlist / Pass.
    Incorporate score and red flags.
    """
    risks = json.loads(risks_json)
    critical_risks = [r for r in risks if r['severity'] == 'Critical']
    high_risks = [r for r in risks if r['severity'] == 'High']
    
    # Base recommendation on score
    if overall_score >= 80:
        recommendation = "Invest"
    elif overall_score >= 65:
        recommendation = "Watchlist"
    else:
        recommendation = "Pass"
        
    # Adjust down for risks
    if len(critical_risks) > 0:
        if recommendation == "Invest":
            recommendation = "Watchlist"
        elif recommendation == "Watchlist":
            recommendation = "Pass"
            
    if len(high_risks) >= 3 and recommendation == "Invest":
        recommendation = "Watchlist"
        
    # Confidence
    if overall_score > 85 or overall_score < 50:
        confidence = "High"
    elif len(critical_risks) > 0:
        confidence = "Medium"
    else:
        confidence = "Medium"
        
    # Final recommendation rationale
    rationale = f"Based on an overall score of {overall_score}/100"
    if critical_risks:
        rationale += f" and the presence of {len(critical_risks)} critical risks."
    else:
        rationale += " and strong fundamentals."
        
    return recommendation, confidence, rationale
