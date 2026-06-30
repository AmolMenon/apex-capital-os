import google.generativeai as genai
from pydantic import BaseModel, Field
from typing import List

class ScenarioImpact(BaseModel):
    scenario_type: str = Field(description="Bear, Base, Bull, or Macro Shock")
    description: str = Field(description="Description of the scenario and its assumptions")
    revenue_impact_percent: int = Field(description="Estimated impact on revenue (-100 to +1000)")
    survival_probability: float = Field(description="Probability of survival (0.0 to 1.0)")
    recommendation: str = Field(description="How this impacts the investment recommendation")

class ScenarioSimulationReport(BaseModel):
    scenarios: List[ScenarioImpact]
    overall_resilience: str = Field(description="Overall resilience of the startup to market shocks")

class ScenarioEngine:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-pro', generation_config={"response_mime_type": "application/json"})

    async def simulate(self, deal_financials: str, market_context: str) -> ScenarioSimulationReport:
        """
        Generates Bull, Base, Bear, and Macro Shock scenarios.
        """
        prompt = f"""
        You are a quantitative risk modeler for a venture capital firm.
        Simulate the impact of standard scenarios (Bear, Base, Bull, Macro Shock) on the following startup.
        
        Financials/Traction: {deal_financials}
        Market Context: {market_context}
        
        Output a JSON object matching the ScenarioSimulationReport schema.
        """
        
        response = self.model.generate_content(prompt)
        try:
            return ScenarioSimulationReport.parse_raw(response.text)
        except Exception:
            return ScenarioSimulationReport(scenarios=[], overall_resilience="Simulation failed.")
