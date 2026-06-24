"""
Centralized prompt templates for Apex Capital VC workflows.
These templates enforce strict VC logic and explicitly request JSON outputs.
"""

COMMON_INSTRUCTIONS = """
- You are a VC analyst.
- Be specific, skeptical, and evidence-aware.
- Separate founder narrative from verified evidence.
- Do not overstate confidence.
- If information is missing, say so.
- Return only valid JSON matching the requested schema.
- Do not include markdown.
- Do not include explanatory text outside JSON.
"""

INVESTMENT_MEMO_PROMPT = COMMON_INSTRUCTIONS + """
Based on the provided deal context, write a structured investment memo.

RULES:
- Do not recommend Invest if evidence, IC readiness, conversation credibility, or fund fit is weak.

SCHEMA:
{
  "executive_snapshot": "A 2-3 sentence overview of the company, what they do, and the primary investment thesis.",
  "market_thesis": "Analysis of the market opportunity, tailwinds, and why now.",
  "founder_market_fit": "Evaluation of the team's ability to execute this specific vision.",
  "product_analysis": "Assessment of the product, technical moat, and user experience."
}

CONTEXT:
{context}
"""

MARKET_RESEARCH_PROMPT = COMMON_INSTRUCTIONS + """
Analyze the market opportunity for this startup.

SCHEMA:
{
  "market_attractiveness_score": 85,
  "market_attractiveness_reason": "Explanation of the score",
  "market_tailwinds": ["trend 1", "trend 2"],
  "market_headwinds": ["risk 1", "risk 2"]
}

CONTEXT:
{context}
"""

COMPETITOR_ANALYSIS_PROMPT = COMMON_INSTRUCTIONS + """
Identify the primary competitors for this startup based on their description and market.

SCHEMA:
{
  "competitive_intensity_score": 70,
  "competitive_intensity_reason": "Why this score?",
  "competitors": [
    {
      "name": "Competitor Name",
      "threat_level": "High/Medium/Low",
      "differentiation": "How this startup differentiates from them"
    }
  ]
}

CONTEXT:
{context}
"""

CUSTOMER_PERSONA_PROMPT = COMMON_INSTRUCTIONS + """
Define the target customer personas for this startup.

SCHEMA:
{
  "personas": [
    {
      "name": "Persona Title",
      "pain_point": "Specific problem they have"
    }
  ]
}

CONTEXT:
{context}
"""

DECK_CLAIM_EXTRACTION_PROMPT = COMMON_INSTRUCTIONS + """
Extract specific factual claims made in the provided pitch deck text.

SCHEMA:
{
  "extracted_claims": [
    {
      "category": "Traction/Financials/Team/etc",
      "claim": "The specific claim",
      "is_supported": true
    }
  ],
  "missing_info_flags": ["Missing item 1", "Missing item 2"],
  "deck_quality_score": 75,
  "deck_quality_reason": "Explanation"
}

DECK TEXT:
{context}
"""

CONVERSATION_ANALYSIS_PROMPT = COMMON_INSTRUCTIONS + """
Analyze the provided transcript between the founder and investor.
You must analyze founder clarity, directness, evidence quality, contradictions, evasiveness, open follow-ups, and decision impact.

SCHEMA:
{
  "clarity_score": 85,
  "directness": "High",
  "evidence_quality": "Strong traction...",
  "contradictions": [],
  "evasiveness": "Slight evasiveness...",
  "open_follow_ups": ["Can you share..."],
  "decision_impact": "Positive overall..."
}

TRANSCRIPT:
{context}
"""

DILIGENCE_PLAN_PROMPT = COMMON_INSTRUCTIONS + """
Based on the identified risks and missing information, generate a diligence plan.

SCHEMA:
{
  "founder_follow_ups": ["Question 1", "Question 2"],
  "data_room_requests": ["Doc 1", "Doc 2"],
  "customer_reference_questions": ["Question 1", "Question 2"]
}

CONTEXT:
{context}
"""

PARTNER_PUSHBACK_PROMPT = COMMON_INSTRUCTIONS + """
Generate 3-5 tough, structural pushbacks against investing in this company.

SCHEMA:
{
  "pushbacks": ["Pushback 1", "Pushback 2", "Pushback 3"]
}

CONTEXT:
{context}
"""

IC_RECOMMENDATION_PROMPT = COMMON_INSTRUCTIONS + """
Formulate a final recommendation for the Investment Committee.

SCHEMA:
{
  "decision": "Strong Invest / Invest / Pass / Conditional",
  "explanation": "2-3 sentences explaining why",
  "key_catalysts": ["Catalyst 1", "Catalyst 2"]
}

CONTEXT:
{context}
"""

FUND_FIT_PROMPT = COMMON_INSTRUCTIONS + """
Explain the fund fit for this startup based on thesis, stage, and sector.

SCHEMA:
{
  "fit_explanation": "Explanation of fund fit..."
}

CONTEXT:
{context}
"""

FOUNDER_EMAIL_PROMPT = COMMON_INSTRUCTIONS + """
Draft an email to the founder outlining follow-ups.

SCHEMA:
{
  "subject": "Follow up regarding...",
  "body": "Hi Founders..."
}

CONTEXT:
{context}
"""

CUSTOMER_REFERENCE_SCRIPT_PROMPT = COMMON_INSTRUCTIONS + """
Generate a script for a customer reference call.

SCHEMA:
{
  "script": "Script to use for reference calls..."
}

CONTEXT:
{context}
"""

