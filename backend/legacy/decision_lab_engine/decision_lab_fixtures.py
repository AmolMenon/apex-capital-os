from .decision_lab_schemas import *

HISTORICAL_CASES = [
    HistoricalInvestmentCase(
        case_id="sarvam_ai",
        company_name="Sarvam AI",
        case_type="Public Benchmark",
        sector="AI Infrastructure",
        geography="India",
        stage_at_decision="Seed",
        decision_date="2023-11-01",
        information_cutoff="2023-11-30",
        available_evidence=["Founding team background (AI4Bharat)", "Open-source momentum", "Lightspeed/PeakXV interest"],
        excluded_future_evidence=["$41M Series A announcement", "Release of OpenHathi model"],
        simulated_fund_playbook="AI-Native Fund",
        apex_recommendation_at_time="Strong Conviction - Preempt",
        actual_later_outcome="Public trajectory signal: Highly successful Series A, strong early model releases.",
        outcome_confidence="High",
        hindsight_learning=[],
        metadata={"is_mock": False}
    ),
    HistoricalInvestmentCase(
        case_id="vectordesk_ai",
        company_name="VectorDesk AI",
        case_type="Mock Historical",
        sector="Enterprise SaaS",
        geography="US",
        stage_at_decision="Seed",
        decision_date="2022-04-15",
        information_cutoff="2022-04-15",
        available_evidence=["Weak initial traction", "Strong market timing for vector DBs", "Founder GitHub history"],
        excluded_future_evidence=["Pivoted to workflow automation", "Hit $10M ARR in 18 months"],
        simulated_fund_playbook="Apex Default Early-Stage",
        apex_recommendation_at_time="Watchlist / Pass",
        actual_later_outcome="Missed Winner",
        outcome_confidence="High",
        hindsight_learning=[
            HindsightLearning(
                lesson="Do not underweight early workflow depth even if traction is missing.",
                evidence="Founder's GitHub showed complex orchestration logic.",
                affected_playbook="Apex Default Early-Stage",
                suggested_change="Increase weight of technical architectural moat for AI workflows.",
                confidence="High"
            )
        ],
        metadata={"is_mock": True}
    ),
    HistoricalInvestmentCase(
        case_id="localcart",
        company_name="LocalCart",
        case_type="Mock Historical",
        sector="Consumer Commerce",
        geography="India",
        stage_at_decision="Series A",
        decision_date="2021-08-10",
        information_cutoff="2021-08-10",
        available_evidence=["High GMV growth", "Strong consumer narrative", "Top-tier seed investors"],
        excluded_future_evidence=["Negative unit economics", "High churn rate", "Down round in 2023"],
        simulated_fund_playbook="Consumer Scale",
        apex_recommendation_at_time="Invest",
        actual_later_outcome="Hype False Positive",
        outcome_confidence="High",
        hindsight_learning=[
            HindsightLearning(
                lesson="CAC and retention gates must trigger earlier.",
                evidence="Ignored weak LTV/CAC ratio in data room due to high GMV momentum.",
                affected_playbook="Consumer Scale",
                suggested_change="Enforce strict LTV/CAC > 3x gate before IC.",
                confidence="High"
            )
        ],
        metadata={"is_mock": True}
    )
]

MISSED_DEALS = [
    MissedDealAnalysis(
        company_name="VectorDesk AI",
        decision_date="2022-04-15",
        recommendation_at_time="Watchlist / Pass",
        later_outcome="Hit $10M ARR in 18 months",
        missed_signal="Deep architectural complexity in early GitHub commits.",
        reason_missed="Playbook required minimum revenue traction, which was missing.",
        avoidable=True,
        playbook_change_suggested="Allow technical moat to bypass early traction gates for infra tools.",
        sourcing_change_suggested="Map developer repo activity earlier.",
        diligence_change_suggested="Conduct code review even pre-revenue."
    )
]

FALSE_POSITIVES = [
    FalsePositiveAnalysis(
        company_name="LocalCart",
        misleading_signal="Explosive GMV growth",
        ignored_risk="Negative unit economics and high churn",
        missing_diligence="Cohort retention analysis was delayed until post-term sheet.",
        gate_that_should_have_triggered="Minimum Retention Rate",
        later_issue="Capital intensive, required down round.",
        learning="Never waive cohort retention analysis for consumer businesses regardless of GMV momentum."
    )
]

PLAYBOOK_BACKTESTS = [
    PlaybookBacktestResult(
        playbook_id="Apex Default Early-Stage",
        cases_tested=15,
        simulated_hits=3,
        simulated_misses=4,
        false_positives=2,
        average_decision_quality="Reasonable",
        gate_discipline="Medium",
        evidence_strictness="Medium",
        best_fit_sectors=["Vertical SaaS", "Fintech"],
        weaknesses=["Underweights deeptech", "Misses pre-revenue AI infra"],
        recommended_adjustments=["Lower traction gates for AI infra"]
    ),
    PlaybookBacktestResult(
        playbook_id="Power-Law Seed",
        cases_tested=15,
        simulated_hits=5,
        simulated_misses=2,
        false_positives=5,
        average_decision_quality="High Variance",
        gate_discipline="Loose",
        evidence_strictness="Low",
        best_fit_sectors=["Consumer", "AI Infra"],
        weaknesses=["Prone to hype false positives"],
        recommended_adjustments=["Introduce strict unit economic gates for non-infra plays"]
    ),
    PlaybookBacktestResult(
        playbook_id="Evidence-Heavy Institutional",
        cases_tested=15,
        simulated_hits=2,
        simulated_misses=8,
        false_positives=0,
        average_decision_quality="Overly Strict",
        gate_discipline="Very High",
        evidence_strictness="Very High",
        best_fit_sectors=["Growth Stage", "B2B SaaS"],
        weaknesses=["Misses early stage outlier returns"],
        recommended_adjustments=["N/A - Functioning as designed for growth"]
    ),
    PlaybookBacktestResult(
        playbook_id="AI-Native Fund",
        cases_tested=15,
        simulated_hits=4,
        simulated_misses=1,
        false_positives=3,
        average_decision_quality="Strong Process",
        gate_discipline="Medium",
        evidence_strictness="Low (Traction) / High (Tech)",
        best_fit_sectors=["AI Applications", "AI Infrastructure"],
        weaknesses=["May overweight technical elegance over distribution"],
        recommended_adjustments=["Add distribution wedge assessment gate"]
    )
]
