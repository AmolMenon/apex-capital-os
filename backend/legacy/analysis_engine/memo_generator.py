def generate_memo_sections(deal):
    """
    Generates structured memo text.
    """
    memo = {
        "Executive Summary": f"{deal.startup_name} is a {deal.stage} stage company in the {deal.sector} space, building a {deal.business_model} business. "
                             f"They have requested ${deal.funding_raised or 0}M at a ${deal.valuation or 'TBD'}M valuation. "
                             f"The core thesis is that {deal.startup_name} can capture the {deal.market_size or 'large'} market by leveraging its {deal.description or 'unique offering'}.",
        
        "Company Overview": f"{deal.startup_name} was founded to address inefficiencies in {deal.sector}. "
                            f"The team is based in {deal.geography} and targets {deal.customers or 'enterprise'} customers. "
                            f"The platform is best described as: {deal.description}",
                            
        "Problem": f"The {deal.sector} market is plagued by legacy systems, manual workflows, and siloed data. "
                   f"Incumbents have failed to innovate, leaving customers frustrated with high costs and poor user experiences.",
                   
        "Solution": f"{deal.startup_name} provides a modern, {deal.business_model} solution that streamlines this process. "
                    f"By offering a 10x better user experience and robust integrations, they reduce friction and time-to-value for their customers.",
                    
        "Market Opportunity": f"The total addressable market is estimated at ${deal.market_size or 'a massive'}M, growing at {deal.growth_rate or 'a healthy'}% YoY. "
                              f"This is a massive, highly fragmented space ripe for disruption.",
                              
        "Why Now": "Macro tailwinds, including remote work, regulatory shifts, and cloud adoption, make this the perfect time for a cloud-native entrant. "
                   "Customers are actively looking to rip out legacy solutions.",
                   
        "Product": f"The product is highly differentiated through proprietary technology and a consumer-grade UI. "
                   f"Early customers report significant ROI and deep engagement with the core module.",
                   
        "Business Model": f"The company operates a {deal.business_model} model. Current gross margins are {deal.gross_margin or 'TBD'}%. "
                          f"With scale, we expect margins to expand to 80%+. The unit economics (CAC/LTV) are showing early signs of strong repeatability.",
                          
        "Traction": f"Current traction: ${deal.arr or deal.revenue or 0} in ARR/Revenue, growing fast. "
                    f"They have {deal.customers or 0} paying customers and {deal.users or 0} active users. "
                    f"Net revenue retention is strong, indicating a sticky product.",
                    
        "Competition": "The market has legacy incumbents and a few emerging point solutions. "
                       f"{deal.startup_name} wins by being a full-stack, modern platform rather than a narrow tool.",
                       
        "Founder-Market Fit": f"The founders possess deep domain expertise. Background: {deal.founder_background or 'Strong tech and commercial mix'}. "
                              f"They have unique insight into the problem and have proven they can ship product quickly.",
                              
        "Investment Thesis": f"If {deal.startup_name} can successfully execute its GTM strategy, it can become the system of record for {deal.sector}. "
                             f"This is a classic venture-scale opportunity with strong founder-market fit.",
                             
        "Key Risks": "The primary risks are execution risk, competitive response from incumbents, and the ability to scale the sales team efficiently.",
        
        "Diligence Required": "We need to deep dive into cohort retention, speak to 3-5 existing customers, and validate the technical architecture.",
        
        "Return Potential": f"At a ${deal.valuation or 'TBD'}M entry valuation, this deal has the potential to return 10-20x if they capture just 5% of the TAM.",
        
        "Final Recommendation": "We recommend proceeding to the next stage of diligence."
    }
    
    return memo

def generate_ic_one_pager(deal, analysis):
    """
    Generates data for IC One Pager.
    """
    return {
        "Company": deal.startup_name,
        "Sector": deal.sector,
        "Stage": deal.stage,
        "Round": f"${deal.funding_raised or 0}M at ${deal.valuation or 'TBD'}M",
        "Apex Score": analysis.overall_score,
        "Recommendation": analysis.recommendation,
        "One-line thesis": analysis.thesis,
        "Why now": "Regulatory and macro shifts are forcing legacy software rip-and-replace.",
        "Why this team": deal.founder_background or "Strong technical founders with deep domain expertise.",
        "Why this can be big": f"TAM is ${deal.market_size or 'massive'}, highly scalable {deal.business_model} model.",
        "Key traction": f"${deal.arr or deal.revenue or 0} ARR, {deal.customers or 0} customers.",
        "Main risks": analysis.risks,
        "Diligence required": "Customer calls, technical review, cohort analysis.",
        "Final call": analysis.recommendation
    }
