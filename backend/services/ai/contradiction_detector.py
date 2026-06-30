import json
import google.generativeai as genai
from pydantic import BaseModel, Field
from typing import List

class Contradiction(BaseModel):
    claim_a: str = Field(description="The first claim")
    source_a: str = Field(description="Source of the first claim")
    claim_b: str = Field(description="The conflicting claim")
    source_b: str = Field(description="Source of the conflicting claim")
    explanation: str = Field(description="Why this is a contradiction")
    severity: str = Field(description="HIGH, MEDIUM, LOW")

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
        You are a highly analytical auditor for a venture capital firm.
        Analyze the following documents and identify any logical contradictions or inconsistencies between them.
        
        Documents:
        {json.dumps(documents_text)}
        
        Output a JSON object matching the ContradictionReport schema.
        """
        
        response = self.model.generate_content(prompt)
        try:
            return ContradictionReport.parse_raw(response.text)
        except Exception:
            return ContradictionReport(contradictions=[], summary="Failed to analyze documents due to AI error.")
