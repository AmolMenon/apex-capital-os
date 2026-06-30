import json
import google.generativeai as genai
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class CommitteeMemberOpinion(BaseModel):
    role: str = Field(description="The role of the committee member, e.g. Founder Agent")
    conviction_score: int = Field(description="Score out of 100 based on this specific domain")
    key_strengths: List[str] = Field(description="Strengths found in this domain")
    key_risks: List[str] = Field(description="Risks found in this domain")
    opinion_summary: str = Field(description="A 2-sentence summary of the agent's opinion")

class EvidenceItem(BaseModel):
    claim: str = Field(description="The specific claim being made")
    source: str = Field(description="Where this information was found")
    confidence: float = Field(description="Confidence from 0.0 to 1.0")

class CommitteeDecision(BaseModel):
    final_conviction_score: int = Field(description="Synthesized score out of 100")
    recommendation: str = Field(description="INVEST, PASS, or WAIT")
    why: str = Field(description="Explanation of the final decision")
    compared_to_what: str = Field(description="Comparison to market or past portfolio companies")
    evidence: List[EvidenceItem] = Field(description="List of evidence backing the claims")
    what_changed: str = Field(description="What changed since the last review")
    next_steps: str = Field(description="What the deal team should do next")

class AICommitteeOrchestrator:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        # In a real setup, we would use gemini-1.5-pro for complex synthesis and flash for agents
        self.agent_model = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})
        self.moderator_model = genai.GenerativeModel('gemini-1.5-pro', generation_config={"response_mime_type": "application/json"})

    async def run_subagent(self, role: str, deal_context: str) -> CommitteeMemberOpinion:
        prompt = f"""
        You are the {role} on the Apex Capital Investment Committee.
        Analyze the following startup context ONLY from your perspective as the {role}.
        Ignore other domains.
        Context: {deal_context}
        Output a JSON object matching the CommitteeMemberOpinion schema.
        """
        response = self.agent_model.generate_content(prompt)
        try:
            return CommitteeMemberOpinion.parse_raw(response.text)
        except Exception as e:
            # Fallback mock for resilience
            return CommitteeMemberOpinion(
                role=role,
                conviction_score=50,
                key_strengths=["Data missing"],
                key_risks=["Could not parse LLM output"],
                opinion_summary="Unable to form a complete opinion."
            )

    async def run_committee(self, deal_context: str, previous_history: str = "") -> CommitteeDecision:
        roles = [
            "Founder Agent", "Market Agent", "Financial Agent", 
            "Technology Agent", "Competition Agent", "Risk Agent", 
            "Legal Agent", "Portfolio Fit Agent"
        ]
        
        opinions = []
        for role in roles:
            opinion = await self.run_subagent(role, deal_context)
            opinions.append(opinion.dict())
            
        moderator_prompt = f"""
        You are the Moderator of the Apex Capital Investment Committee.
        Synthesize the following subagent opinions into a final decision.
        
        Subagent Opinions: {json.dumps(opinions)}
        Previous History: {previous_history}
        
        Output a JSON object matching the CommitteeDecision schema.
        You MUST provide evidence for your claims, answer why, and what changed.
        """
        
        response = self.moderator_model.generate_content(moderator_prompt)
        try:
            return CommitteeDecision.parse_raw(response.text)
        except Exception:
            return CommitteeDecision(
                final_conviction_score=50,
                recommendation="WAIT",
                why="Fallback mechanism activated due to LLM error.",
                compared_to_what="N/A",
                evidence=[],
                what_changed="N/A",
                next_steps="Manual review required."
            )
