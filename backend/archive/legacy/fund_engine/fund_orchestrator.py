from fund_engine.fund_schemas import FundFitAssessmentOutput
from fund_engine.fund_model import FundModel
from fund_engine.ownership_calculator import OwnershipCalculator
from fund_engine.reserve_model import ReserveModel
from fund_engine.power_law_simulator import PowerLawSimulator
from fund_engine.thesis_fit import ThesisFitEngine
from typing import Dict, Any

class FundOrchestrator:
    @staticmethod
    def assess_deal(
        deal_id: int,
        company_name: str,
        deal_data: Dict[str, Any]
    ) -> FundFitAssessmentOutput:
        
        fund_profile = FundModel.get_default_profile()
        
        # Extract basic deal parameters (or default if missing)
        check_size = deal_data.get("check_size", 10000000) # Default 1Cr
        pre_money = deal_data.get("pre_money_valuation", 90000000) # Default 9Cr
        apex_score = deal_data.get("apex_score", 70)
        power_law_score = deal_data.get("power_law_score", 60)
        evidence_score = deal_data.get("evidence_score", 50)
        ic_readiness = deal_data.get("ic_readiness", 50)
        
        # 1. Ownership Math
        ownership_scenarios = OwnershipCalculator.calculate(
            fund_size=fund_profile.fund_size,
            check_size=check_size,
            pre_money_valuation=pre_money
        )
        
        # 2. Power Law Simulation
        power_law = PowerLawSimulator.simulate(
            apex_score=apex_score,
            power_law_score=power_law_score,
            evidence_score=evidence_score,
            ic_readiness=ic_readiness
        )
        
        # 3. Reserve Strategy
        reserve_strategy = ReserveModel.calculate(
            initial_check=check_size,
            apex_score=apex_score,
            ic_readiness=ic_readiness,
            power_law_score=power_law_score,
            evidence_score=evidence_score
        )
        
        # 4. Thesis Fit
        thesis_fit = ThesisFitEngine.evaluate(
            deal_data=deal_data,
            fund_profile=fund_profile,
            ownership_acquired=ownership_scenarios.post_dilution_ownership,
            power_law_classification=power_law.classification
        )
        
        # Recommendation Logic
        recommendation = "Undecided"
        constraints = []
        is_public_benchmark = deal_data.get("is_public_benchmark", False)
        
        if is_public_benchmark:
            stage = deal_data.get("stage", "").lower()
            if "late" in stage or "series c" in stage or "growth" in stage:
                recommendation = "Outside fund mandate. Useful as a benchmark, but likely too late-stage and expensive for a ₹100Cr early-stage fund."
            else:
                recommendation = "Benchmark profile. Requires private diligence to determine if standard ownership targets could be met."
            constraints.append("This is a public benchmark. Ownership simulations are theoretical.")
        else:
            if thesis_fit.verdict == "Strong Fit" and power_law.classification in ["Fund Returner Candidate", "Breakout Candidate"]:
                recommendation = "High Priority: Aggressively pursue ownership."
            elif thesis_fit.verdict in ["Strong Fit", "Good Fit"]:
                recommendation = "Proceed with diligence. Fit is sound."
            elif thesis_fit.verdict == "Conditional Fit":
                recommendation = "Conditional fit. Monitor closely."
                constraints.extend(thesis_fit.what_must_be_true)
            else:
                recommendation = "Pass. Outside fund mandate."
                
            if reserve_strategy.capital_allocation_warning:
                constraints.append(reserve_strategy.capital_allocation_warning)
            
        return FundFitAssessmentOutput(
            deal_id=deal_id,
            company_name=company_name,
            fund_size=fund_profile.fund_size,
            initial_check_size=check_size,
            target_ownership=ownership_scenarios.ownership_acquired, # Simplified
            required_exit_value_for_1x_fund=ownership_scenarios.required_exit_value_1x_fund,
            fund_return_potential=power_law.classification,
            thesis_fit_score=thesis_fit.total_score,
            portfolio_concentration_risk="Unknown (Deal-level only)", # Handled at portfolio level
            recommendation=recommendation,
            key_constraints=constraints,
            thesis_fit=thesis_fit,
            ownership_scenarios=ownership_scenarios,
            reserve_strategy=reserve_strategy,
            power_law_simulation=power_law
        )
