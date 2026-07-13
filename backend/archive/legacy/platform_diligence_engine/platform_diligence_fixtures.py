from .platform_diligence_schemas import PlatformSignal, PainPointCluster, CompetitorSignal, ReputationRisk, PlatformSentimentSummary
import uuid
import json

def _get_deal_profile(deal_name: str):
    profile = {}
    try:
        from database.crud import get_db
        from db.models import Deal
        from database.database import SessionLocal
        db = SessionLocal()
        deal = db.query(Deal).filter(Deal.startup_name == deal_name).first()
        if deal and deal.public_profile_json:
            profile = json.loads(deal.public_profile_json)
        db.close()
    except Exception:
        pass
    return profile

def _id(): return str(uuid.uuid4())

def get_theme(deal_name: str):
    name = deal_name.lower()
    if "zepto" in name: return "zepto"
    elif "bharat" in name: return "bharatvector"
    elif "neural" in name: return "neuraldesk"
    elif "supertails" in name: return "supertails"
    else: return "generic"

# ----------------- REDDIT -----------------
def generate_mock_reddit_signals(deal_name: str) -> list:
    theme = get_theme(deal_name)
    if theme == "zepto":
        return [
            {"signal_id": _id(), "company_name": deal_name, "platform": "reddit", "source_url": "https://reddit.com/r/mumbai", "source_title": "10 min delivery is crazy", "published_at": "2026-06-01", "snippet": "They actually delivered my groceries in 8 mins. Incredible operations, but I feel bad for the riders.", "signal_type": "praise", "sentiment": "mixed", "relevance_score": 90, "confidence": "high", "verification_status": "corroborated", "decision_impact": "high", "bias_warning": "None", "next_action": "Check rider safety policies.", "metadata": {}},
            {"signal_id": _id(), "company_name": deal_name, "platform": "reddit", "source_url": "https://reddit.com/r/india", "source_title": "Prices higher than local shops", "published_at": "2026-06-10", "snippet": "I noticed the markup on Zepto is almost 15% compared to D-Mart. You are paying heavily for convenience.", "signal_type": "pricing_complaint", "sentiment": "negative", "relevance_score": 85, "confidence": "high", "verification_status": "corroborated", "decision_impact": "medium", "bias_warning": "Price sensitive forum.", "next_action": "Check margin structure.", "metadata": {}}
        ]
    elif theme == "bharatvector":
        return [
            {"signal_id": _id(), "company_name": deal_name, "platform": "reddit", "source_url": "https://reddit.com/r/MachineLearning", "source_title": "Best vector DB for Indic languages?", "published_at": "2026-06-01", "snippet": "We tried Pinecone but it sucks for multi-lingual Indian semantic search. Someone recommended BharatVector and their Hindi embeddings are nuts.", "signal_type": "praise", "sentiment": "positive", "relevance_score": 95, "confidence": "high", "verification_status": "public_anecdote", "decision_impact": "high", "bias_warning": "None", "next_action": "Verify indexing speed.", "metadata": {}}
        ]
    elif theme == "neuraldesk":
        return [
            {"signal_id": _id(), "company_name": deal_name, "platform": "reddit", "source_url": "https://reddit.com/r/SaaS", "source_title": "Enterprise bots fail at regional dialects", "published_at": "2026-06-01", "snippet": "We tried Zendesk for our India ops. Total disaster. The NLP can't handle Hinglish. We need a specialized model for this.", "signal_type": "customer_pain", "sentiment": "negative", "relevance_score": 95, "confidence": "high", "verification_status": "corroborated", "decision_impact": "high", "bias_warning": "Small sample size.", "next_action": "Verify with B2C founders.", "metadata": {}}
        ]
    elif theme == "supertails":
        return [
            {"signal_id": _id(), "company_name": deal_name, "platform": "reddit", "source_url": "https://reddit.com/r/dogs", "source_title": "Best app for pet food delivery?", "published_at": "2026-06-01", "snippet": "I've been using Supertails for my Golden Retriever. They have specific breed consultations which are amazing. Delivery is fast too.", "signal_type": "praise", "sentiment": "positive", "relevance_score": 95, "confidence": "high", "verification_status": "corroborated", "decision_impact": "high", "bias_warning": "None", "next_action": "Verify consultation conversion rates.", "metadata": {}}
        ]
    else:
        profile = _get_deal_profile(deal_name)
        sector = profile.get("sector", "technology")
        return [
            {"signal_id": _id(), "company_name": deal_name, "platform": "reddit", "source_url": "https://reddit.com/r/technology", "source_title": f"{deal_name} shows promise in {sector}", "published_at": "2026-06-05", "snippet": f"Has anyone used {deal_name} for {sector}? The demo looked good.", "signal_type": "feature_request", "sentiment": "mixed", "relevance_score": 80, "confidence": "medium", "verification_status": "needs_verification", "decision_impact": "medium", "bias_warning": "None", "next_action": "Verify core value prop.", "metadata": {}}
        ]

