import json

def generate_diligence_questions(deal, risks_json):
    questions = []
    
    # Generic questions
    questions.append("Can you walk us through the atomic unit of value for your customer?")
    questions.append("What is the exact wedge that gets you into the first 100 enterprise accounts?")
    
    # Sector specific
    if deal.sector.lower() == 'saas' or 'saas' in deal.business_model.lower():
        questions.append("How are you measuring Net Revenue Retention (NRR) and what are the primary drivers of expansion?")
        
    if deal.sector.lower() == 'healthtech':
        questions.append("What is the regulatory pathway (e.g., FDA 510k) and how does it affect your go-to-market timeline?")
        
    # Risk specific
    risks = json.loads(risks_json)
    for risk in risks:
        if 'margin' in risk['risk'].lower():
            questions.append("How do you plan to expand gross margins over the next 18 months as you scale?")
        if 'retention' in risk['risk'].lower():
            questions.append("What specific product features are you building to address the current churn rate?")
            
    # Pad to 12 questions if needed (placeholder logic)
    default_qs = [
        "What is your unique insight into this market that incumbents are missing?",
        "How do you plan to build a sustainable moat over the next 5 years?",
        "Can you break down your CAC calculation and current payback period?",
        "What does the competitive landscape look like from your perspective?",
        "How are you thinking about the composition of your executive team for the next phase of growth?",
        "What is the single biggest existential risk to the business right now?",
        "If you fail in the next 24 months, what will have been the most likely cause?",
        "What does your ideal customer profile look like and how has it evolved?"
    ]
    
    for dq in default_qs:
        if len(questions) < 12:
            questions.append(dq)
            
    return json.dumps(questions[:12])

def generate_partner_pushback(deal):
    pushback = [
        "Why will this not be killed by a better-funded incumbent?",
        "What evidence proves this is a venture-scale outcome?",
        "Why is this team uniquely qualified to win?",
        "What would make us regret investing?",
        "Is this a real market or just a feature?"
    ]
    return json.dumps(pushback)
