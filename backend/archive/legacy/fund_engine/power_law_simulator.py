from fund_engine.fund_schemas import PowerLawSimulationOutput

class PowerLawSimulator:
    @staticmethod
    def simulate(
        apex_score: int,
        power_law_score: int,
        evidence_score: int,
        ic_readiness: int
    ) -> PowerLawSimulationOutput:
        
        # Base probabilities
        p_write_off = 0.50
        p_small = 0.30
        p_good = 0.15
        p_breakout = 0.04
        p_returner = 0.01
        
        # Adjust based on scores
        # High power law score shifts probability tail to the right
        if power_law_score > 80:
            p_breakout += 0.05
            p_returner += 0.04
            p_write_off -= 0.05
            p_small -= 0.04
            
        # High evidence reduces write-off probability
        if evidence_score > 80:
            p_write_off -= 0.15
            p_good += 0.10
            p_small += 0.05
            
        # High apex score shifts generally right
        if apex_score > 80:
            p_good += 0.10
            p_breakout += 0.02
            p_returner += 0.01
            p_write_off -= 0.13
            
        # Normalize
        total = p_write_off + p_small + p_good + p_breakout + p_returner
        p_write_off /= total
        p_small /= total
        p_good /= total
        p_breakout /= total
        p_returner /= total
        
        # Calculate Expected Value Score (1 to 100 roughly)
        ev_score = (p_write_off * 0 + p_small * 20 + p_good * 50 + p_breakout * 80 + p_returner * 100)
        
        # Classification
        if p_returner > 0.04:
            classification = "Fund Returner Candidate"
            must_be_true = "Market must expand rapidly and company must achieve monopoly-like scale."
        elif p_breakout > 0.08:
            classification = "Breakout Candidate"
            must_be_true = "Company must capture significant market share and achieve high structural margins."
        elif p_good > 0.25:
            classification = "Good Venture Outcome"
            must_be_true = "Steady execution and capital efficient growth."
        elif p_write_off > 0.60:
            classification = "Not Venture Scale"
            must_be_true = "Massive pivot required to unlock venture-scale returns."
        else:
            classification = "Limited Upside"
            must_be_true = "Requires flawless execution to achieve a moderate exit."
            
        return PowerLawSimulationOutput(
            expected_value_score=round(ev_score, 1),
            weighted_return_potential=round((p_write_off * 0) + (p_small * 1.5) + (p_good * 5.0) + (p_breakout * 15.0) + (p_returner * 50.0), 2),
            prob_write_off=round(p_write_off, 2),
            prob_small_exit=round(p_small, 2),
            prob_good_exit=round(p_good, 2),
            prob_breakout=round(p_breakout, 2),
            prob_fund_returner=round(p_returner, 2),
            classification=classification,
            what_must_be_true=must_be_true
        )
