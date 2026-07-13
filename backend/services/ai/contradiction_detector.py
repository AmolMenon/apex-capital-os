import json
import google.generativeai as genai
from pydantic import BaseModel, Field
from typing import List

class Contradiction(BaseModel):
    severity: str = Field(description="HIGH, MEDIUM, LOW")
    reason: str = Field(description="Clear explanation of the logical or numerical contradiction")
    evidence: str = Field(description="Verbatim quotes or data points from documents demonstrating the contradiction")
    missing_verification: str = Field(description="What data is required to verify or resolve this discrepancy")
    investor_implication: str = Field(description="How this impacts investor trust, valuation, or perceived risk")
    claim_a: str = Field(description="The first claim or data point")
    source_a: str = Field(description="Source document of the first claim")
    claim_b: str = Field(description="The conflicting claim or data point")
    source_b: str = Field(description="Source document of the conflicting claim")

class ContradictionReport(BaseModel):
    contradictions: List[Contradiction]
    summary: str = Field(description="Overall summary of data integrity")

class ContradictionDetector:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-pro', generation_config={"response_mime_type": "application/json"})

    async def detect(self, documents_text: dict) -> ContradictionReport:
        """
        Takes a dict of {source_name: text_content} and looks for logical contradictions.
        """
        prompt = f"""
        You are a highly analytical institutional venture capital auditor.
        Analyze the following documents and identify any strict logical or numerical contradictions.

        Specifically look for:
        1. Deck vs Financial Model discrepancies.
        2. Deck vs KPI Sheet discrepancies.
        3. Version vs Version changes.
        4. Internal Metric Inconsistency (e.g. CAC/LTV math not matching raw numbers).
        5. Market Narrative vs Numbers (e.g. claiming bottom-up growth but top-down sizing).
        6. Competition inconsistencies.

        DO NOT fabricate contradictions. If everything is consistent, return an empty contradictions array.
        
        Documents:
        {json.dumps(documents_text)}
        
        Output a JSON object matching the ContradictionReport schema.
        """
        
        response = self.model.generate_content(prompt)
        try:
            return ContradictionReport.parse_raw(response.text)
        except Exception:
            return ContradictionReport(contradictions=[], summary="Failed to analyze documents due to AI error.")
