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
import json
from .base import BaseAIProvider
from typing import Dict, Any, Optional
from platform_diligence_engine.platform_diligence_fixtures import (
    generate_mock_reddit_signals,
    generate_mock_review_signals,
    generate_mock_social_signals,
    generate_mock_competitor_signals,
    generate_mock_pain_points,
    generate_mock_reputation_risks
)

class MockProvider(BaseAIProvider):
    @property
    def provider_name(self) -> str:
        return "mock"

    def is_available(self) -> bool:
        return True

    def generate_structured_output(self, task_type: str, prompt: str, schema_name: str) -> Optional[Dict[str, Any]]:
        """
        A deterministic mock provider that returns a dense, institutional-grade JSON payload.
        It parses the task_type to infer context if needed, but primarily relies on a hardcoded, high-quality template.
        """
        
        if task_type == "investment_memo":
            return self._mock_memo(prompt)
            
        if task_type == "market_research":
            return self._mock_market_map()
            
        if task_type == "competitor_research":
            return self._mock_competitor()
            
        if task_type == "diligence_plan":
            return self._mock_diligence()
            
        if task_type == "deck_claim_extraction":
            return self._mock_deck_claims(prompt)
            
        if task_type == "ic_recommendation":
            return self._mock_ic_recommendation()
            
        if task_type == "partner_pushback":
            return self._mock_partner_pushback()
            
        if task_type == "fast_summary":
            return {"summary": "A fast-growing B2B SaaS company aiming to disrupt legacy infrastructure."}
            
        if task_type == "customer_personas":
            return {"personas": [{"name": "Enterprise IT Leader", "pain_point": "Data silos"}]}
            
        if task_type == "missing_info_detection":
            return {"missing_info": ["Detailed customer acquisition cost", "Churn rate over 12 months"]}
            
        if task_type == "demo_script_generation":
            return {"script": "Welcome to our platform. Here is how you can streamline your workflow..."}
            
        if task_type == "conversation_analysis":
            return self._mock_conversation_analysis()

        # Platform Diligence Fallbacks
        import re
        def _extract_deal(text: str) -> str:
            match = re.search(r'startup "(.*?)"', text)
            if match: return match.group(1)
            match = re.search(r'for "(.*?)"', text)
            if match: return match.group(1)
            parts = text.split("|||")
            return parts[0] if parts else text

        if task_type == "platform_reddit_research":
            return {"findings": generate_mock_reddit_signals(_extract_deal(prompt))}
            
        if task_type == "platform_review_research":
            return {"findings": generate_mock_review_signals(_extract_deal(prompt))}
            
        if task_type == "platform_social_research":
            return {"findings": generate_mock_social_signals(_extract_deal(prompt))}
            
        if task_type == "platform_competitor_research":
            return {"findings": generate_mock_competitor_signals(_extract_deal(prompt))}
            
        if task_type == "platform_pain_points":
            return {"pain_points": generate_mock_pain_points(_extract_deal(prompt))}
            
        if task_type == "platform_reputation_risks":
            return {"reputation_risks": generate_mock_reputation_risks(_extract_deal(prompt))}
            
        if task_type == "platform_sentiment_analysis":
            d_name = _extract_deal(prompt).lower()
            if "zepto" in d_name:
                return {"sentiment_summary": {
                    "positive": 40, "negative": 10, "mixed": 10, "neutral": 5,
                    "confidence": "high", "sample_size": 200,
                    "strongest_themes": ["Insane speed", "Great UI"],
                    "weakest_themes": ["Prices", "Rider safety"],
                    "the_good": ["Unmatched 10-minute delivery execution.", "High customer addiction and retention.", "Strong supply chain moats."],
                    "the_bad": ["High cash burn on rider logistics.", "Markup pricing causes some churn.", "Regulatory risks regarding rider safety."],
                    "general_consensus": "Customers love the magical 10-minute delivery experience and use it heavily. However, there are underlying concerns about the long-term unit economics and the human cost of maintaining such speeds."
                }}
            elif "bharat" in d_name:
                return {"sentiment_summary": {
                    "positive": 35, "negative": 5, "mixed": 10, "neutral": 10,
                    "confidence": "medium", "sample_size": 60,
                    "strongest_themes": ["Local deployment", "Indic embeddings"],
                    "weakest_themes": ["Documentation", "Community size"],
                    "the_good": ["Incredible latency for Indian cloud regions.", "Best-in-class Hindi/regional embeddings.", "Cost effective versus Pinecone."],
                    "the_bad": ["Developer docs are still immature.", "Is it just a FAISS wrapper?", "Small community limits troubleshooting."],
                    "general_consensus": "Developers building AI for the Indian market are highly enthusiastic about a local, low-latency vector database. The core tech seems solid, but they need to prove it's more than just an open-source wrapper by improving their enterprise documentation."
                }}
            else:
                deal_title = _extract_deal(prompt)
                
                # Dynamically fetch profile if possible
                sector = "Technology"
                description = f"startup {deal_title}"
                try:
                    from database.crud import get_db
                    from db.models import Deal
                    from database.database import SessionLocal
                    db = SessionLocal()
                    deal = db.query(Deal).filter(Deal.startup_name == deal_title).first()
                    if deal and deal.public_profile_json:
                        import json
                        profile = json.loads(deal.public_profile_json)
                        sector = profile.get("sector", "Technology")
                        description = profile.get("public_description", description)
                    db.close()
                except Exception:
                    pass

                return {"sentiment_summary": {
                    "positive": 20, "negative": 15, "mixed": 10, "neutral": 5,
                    "confidence": "medium", "sample_size": 50,
                    "strongest_themes": ["Market timing", "Founder vision"],
                    "weakest_themes": ["Scale readiness", "Feature depth"],
                    "the_good": [
                        f"High conviction in {deal_title}'s underlying problem space in {sector}.",
                        f"Users are actively searching for an alternative to incumbent pricing.",
                        f"Direct feature validation for {deal_title}'s core thesis."
                    ],
                    "the_bad": [
                        "Skeptical market—users have been burned by early stage startups before.",
                        f"High barrier to entry for trust in the {sector} space.",
                        "Some complaints about delivery delays or slow scaling."
                    ],
                    "general_consensus": f"The market is fundamentally frustrated with legacy incumbents due to high costs. However, buyers remain hesitant to trust {deal_title} unless they can demonstrate immediate time-to-value. {description}"
                }}

        # Fallback
        return {}
        
    def _mock_conversation_analysis(self):
        return {
            "clarity_score": 85,
            "directness": "High",
            "evidence_quality": "Strong traction numbers provided, but weak on technical moat details.",
            "contradictions": [],
            "evasiveness": "Slight evasiveness when asked about long-term gross margins.",
            "open_follow_ups": ["Can you share the exact gross margin breakdown?"],
            "decision_impact": "Positive overall, validates the team's execution ability."
        }

    def _mock_partner_pushback(self):
        return {
            "pushbacks": [
                "The product is a vitamin, not a painkiller. Once Salesforce/Microsoft decide to build this natively, churn will spike.",
                "The founder is exceptional, but the go-to-market motion relies too heavily on founder-led sales. We need to see a repeatable machine.",
                "Valuation is too rich for the current ARR, pricing in flawless execution."
            ]
        }

    def _mock_market_map(self):
        return {
            "market_attractiveness_score": 85,
            "market_attractiveness_reason": "High fragmentation with legacy incumbents.",
            "market_tailwinds": ["Regulatory pressure", "Labor shortages", "Shift to cloud"],
            "market_headwinds": ["Enterprise budget cuts", "Long sales cycles"]
        }

    def _mock_competitor(self):
        return {
            "competitive_intensity_score": 70,
            "competitive_intensity_reason": "Red ocean with many legacy players, but low AI adoption.",
            "competitors": [
                {
                    "name": "LegacyCorp",
                    "threat_level": "High",
                    "differentiation": "We offer self-serve and 10x faster implementation time."
                },
                {
                    "name": "Startup X",
                    "threat_level": "Medium",
                    "differentiation": "Better UI, but they lack deep enterprise integrations."
                }
            ]
        }

    def _mock_diligence(self):
        return {
            "founder_follow_ups": [
                "How do you plan to scale acquisition without proportional linear increase in CAC given the saturated ad channels?",
                "What is the exact onboarding time for an enterprise client?"
            ],
            "data_room_requests": [
                "Cohort analysis showing NRR > 120%",
                "Full CAP table"
            ],
            "customer_reference_questions": [
                "Why did you choose this over LegacyCorp?",
                "What features are you missing?"
            ]
        }

    def _get_deal_profile(self, prompt: str):
        import re
        def _extract_deal(text: str) -> str:
            match = re.search(r'startup "(.*?)"', text)
            if match: return match.group(1)
            match = re.search(r'for "(.*?)"', text)
            if match: return match.group(1)
            parts = text.split("|||")
            return parts[0] if parts else text

        deal_title = _extract_deal(prompt)
        profile = {}
        try:
            from database.crud import get_db
            from db.models import Deal
            from database.database import SessionLocal
            db = SessionLocal()
            deal = db.query(Deal).filter(Deal.startup_name == deal_title).first()
            if deal and deal.public_profile_json:
                import json
                profile = json.loads(deal.public_profile_json)
            db.close()
        except Exception:
            pass
        return deal_title, profile

    def _mock_deck_claims(self, prompt: str):
        deal_title, profile = self._get_deal_profile(prompt)
        stage = profile.get("stage", "Seed")
        sector = profile.get("sector", "Software")
        
        arr = "$500k ARR"
        if stage == "Series A": arr = "$2M ARR"
        elif stage == "Series B": arr = "$10M ARR"
        elif stage == "Series C": arr = "$25M ARR"
        
        return {
            "extracted_claims": [
                {
                    "category": "Traction",
                    "claim": f"Reached {arr} in {sector}.",
                    "is_supported": True
                },
                {
                    "category": "Retention",
                    "claim": "100% Net Revenue Retention.",
                    "is_supported": False
                }
            ],
            "missing_info_flags": ["No clear GTM motion detailed", "CAC payback not calculated"],
            "deck_quality_score": 75,
            "deck_quality_reason": "Strong traction but missing key unit economics."
        }

    def _mock_memo(self, prompt: str):
        deal_title, profile = self._get_deal_profile(prompt)
        sector = profile.get("sector", "vertical")
        desc = profile.get("description", "a stagnant vertical")
        
        return {
            "executive_snapshot": f"This startup is attacking {desc} with a wedge that dramatically reduces time-to-value. While the {sector} space is competitive, the founder's unique insight into the bottleneck provides a credible path to becoming the system of record.",
            "market_thesis": f"The immediate SAM is $3.2B. The 'Why Now' is driven by recent advancements that make the core problem solvable, allowing {deal_title} to focus entirely on {sector} integration and workflow UX.",
            "founder_market_fit": f"The CEO spent 6 years at a leading incumbent in {sector} and understands the exact technical debt of the industry. The CTO has scaled pipelines at a FAANG company.",
            "product_analysis": "The wedge is a self-serve tool. The moat is the proprietary data network they build over time. This is not an incremental improvement; it fundamentally rewires the cost structure of their customers."
        }

    def _mock_ic_recommendation(self):
        return {
            "decision": "Invest",
            "explanation": "The team is exceptional, the wedge is sharp, and the unit economics indicate highly efficient growth. Main concern is scaling the enterprise go-to-market motion. Conditioned on 3 positive reference calls with enterprise buyers.",
            "key_catalysts": ["Reaching $1M ARR", "Signing top 10 enterprise logo"]
        }
