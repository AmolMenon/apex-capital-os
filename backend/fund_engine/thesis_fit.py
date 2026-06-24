from fund_engine.fund_schemas import ThesisFitOutput, FundProfileOutput
from typing import Dict, Any

class ThesisFitEngine:
    @staticmethod
    def evaluate(
        deal_data: Dict[str, Any],
        fund_profile: FundProfileOutput,
        ownership_acquired: float,
        power_law_classification: str
    ) -> ThesisFitOutput:
        
        # 10 criteria, scored 0-10
        scores = {
            "sector_fit": 5,
            "stage_fit": 5,
            "geography_fit": 5, # default 5 if unknown
            "ownership_feasibility": 5,
            "market_size_fit": 5,
            "power_law_potential": 5,
            "evidence_quality": 5,
            "strategic_portfolio_fit": 5,
            "diligence_readiness": 5,
            "exit_pathway_fit": 5
        }
        
        why_it_fits = []
        why_it_may_not_fit = []
        what_must_be_true = []
        
        sector = deal_data.get("sector", "")
        stage = deal_data.get("stage", "")
        
        if sector in fund_profile.target_sectors:
            scores["sector_fit"] = 10
            why_it_fits.append(f"Sector '{sector}' is a core target.")
        else:
            scores["sector_fit"] = 2
            why_it_may_not_fit.append(f"Sector '{sector}' is outside core mandate.")
            what_must_be_true.append("Must prove exceptional thesis alignment to justify out-of-sector bet.")
            
        if stage in fund_profile.target_stages:
            scores["stage_fit"] = 10
            why_it_fits.append(f"Stage '{stage}' matches fund strategy.")
        else:
            scores["stage_fit"] = 2
            why_it_may_not_fit.append(f"Stage '{stage}' is outside target stages.")
            what_must_be_true.append("Must have overwhelming traction to justify off-stage bet.")
            
        # Target ownership logic
        # target_ownership format: "8-12%"
        target_str = fund_profile.target_ownership.get(stage, "5-10%")
        # Rough parsing, assuming format "min-max%"
        try:
            min_target = float(target_str.replace("%", "").split("–")[0]) / 100.0
            if ownership_acquired >= min_target:
                scores["ownership_feasibility"] = 9
                why_it_fits.append(f"Ownership of {int(ownership_acquired*100)}% meets {stage} target ({target_str}).")
            else:
                scores["ownership_feasibility"] = 3
                why_it_may_not_fit.append(f"Ownership of {int(ownership_acquired*100)}% is below {stage} target ({target_str}).")
                what_must_be_true.append(f"Must negotiate valuation down to achieve {target_str} ownership.")
        except:
            pass # Ignore parse errors in mock
            
        # Power law
        if power_law_classification in ["Fund Returner Candidate", "Breakout Candidate"]:
            scores["power_law_potential"] = 9
            why_it_fits.append(f"Strong power law potential ({power_law_classification}).")
        elif power_law_classification == "Not Venture Scale":
            scores["power_law_potential"] = 1
            why_it_may_not_fit.append("Lacks venture scale return profile.")
        else:
            scores["power_law_potential"] = 5
            
        # Evidence quality
        evidence_score = deal_data.get("evidence_score", 50)
        scores["evidence_quality"] = int(evidence_score / 10)
        
        # Diligence readiness
        ic_readiness = deal_data.get("ic_readiness", 50)
        scores["diligence_readiness"] = int(ic_readiness / 10)
        
        total_score = sum(scores.values())
        
        if total_score >= 80:
            verdict = "Strong Fit"
        elif total_score >= 60:
            verdict = "Good Fit"
        elif total_score >= 40:
            verdict = "Conditional Fit"
        elif total_score >= 20:
            verdict = "Weak Fit"
        else:
            verdict = "Outside Mandate"
            
        return ThesisFitOutput(
            sector_fit=scores["sector_fit"],
            stage_fit=scores["stage_fit"],
            geography_fit=scores["geography_fit"],
            ownership_feasibility=scores["ownership_feasibility"],
            market_size_fit=scores["market_size_fit"],
            power_law_potential=scores["power_law_potential"],
            evidence_quality=scores["evidence_quality"],
            strategic_portfolio_fit=scores["strategic_portfolio_fit"],
            diligence_readiness=scores["diligence_readiness"],
            exit_pathway_fit=scores["exit_pathway_fit"],
            total_score=total_score,
            verdict=verdict,
            why_it_fits=why_it_fits,
            why_it_may_not_fit=why_it_may_not_fit,
            what_must_be_true=what_must_be_true
        )
