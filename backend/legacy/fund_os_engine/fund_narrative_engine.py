from .fund_os_schemas import FundNarrative

def generate_fund_narrative() -> FundNarrative:
    return FundNarrative(
        one_line_narrative="Apex Demo Fund I is an AI-native venture fund capturing the generational shift in India's technology ecosystem.",
        lp_meeting_opening="Thank you for taking the time. As you know, the structural shifts in AI and India's digital infrastructure are compounding. Our fund is positioned at the intersection of these two super-trends.",
        fundraising_deck_summary="We invest early in founders building foundational AI, deeptech, and commerce infrastructure. With a highly concentrated portfolio and a systematic AI-native sourcing engine, we aim to deliver outlier returns.",
        quarterly_update_narrative="Q2 2026 was marked by accelerated deployment in the AI application layer. We have deployed 25% of the fund, maintaining strong pricing discipline despite market exuberance.",
        investment_strategy_explanation="We take high-conviction positions (8-12% ownership) at the Pre-seed to Series A stage, holding 40% in reserve to double down on our clear winners.",
        why_now="The AI platform shift lowers the cost of software creation to near-zero, creating a massive opportunity for domain-specific AI applications and the infrastructure powering them.",
        why_this_team="Our team combines deep technical expertise with AI-native operational systems, giving us an informational and processing advantage over traditional VC firms.",
        why_this_market="India is simultaneously the fastest-growing major economy and the largest pool of engineering talent, pivoting from services to deep intellectual property creation.",
        what_has_been_proven="Our sourcing engine has successfully mapped the market, yielding top-tier proprietary deal flow.",
        what_remains_to_prove="The ability to execute follow-on strategies and secure pro-rata allocations in our most competitive breakout assets."
    )
