from .platform_diligence_schemas import PlatformDiligenceReport, PlatformDiligenceMetadata

def build_diligence_report(deal_id: int, run_id: str, deal_name: str, data: dict) -> PlatformDiligenceReport:
    return PlatformDiligenceReport(
        run_id=run_id,
        deal_id=deal_id,
        status="completed",
        platforms_checked=data.get("platforms_checked", []),
        reddit_findings=data.get("reddit_findings", []),
        review_platform_findings=data.get("review_platform_findings", []),
        social_findings=data.get("social_findings", []),
        competitor_findings=data.get("competitor_findings", []),
        pain_points=data.get("pain_points", []),
        reputation_risks=data.get("reputation_risks", []),
        sentiment_summary=data.get("sentiment_summary"),
        evidence_added=[],
        questions_generated=["How does pricing compare to existing competitors?", "What is the strategy for addressing local language nuances?"],
        decision_impact="Directional support for the thesis regarding customer pain, but direct traction needs private validation.",
        next_actions=["Verify pricing constraints with founders", "Ask for customer references"],
        metadata=PlatformDiligenceMetadata(
            platforms_checked=data.get("platforms_checked", []),
            warnings=["Mock mode active.", "Platform data is directional, not statistically significant."],
            overall_confidence="medium",
            bias_and_limitations_note=data.get("bias_warning", "")
        )
    )
