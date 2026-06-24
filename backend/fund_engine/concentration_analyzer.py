from fund_engine.fund_schemas import ConcentrationRiskOutput
from typing import List, Dict, Any

class ConcentrationAnalyzer:
    @staticmethod
    def analyze(
        deals_by_sector: Dict[str, int],
        deals_by_stage: Dict[str, int],
        capital_allocated_by_sector: Dict[str, int],
        total_active_deals: int,
        total_allocated_capital: int
    ) -> ConcentrationRiskOutput:
        
        major_warnings = []
        suggested_actions = []
        risk_score = 0
        
        sector_concentration = {}
        for sec, count in deals_by_sector.items():
            pct = count / total_active_deals if total_active_deals > 0 else 0
            sector_concentration[sec] = round(pct, 2)
            if pct > 0.5:
                major_warnings.append(f"Severe sector concentration: {int(pct*100)}% of deals in {sec}.")
                suggested_actions.append(f"Pause new investments in {sec} until portfolio diversifies.")
                risk_score += 30
            elif pct > 0.3:
                major_warnings.append(f"High sector concentration: {int(pct*100)}% of deals in {sec}.")
                suggested_actions.append(f"Raise diligence bar for new {sec} deals.")
                risk_score += 15
                
        stage_concentration = {}
        for stg, count in deals_by_stage.items():
            pct = count / total_active_deals if total_active_deals > 0 else 0
            stage_concentration[stg] = round(pct, 2)
            if pct > 0.6:
                major_warnings.append(f"Severe stage concentration: {int(pct*100)}% of deals in {stg}.")
                suggested_actions.append(f"Seek deals outside {stg} to balance fund duration risk.")
                risk_score += 20
                
        # Check capital concentration
        for sec, cap in capital_allocated_by_sector.items():
            pct_cap = cap / total_allocated_capital if total_allocated_capital > 0 else 0
            if pct_cap > 0.4:
                major_warnings.append(f"Capital risk: {int(pct_cap*100)}% of deployed capital is in {sec}.")
                risk_score += 25
                
        if risk_score > 100:
            risk_score = 100
            
        if risk_score < 20 and total_active_deals > 0:
            suggested_actions.append("Portfolio is well balanced. Continue executing strategy.")
            
        return ConcentrationRiskOutput(
            concentration_risk_score=risk_score,
            sector_concentration=sector_concentration,
            stage_concentration=stage_concentration,
            major_warnings=major_warnings,
            suggested_actions=suggested_actions
        )
