from fund_engine.fund_schemas import FundProfileOutput

class FundModel:
    @staticmethod
    def get_default_profile() -> FundProfileOutput:
        return FundProfileOutput(
            fund_name="Apex Capital Fund I",
            fund_size=1000000000, # ₹100 Cr in INR
            strategy="Early-stage India-first fund with selective global expansion exposure.",
            target_stages=["Pre-seed", "Seed", "Series A"],
            target_sectors=[
                "AI SaaS",
                "Fintech infrastructure",
                "Climate intelligence",
                "Consumer health",
                "Bioinformatics / deeptech",
                "Pet care and consumer platforms"
            ],
            target_ownership={
                "Pre-seed": "8–12%",
                "Seed": "6–10%",
                "Series A": "3–6%"
            },
            check_sizes={
                "Pre-seed": "₹50L–₹2Cr",
                "Seed": "₹2Cr–₹8Cr",
                "Series A": "₹8Cr–₹20Cr"
            },
            reserve_ratio_initial=0.5,
            reserve_ratio_follow_on=0.5,
            portfolio_target_min=25,
            portfolio_target_max=35,
            return_objective_net_moic=3.0,
            power_law_assumption="1–2 companies drive majority of returns."
        )
