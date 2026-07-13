from fund_engine.fund_schemas import ReserveStrategyOutput

class ReserveModel:
    @staticmethod
    def calculate(
        initial_check: int,
        apex_score: int,
        ic_readiness: int,
        power_law_score: int,
        evidence_score: int
    ) -> ReserveStrategyOutput:
        
        # Base logic for reserving capital
        reserve_ratio = 1.0 # default 1:1 reserve
        priority = "Medium"
        rationale = "Standard reserve allocation based on initial check size."
        warning = None
        
        # High conviction
        if apex_score >= 80 and ic_readiness >= 80:
            reserve_ratio = 2.0
            priority = "High"
            rationale = "High conviction deal (Apex > 80, IC Readiness > 80). Doubling reserve to protect pro-rata and build ownership."
        
        # High power law potential but low evidence
        elif power_law_score >= 80 and evidence_score < 60:
            reserve_ratio = 1.0
            priority = "Medium"
            rationale = "High power law potential but low evidence. Maintain standard reserve for optionality."
            warning = "High risk. Monitor closely before deploying reserves."
        
        # Low conviction
        elif apex_score < 60 or evidence_score < 50:
            reserve_ratio = 0.5
            priority = "Low"
            rationale = "Low conviction or low evidence. Reserving minimally."
            warning = "Capital at risk. High hurdle for follow-on."
            
        reserve_amount = int(initial_check * reserve_ratio)
        total_capital = initial_check + reserve_amount
        
        return ReserveStrategyOutput(
            initial_check=initial_check,
            reserve_amount=reserve_amount,
            total_capital_planned=total_capital,
            follow_on_priority=priority,
            rationale=rationale,
            capital_allocation_warning=warning
        )
