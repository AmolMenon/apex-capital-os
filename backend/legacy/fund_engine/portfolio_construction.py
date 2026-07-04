from fund_engine.fund_schemas import PortfolioConstructionOutput
from typing import List, Dict, Any

class PortfolioConstructionAnalyzer:
    @staticmethod
    def analyze(deals: List[Dict[str, Any]]) -> PortfolioConstructionOutput:
        deals_by_sector = {}
        deals_by_stage = {}
        capital_allocated_by_sector = {}
        
        total_apex_score = 0
        total_ic_readiness = 0
        total_evidence_score = 0
        active_count = len(deals)
        
        for deal in deals:
            sector = deal.get("sector", "Unknown")
            stage = deal.get("stage", "Unknown")
            capital = deal.get("capital_allocated", 0)
            
            deals_by_sector[sector] = deals_by_sector.get(sector, 0) + 1
            deals_by_stage[stage] = deals_by_stage.get(stage, 0) + 1
            capital_allocated_by_sector[sector] = capital_allocated_by_sector.get(sector, 0) + capital
            
            total_apex_score += deal.get("apex_score", 0)
            total_ic_readiness += deal.get("ic_readiness", 0)
            total_evidence_score += deal.get("evidence_score", 0)
            
        avg_apex = total_apex_score / active_count if active_count > 0 else 0
        avg_ic = total_ic_readiness / active_count if active_count > 0 else 0
        avg_evidence = total_evidence_score / active_count if active_count > 0 else 0
        
        sector_warnings = []
        for sec, count in deals_by_sector.items():
            if active_count > 0 and count / active_count > 0.4:
                sector_warnings.append(f"Overexposed to {sec}: {int((count/active_count)*100)}% of pipeline.")
                
        stage_warnings = []
        for stg, count in deals_by_stage.items():
            if active_count > 0 and count / active_count > 0.5:
                stage_warnings.append(f"Overexposed to {stg} stage: {int((count/active_count)*100)}% of pipeline.")
                
        general_warnings = []
        if avg_evidence < 50 and active_count > 0:
            general_warnings.append("Too many low-evidence deals in pipeline.")
        if avg_ic < 50 and active_count > 0:
            general_warnings.append("Too much capital allocated to low-IC-readiness companies.")
        
        # We need a check for fund returners, but we'll leave that to the power law model mostly,
        # or we could flag it here if none exist.
        
        return PortfolioConstructionOutput(
            deals_by_sector=deals_by_sector,
            deals_by_stage=deals_by_stage,
            active_pipeline_count=active_count,
            average_apex_score=avg_apex,
            average_ic_readiness=avg_ic,
            capital_allocated_by_sector=capital_allocated_by_sector,
            sector_warnings=sector_warnings,
            stage_warnings=stage_warnings,
            general_warnings=general_warnings
        )
