from fund_engine.fund_schemas import OwnershipScenarioOutput

class OwnershipCalculator:
    @staticmethod
    def calculate(
        fund_size: int,
        check_size: int,
        pre_money_valuation: int,
        expected_dilution: float = 0.20
    ) -> OwnershipScenarioOutput:
        post_money_valuation = pre_money_valuation + check_size
        
        # Prevent division by zero
        if post_money_valuation == 0:
            post_money_valuation = 1
            
        ownership_acquired = check_size / post_money_valuation
        post_dilution_ownership = ownership_acquired * (1 - expected_dilution)
        
        # Calculate exit values needed to return fund
        # To return 1x of the fund (e.g. ₹100Cr), the exit value * post_dilution_ownership must = fund_size
        required_exit_1x = fund_size / post_dilution_ownership if post_dilution_ownership > 0 else 0
        required_exit_half = (fund_size * 0.5) / post_dilution_ownership if post_dilution_ownership > 0 else 0
        required_exit_tenth = (fund_size * 0.1) / post_dilution_ownership if post_dilution_ownership > 0 else 0
        
        return OwnershipScenarioOutput(
            round_size=check_size, # Assuming check is the whole round for simplicity unless we have more data
            pre_money_valuation=pre_money_valuation,
            post_money_valuation=post_money_valuation,
            check_size=check_size,
            ownership_acquired=ownership_acquired,
            post_dilution_ownership=post_dilution_ownership,
            required_exit_value_1x_fund=int(required_exit_1x),
            required_exit_value_half_fund=int(required_exit_half),
            required_exit_value_tenth_fund=int(required_exit_tenth)
        )
