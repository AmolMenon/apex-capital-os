import re

def is_supertails(prompt: str) -> bool:
    return "supertails" in prompt.lower()

def _supertails_memo():
    return {
        "executive_snapshot": "Supertails is an emerging category leader in the rapidly growing Indian pet care ecosystem ($1.2B SAM), offering a full-stack digital-first platform encompassing D2C pet supplies, veterinary telehealth, and behavioral training. Having recently secured Series C funding led by RPSG Capital Ventures, they are well-positioned to consolidate the fragmented market. Their strong operational efficiency, proprietary healthcare infrastructure, and sticky cohort retention give them a distinct advantage over pure-play e-commerce marketplaces.",
        "market_thesis": "India's pet population is growing at 11% CAGR, driven by millennial and Gen Z pet adoption in tier 1 and tier 2 cities. The willingness to pay for premium pet food, healthcare, and grooming is expanding disproportionately. Unlike mature markets, India lacks a cohesive PetSmart equivalent. Supertails acts as this digital aggregator, capturing value across the entire pet lifecycle.",
        "founder_market_fit": "The founding team (Varun Sadana, Aman Tekriwal, Vineet Khanna) brings deep executional expertise from scaling operations at Licious and FreshToHome. Their experience managing high-velocity D2C supply chains translates perfectly to the logistics-heavy pet supplies market, while their strategic expansion into high-margin services (telehealth) demonstrates mature capital allocation.",
        "product_analysis": "The core wedge is e-commerce (supplies), which serves as a low-CAC customer acquisition channel. The true moat is their digital veterinary services (tele-consultations) and pharmacy offerings, which drive high LTV and retention. By owning the pet's health records and life cycle, Supertails becomes the system of record for the pet parent, rendering horizontal competitors like Amazon and Swiggy Instamart less relevant for complex needs."
    }

def _supertails_ic_recommendation():
    return {
        "decision": "Strong Invest",
        "explanation": "The Indian pet care market is at an inflection point. Supertails has demonstrated highly efficient capital scaling and strong top-line growth (~100 Cr+ run rate) while improving unit economics. The team's background in D2C operations mitigates supply chain risks. We recommend participating in their next round to gain exposure to the rising premium consumer class in India.",
        "key_catalysts": ["Launching proprietary private-label brands to expand gross margins", "Scaling physical omni-channel experience centers", "Hitting EBITDA profitability within 18 months"]
    }

def _supertails_partner_pushback():
    return {
        "pushbacks": [
            "Quick commerce players like Zepto and Blinkit are aggressively expanding into pet supplies. How does Supertails defend its core e-commerce revenue from 10-minute delivery convenience?",
            "Tele-vet consultations are a great retention hook, but are they actually monetizable at scale, or just a loss leader?",
            "What is the capital intensity required to build out their own private label brands, and what happens if incumbent FMCG brands squeeze them on margins?"
        ]
    }

def _supertails_market_map():
    return {
        "market_attractiveness_score": 88,
        "market_attractiveness_reason": "High CAGR (15%+), fragmented incumbents, and strong consumer willingness to spend on premiumization.",
        "market_tailwinds": ["Humanization of pets", "Rising disposable income", "Increased pet adoption post-COVID"],
        "market_headwinds": ["Supply chain constraints for imported pet foods", "Regulatory compliance for pet pharmacy"]
    }

def _supertails_competitors():
    return {
        "competitive_intensity_score": 65,
        "competitive_intensity_reason": "Growing competition from premium offline brands and quick commerce, but few full-stack digital players.",
        "competitors": [
            {
                "name": "Heads Up For Tails (HUFT)",
                "threat_level": "High",
                "differentiation": "Strong offline retail footprint, premium brand positioning, deeply entrenched customer base."
            },
            {
                "name": "Petsy",
                "threat_level": "Medium",
                "differentiation": "Similar D2C approach but smaller scale, focused heavily on supplies rather than services."
            },
            {
                "name": "Swiggy Instamart / Blinkit",
                "threat_level": "Medium",
                "differentiation": "Unbeatable delivery speed (10 mins), but limited SKU depth and zero advisory/healthcare services."
            }
        ]
    }

def _supertails_diligence():
    return {
        "founder_follow_ups": [
            "Walk us through the cohort retention curves for customers who use the tele-vet service vs. those who only buy supplies.",
            "What is the projected gross margin expansion timeline for your private label products?"
        ],
        "data_room_requests": [
            "Detailed breakdown of CAC by channel (organic vs. paid)",
            "SKU-level profitability analysis, separating 3rd party vs. private label",
            "Historical regulatory compliance documents for pharmacy operations"
        ],
        "customer_reference_questions": [
            "How often do you consult the Supertails vet versus your local clinic?",
            "Would you switch to quick commerce if they offered the exact same pet food brand?"
        ]
    }
