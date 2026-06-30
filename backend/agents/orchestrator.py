import time
from typing import List, Dict, Any

class AgentDebateOrchestrator:
    def __init__(self, deal_name: str, base_health: int):
        self.deal_name = deal_name
        self.base_health = base_health
        self.logs = []
        
    def _add_log(self, agent: str, role: str, message: str, sentiment: str = "neutral"):
        self.logs.append({
            "agent": agent,
            "role": role,
            "message": message,
            "sentiment": sentiment,
            "timestamp": time.time()
        })

    def run_simulation(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        revenue_drop = parameters.get("revenue_drop_pct", 0)
        cac_increase = parameters.get("cac_increase_pct", 0)
        founder_leaves = parameters.get("founder_leaves", False)
        
        self._add_log("System", "Orchestrator", f"Initializing Scenario Simulation for {self.deal_name}...")
        
        health_delta = 0
        
        # Financial Analyst
        if revenue_drop > 20:
            self._add_log("Sarah (Financial)", "Financial Analyst", f"A {revenue_drop}% revenue drop significantly impacts our 3-year IRR targets. It extends the runway requirement by 14 months.", "negative")
            health_delta -= 15
        elif revenue_drop > 0:
            self._add_log("Sarah (Financial)", "Financial Analyst", f"A {revenue_drop}% revenue drop is manageable but we need to see corresponding cost-cutting measures.", "warning")
            health_delta -= 5
            
        if cac_increase > 10:
            self._add_log("Sarah (Financial)", "Financial Analyst", f"CAC increasing by {cac_increase}% destroys the LTV:CAC ratio. The unit economics are no longer venture-scale.", "negative")
            health_delta -= 10
            
        # Market Analyst
        if founder_leaves:
            self._add_log("David (Market)", "Market Analyst", "Founder departure at this stage is catastrophic. The entire GTM motion is founder-led. We need to freeze all capital deployment.", "negative")
            health_delta -= 25
        else:
            self._add_log("David (Market)", "Market Analyst", "As long as the core team remains, the market tailwinds are strong enough to absorb slight execution hiccups.", "positive")
            health_delta += 2
            
        # Technical Analyst
        self._add_log("Elena (Technical)", "Technical Analyst", "I've reviewed the product velocity. They can ship features fast enough to pivot if the current GTM motion fails. We have a margin of safety here.", "positive")
        health_delta += 5
        
        # Synthesis
        new_health = max(0, min(100, self.base_health + health_delta))
        
        if new_health < 40:
            recommendation = "Hard Pass - Risk Too High"
        elif new_health < 65:
            recommendation = "Hold / Monitor"
        else:
            recommendation = "Proceed with Caution"
            
        self._add_log("System", "Orchestrator", f"Debate concluded. Synthesized recommendation: {recommendation}", "neutral")
        
        return {
            "new_health_score": new_health,
            "health_delta": health_delta,
            "recommendation": recommendation,
            "debate_logs": self.logs
        }
