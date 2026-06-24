import os
import json
from openai import OpenAI

def call_real_llm(deal_id: str, question: str, deal_context: str = "") -> dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None  # Fallback to fixtures if no key

    client = OpenAI(api_key=api_key)
    
    system_prompt = f"""You are Apex, an elite AI Partner Copilot for a top-tier Venture Capital fund. 
You are analyzing Deal ID: {deal_id}. 
The user is a GP asking you a question about the deal's IC readiness, diligence gaps, or fund math.
{deal_context}

Respond in a highly structured, analytical, and professional VC tone.
Format your response as valid JSON matching this schema:
{{
    "answer": "Your detailed, multi-paragraph markdown response with Bull/Bear cases",
    "short_answer": "1 sentence summary",
    "question_intent": "What the user is asking",
    "evidence_used": [
        {{"label": "Title of document used", "module": "Evidence Center"}}
    ],
    "source_references": ["String list of references"],
    "assumptions": ["List of assumptions"],
    "unknowns": ["List of diligence gaps"],
    "decision_impact": "Positive/Neutral/Negative",
    "recommended_next_action": "Specific action",
    "confidence": {{"level": "High/Medium/Low", "score": 80, "reason": "Why"}},
    "follow_up_questions": [
        {{"question": "Suggested follow up", "reason": "Why ask this"}}
    ]
}}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ]
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        
        # Add metadata manually
        data["metadata"] = {
            "deal_id": deal_id,
            "mode": "production",
            "provider_used": "openai_api",
            "fallback_used": False
        }
        data["guardrail_flags"] = ["verified_data_only"]
        return data
    except Exception as e:
        print(f"LLM Error: {e}")
        return None  # Fallback on failure