# ----------------- REVIEWS -----------------
def generate_mock_review_signals(deal_name: str) -> list:
    theme = get_theme(deal_name)
    if theme == "zepto":
        return [
            {"signal_id": _id(), "company_name": deal_name, "platform": "app_store", "source_url": "https://apps.apple.com/", "source_title": "App Store Review", "published_at": "2026-06-10", "snippet": "UI is buttery smooth. Sometimes fresh produce is out of stock in the evening.", "signal_type": "feature_feedback", "sentiment": "mixed", "relevance_score": 80, "confidence": "high", "verification_status": "corroborated", "decision_impact": "low", "bias_warning": "None", "next_action": "Review supply chain efficiency.", "metadata": {}}
        ]
    elif theme == "bharatvector":
        return [
            {"signal_id": _id(), "company_name": deal_name, "platform": "g2", "source_url": "https://g2.com", "source_title": "Developer Review", "published_at": "2026-05-10", "snippet": "Documentation is a bit sparse compared to Qdrant, but the performance on local AWS regions is phenomenal.", "signal_type": "mixed_review", "sentiment": "mixed", "relevance_score": 85, "confidence": "medium", "verification_status": "public_anecdote", "decision_impact": "medium", "bias_warning": "None", "next_action": "Check developer docs investment.", "metadata": {}}
        ]
    elif theme == "neuraldesk":
        return [
            {"signal_id": _id(), "company_name": deal_name, "platform": "g2", "source_url": "https://g2.com", "source_title": "Zendesk Review", "published_at": "2026-04-10", "snippet": "Powerful but very expensive for what it does.", "signal_type": "competitor_complaint", "sentiment": "negative", "relevance_score": 90, "confidence": "high", "verification_status": "public_anecdote", "decision_impact": "medium", "bias_warning": "G2 incentivizes reviews.", "next_action": "Compare pricing.", "metadata": {}}
        ]
    elif theme == "supertails":
        return [
            {"signal_id": _id(), "company_name": deal_name, "platform": "app_store", "source_url": "https://apps.apple.com/", "source_title": "App Store Review", "published_at": "2026-06-10", "snippet": "Love the vet consultation feature! The medicines arrived in 2 hours.", "signal_type": "praise", "sentiment": "positive", "relevance_score": 90, "confidence": "high", "verification_status": "public_anecdote", "decision_impact": "medium", "bias_warning": "None", "next_action": "Check pharmacy margins.", "metadata": {}}
        ]
    else:
        profile = _get_deal_profile(deal_name)
        sector = profile.get("sector", "technology")
        return [
            {"signal_id": _id(), "company_name": deal_name, "platform": "g2", "source_url": "https://g2.com", "source_title": "Solid alternative", "published_at": "2026-05-20", "snippet": f"{deal_name} provides a solid core experience in {sector}, though integration takes time.", "signal_type": "mixed_review", "sentiment": "mixed", "relevance_score": 80, "confidence": "medium", "verification_status": "public_anecdote", "decision_impact": "low", "bias_warning": "G2 incentivizes reviews.", "next_action": "Review integration timeline.", "metadata": {}}
        ]