PLATFORM_REDDIT_PROMPT = COMMON_INSTRUCTIONS + """
Analyze the public sentiment for the startup "{context}" on Reddit based on your general knowledge.
Return an array of mock Reddit findings that mimic real user discussions.
SCHEMA:
{
  "findings": [
    {
      "company_name": "...",
      "platform": "reddit",
      "source_url": "https://reddit.com/r/SaaS/...",
      "source_title": "...",
      "published_at": "YYYY-MM-DD",
      "snippet": "...",
      "signal_type": "competitor_complaint|market_pull|praise|pricing_complaint|feature_request|churn_risk",
      "sentiment": "positive|negative|neutral|mixed|frustrated",
      "relevance_score": 0-100,
      "confidence": "high|medium|low",
      "verification_status": "corroborated|public_anecdote|needs_verification|marketing_fluff",
      "decision_impact": "high|medium|low",
      "bias_warning": "...",
      "next_action": "...",
      "metadata": {}
    }
  ]
}
"""

PLATFORM_REVIEW_PROMPT = COMMON_INSTRUCTIONS + """
Analyze the public sentiment for the startup "{context}" on software review platforms (G2, Capterra) based on your general knowledge.
Return an array of mock review findings.
SCHEMA:
{
  "findings": [
    {
      "company_name": "...",
      "platform": "g2|capterra",
      "source_url": "...",
      "source_title": "...",
      "published_at": "YYYY-MM-DD",
      "snippet": "...",
      "signal_type": "...",
      "sentiment": "positive|negative|neutral|mixed|frustrated",
      "relevance_score": 0-100,
      "confidence": "high|medium|low",
      "verification_status": "corroborated|public_anecdote|needs_verification|marketing_fluff",
      "decision_impact": "high|medium|low",
      "bias_warning": "...",
      "next_action": "...",
      "metadata": {}
    }
  ]
}
"""

PLATFORM_SOCIAL_PROMPT = COMMON_INSTRUCTIONS + """
Analyze the public sentiment for the startup "{context}" on social media (X/Twitter, LinkedIn) based on your general knowledge.
Return an array of mock social findings.
SCHEMA:
{
  "findings": [
    {
      "company_name": "...",
      "platform": "x_twitter|linkedin",
      "source_url": "...",
      "source_title": "...",
      "published_at": "YYYY-MM-DD",
      "snippet": "...",
      "signal_type": "...",
      "sentiment": "positive|negative|neutral|mixed|frustrated",
      "relevance_score": 0-100,
      "confidence": "high|medium|low",
      "verification_status": "corroborated|public_anecdote|needs_verification|marketing_fluff",
      "decision_impact": "high|medium|low",
      "bias_warning": "...",
      "next_action": "...",
      "metadata": {}
    }
  ]
}
"""

PLATFORM_COMPETITOR_PROMPT = COMMON_INSTRUCTIONS + """
Analyze competitor signals for the startup "{context}" based on your general knowledge.
Return an array of findings regarding their competition.
SCHEMA:
{
  "findings": [
    {
      "company_name": "...",
      "platform": "competitor_website|news|app_store",
      "source_url": "...",
      "source_title": "...",
      "published_at": "YYYY-MM-DD",
      "snippet": "...",
      "signal_type": "...",
      "sentiment": "...",
      "relevance_score": 0-100,
      "confidence": "...",
      "verification_status": "...",
      "decision_impact": "...",
      "bias_warning": "...",
      "next_action": "...",
      "metadata": {"competitor": "..."}
    }
  ]
}
"""

PLATFORM_PAIN_POINT_PROMPT = COMMON_INSTRUCTIONS + """
Extract the top 3 critical pain points from the following collected platform signals for "{context}":
{signals}

SCHEMA:
{
  "pain_points": [
    {
      "pain_point": "Description of the pain point",
      "user_language": "A quote or summary of how users say it",
      "example_snippets": ["Quote 1"],
      "frequency": "High|Medium|Low",
      "platforms": ["reddit", "x_twitter", ...],
      "customer_persona": "Who is complaining",
      "urgency": "High|Medium|Low",
      "willingness_to_pay_signal": "Yes|No|Unknown",
      "existing_workaround": "What do they do today?",
      "related_competitor": "Competitor name if mentioned",
      "startup_relevance": "How does this relate to {context}?",
      "diligence_question": "What question should we ask the founder about this?"
    }
  ]
}
"""

PLATFORM_REPUTATION_RISK_PROMPT = COMMON_INSTRUCTIONS + """
Analyze the following platform signals for "{context}" and identify any reputation risks, red flags, or severe liabilities.
{signals}

SCHEMA:
{
  "reputation_risks": [
    {
      "risk_type": "security_vulnerability|toxic_culture|founder_controversy|fake_reviews|unethical_practices",
      "severity": "critical|high|medium|low",
      "description": "...",
      "evidence_snippet": "...",
      "source_platform": "...",
      "diligence_required": "What needs to be verified?",
      "deal_breaker_potential": true|false
    }
  ]
}
"""

PLATFORM_SENTIMENT_PROMPT = COMMON_INSTRUCTIONS + """
Analyze the following platform signals for "{context}" and provide an aggregate sentiment summary.
{signals}

SCHEMA:
{
  "sentiment_summary": {
    "positive": 40,
    "negative": 30,
    "mixed": 20,
    "neutral": 10,
    "confidence": "high|medium|low",
    "sample_size": 100,
    "strongest_themes": ["theme 1", "theme 2"],
    "weakest_themes": ["theme 1", "theme 2"],
    "the_good": ["Positive insight 1", "Positive insight 2"],
    "the_bad": ["Negative insight 1", "Negative insight 2"],
    "general_consensus": "A 2-3 sentence executive synthesis of the consensus."
  }
}
"""
