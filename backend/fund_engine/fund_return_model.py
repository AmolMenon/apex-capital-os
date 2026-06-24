from fund_engine.fund_schemas import FundReturnModelOutput

class FundReturnModel:
    @staticmethod
    def calculate(
        fund_size: int,
        portfolio_size: int,
        expected_winners: int
    ) -> FundReturnModelOutput:
        
        # Simple Fund Return Model (Heuristic simulation)
        # Assume management fees = 2% over 10 years = 20%
        investable_capital = fund_size * 0.8
        average_capital_per_company = investable_capital / portfolio_size if portfolio_size > 0 else 0
        
        # Outcome buckets and their multipliers on invested capital
        outcome_multipliers = {
            "write_off": 0.0,
            "small_exit": 1.5,
            "good_exit": 5.0,
            "breakout": 15.0,
            "fund_returner": 50.0
        }
        
        # Assume distribution of outcomes in a standard VC fund
        # 50% write off, 30% small, 10% good, 8% breakout, 2% returner
        distribution = {
            "write_off": int(portfolio_size * 0.5),
            "small_exit": int(portfolio_size * 0.3),
            "good_exit": int(portfolio_size * 0.1),
            "breakout": int(portfolio_size * 0.08),
            "fund_returner": expected_winners
        }
        
        # Ensure it sums up
        distributed = sum(distribution.values())
        if distributed < portfolio_size:
            distribution["write_off"] += (portfolio_size - distributed)
        
        total_returned = 0.0
        for bucket, count in distribution.items():
            total_returned += count * (average_capital_per_company * outcome_multipliers[bucket])
            
        gross_multiple = total_returned / investable_capital if investable_capital > 0 else 0
        net_multiple = total_returned / fund_size if fund_size > 0 else 0
        
        # To return the fund at 3x net, how many fund returners are needed?
        target_return = fund_size * 3.0
        # rough math: how much gap from non-returners?
        non_returner_value = 0.0
        for bucket in ["write_off", "small_exit", "good_exit", "breakout"]:
            non_returner_value += distribution[bucket] * (average_capital_per_company * outcome_multipliers[bucket])
            
        gap = target_return - non_returner_value
        winners_needed = gap / (average_capital_per_company * outcome_multipliers["fund_returner"]) if average_capital_per_company > 0 else 0
        
        return FundReturnModelOutput(
            expected_gross_multiple=round(gross_multiple, 2),
            expected_net_multiple=round(net_multiple, 2),
            capital_returned=int(total_returned),
            winners_needed=max(1, int(winners_needed)),
            outcome_distribution={k: v / portfolio_size for k, v in distribution.items()} if portfolio_size > 0 else {}
        )