# ----------------- SOCIAL -----------------
def generate_mock_social_signals(deal_name: str) -> list:
    theme = get_theme(deal_name)
    if theme == "zepto":
        return [{"signal_id": _id(), "company_name": deal_name, "platform": "x_twitter", "source_url": "https://x.com", "source_title": "Tweet", "published_at": "2026-06-10", "snippet": "Can't believe Zepto delivered ice cream without it melting in Mumbai heat. Supply chain magic.", "signal_type": "praise", "sentiment": "positive", "relevance_score": 85, "confidence": "medium", "verification_status": "needs_verification", "decision_impact": "low", "bias_warning": "None", "next_action": "None", "metadata": {}}]
    elif theme == "bharatvector":
        return [{"signal_id": _id(), "company_name": deal_name, "platform": "linkedin", "source_url": "https://linkedin.com", "source_title": "CTO Post", "published_at": "2026-06-12", "snippet": "Just migrated 10B vectors to BharatVector. Query times dropped 40%.", "signal_type": "praise", "sentiment": "positive", "relevance_score": 95, "confidence": "high", "verification_status": "needs_verification", "decision_impact": "high", "bias_warning": "None", "next_action": "Call this CTO.", "metadata": {}}]
    elif theme == "neuraldesk":
        return [{"signal_id": _id(), "company_name": deal_name, "platform": "x_twitter", "source_url": "https://x.com", "source_title": "Tweet", "published_at": "2026-06-10", "snippet": "If anyone is building a modern solution for support automation, I'll pay today. Existing tools suck.", "signal_type": "market_pull", "sentiment": "frustrated", "relevance_score": 75, "confidence": "low", "verification_status": "needs_verification", "decision_impact": "low", "bias_warning": "None", "next_action": "None", "metadata": {}}]
    elif theme == "supertails":
        return [{"signal_id": _id(), "company_name": deal_name, "platform": "instagram", "source_url": "https://instagram.com", "source_title": "Influencer Post", "published_at": "2026-06-10", "snippet": "My Indie dog loves the new treats from Supertails! Best packaging ever.", "signal_type": "marketing_success", "sentiment": "positive", "relevance_score": 85, "confidence": "medium", "verification_status": "marketing_fluff", "decision_impact": "low", "bias_warning": "Sponsored post.", "next_action": "Check CAC on influencer channels.", "metadata": {}}]
    else:
        profile = _get_deal_profile(deal_name)
        sector = profile.get("sector", "technology")
        return [{"signal_id": _id(), "company_name": deal_name, "platform": "linkedin", "source_url": "https://linkedin.com", "source_title": "Founder Post", "published_at": "2026-06-05", "snippet": f"Excited to see what {deal_name} is building for {sector}. Looks promising.", "signal_type": "praise", "sentiment": "positive", "relevance_score": 70, "confidence": "low", "verification_status": "marketing_fluff", "decision_impact": "low", "bias_warning": "Friend of founder.", "next_action": "None", "metadata": {}}]


# ----------------- COMPETITORS -----------------
def generate_mock_competitor_signals(deal_name: str) -> list:
    theme = get_theme(deal_name)
    if theme == "zepto":
        return [
            {"competitor_name": "Blinkit", "praised_for": ["Zomato integration", "Print-outs delivery"], "complaints": ["Surge pricing on rain", "Missing items"], "feature_gaps": ["Cafe integration"], "pricing_pain": "High delivery fees at night.", "switching_triggers": ["Better discounts on Zepto"], "market_whitespace": "Premium fresh produce.", "diligence_question": "How do your dark store unit economics compare to Blinkit?"},
            {"competitor_name": "Instamart", "praised_for": ["Swiggy ecosystem"], "complaints": ["Slower delivery times recently"], "feature_gaps": ["10 min guarantee failing"], "pricing_pain": "None", "switching_triggers": ["Slow delivery"], "market_whitespace": "Consistent speed.", "diligence_question": "What is your on-time delivery percentage?"}
        ]
    elif theme == "bharatvector":
        return [
            {"competitor_name": "Pinecone", "praised_for": ["Fully managed", "Easy API"], "complaints": ["Very expensive at scale", "US regions only"], "feature_gaps": ["Indic language optimization", "On-prem deployment"], "pricing_pain": "Prohibitive for massive scale.", "switching_triggers": ["Cost reduction"], "market_whitespace": "Local deployment for Indian BFSI.", "diligence_question": "Can you handle 100k QPS on a single node?"}
        ]
    elif theme == "neuraldesk":
        return [
            {"competitor_name": "Zendesk", "praised_for": ["Deep integrations"], "complaints": ["Bloated UI", "Takes 3-6 months to configure"], "feature_gaps": ["Instant AI categorization"], "pricing_pain": "Per-seat pricing scales terribly.", "switching_triggers": ["Cost optimization"], "market_whitespace": "Usage-based pricing.", "diligence_question": "Can you replace Zendesk entirely?"}
        ]
    elif theme == "supertails":
        return [
            {"competitor_name": "Heads Up For Tails", "praised_for": ["Premium offline stores", "Brand trust"], "complaints": ["Very expensive", "App is slow"], "feature_gaps": ["Online vet pharmacy"], "pricing_pain": "Premium markup on basic accessories.", "switching_triggers": ["Better online deals", "Need medicine quickly"], "market_whitespace": "Digital-first veterinary care.", "diligence_question": "How do your customer acquisition costs compare to HUFT?"}
        ]
    else:
        profile = _get_deal_profile(deal_name)
        sector = profile.get("sector", "technology")
        return [
            {"competitor_name": f"Incumbent in {sector}", "praised_for": ["Scale and stability"], "complaints": ["Slow product velocity", "Poor customer support"], "feature_gaps": ["Modern UX"], "pricing_pain": "Expensive enterprise tiers.", "switching_triggers": ["Desire for modern alternatives"], "market_whitespace": f"Self-serve {sector} focus.", "diligence_question": f"How does {deal_name} defend against incumbents lowering prices?"}
        ]

# ----------------- PAIN POINTS -----------------
def generate_mock_pain_points(deal_name: str) -> list:
    theme = get_theme(deal_name)
    if theme == "zepto":
        return [
            {"pain_point": "Fresh produce quality inconsistency", "user_language": "Sometimes the tomatoes are terrible.", "example_snippets": ["Produce is hit or miss."], "frequency": "High", "platforms": ["reddit"], "customer_persona": "Housewife", "urgency": "High", "willingness_to_pay_signal": "Yes", "existing_workaround": "Local vendor", "related_competitor": "Blinkit", "startup_relevance": "Core to retention", "diligence_question": "How do you QA fresh produce?"}
        ]
    elif theme == "bharatvector":
        return [
            {"pain_point": "High latency on global vector DBs", "user_language": "Pinecone adds 200ms latency to India.", "example_snippets": ["US-east-1 latency is killing our RAG."], "frequency": "High", "platforms": ["reddit", "linkedin"], "customer_persona": "AI Engineer", "urgency": "Critical", "willingness_to_pay_signal": "Yes", "existing_workaround": "Local FAISS indices", "related_competitor": "Pinecone", "startup_relevance": "Core wedge", "diligence_question": "What is your p99 latency in ap-south-1?"}
        ]
    elif theme == "neuraldesk":
        return [
            {"pain_point": "Existing tools fail at local language context", "user_language": "Total disaster handling Hinglish.", "example_snippets": ["The NLP can't handle Hinglish."], "frequency": "Very High", "platforms": ["reddit"], "customer_persona": "Support Manager", "urgency": "Critical", "willingness_to_pay_signal": "Yes", "existing_workaround": "Manual human review", "related_competitor": "Zendesk", "startup_relevance": "Core thesis", "diligence_question": "Validate cost savings."}
        ]
    elif theme == "supertails":
        return [
            {"pain_point": "Lack of reliable online vet access", "user_language": "My local vet is never available on weekends.", "example_snippets": ["Need a vet at 10pm.", "Hard to find specialized diets locally."], "frequency": "High", "platforms": ["reddit", "instagram"], "customer_persona": "Pet Parent", "urgency": "High", "willingness_to_pay_signal": "Yes", "existing_workaround": "Driving far to 24/7 clinics", "related_competitor": "Local Vets", "startup_relevance": "Core wedge", "diligence_question": "What is the margin on telehealth calls?"}
        ]
    else:
        profile = _get_deal_profile(deal_name)
        sector = profile.get("sector", "technology")
        return [
            {"pain_point": f"Lack of deep integrations in {sector}", "user_language": f"Can't connect it with our legacy {sector} stack.", "example_snippets": [f"Love {deal_name} but wish it integrated better."], "frequency": "Medium", "platforms": ["reddit", "g2"], "customer_persona": "User", "urgency": "Medium", "willingness_to_pay_signal": "Yes", "existing_workaround": "Manual CSV exports", "related_competitor": f"Incumbent in {sector}", "startup_relevance": "Key expansion blocker", "diligence_question": "What is your integration roadmap?"}
        ]

# ----------------- REPUTATION RISKS -----------------
def generate_mock_reputation_risks(deal_name: str) -> list:
    theme = get_theme(deal_name)
    if theme == "zepto":
        return [{"risk": "Rider accidents and safety concerns", "source": "News/Twitter", "severity": "high", "confidence": "high", "verification_required": True, "suggested_diligence_action": "Review rider insurance policies."}]
    elif theme == "bharatvector":
        return [{"risk": "Core engine is just a FAISS wrapper", "source": "HackerNews", "severity": "medium", "confidence": "low", "verification_required": True, "suggested_diligence_action": "Technical due diligence on their proprietary graph index."}]
    elif theme == "neuraldesk":
        return [{"risk": "Data Privacy and PII Leaks", "source": "Reddit", "severity": "high", "confidence": "high", "verification_required": True, "suggested_diligence_action": "Check SOC2 compliance."}]
    elif theme == "supertails":
        return [{"risk": "Counterfeit pet food supply chain", "source": "Twitter", "severity": "medium", "confidence": "low", "verification_required": True, "suggested_diligence_action": "Review inventory sourcing and QA processes."}]
    else:
        profile = _get_deal_profile(deal_name)
        sector = profile.get("sector", "technology")
        return [{"risk": f"Unproven at scale in {sector}", "source": "G2 Reviews", "severity": "medium", "confidence": "medium", "verification_required": True, "suggested_diligence_action": "Ask for reference calls with top 3 largest customers."}]
