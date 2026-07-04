from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class HindsightLearning(BaseModel):
    lesson: str
    evidence: str
    affected_playbook: str
    suggested_change: str
    confidence: str
    should_auto_apply: bool = False
    requires_review: bool = True

class HistoricalInvestmentCase(BaseModel):
    case_id: str
    company_name: str
    case_type: str
    sector: str
    geography: str
    stage_at_decision: str
    decision_date: str
    information_cutoff: str
    available_evidence: List[str]
    excluded_future_evidence: List[str]
    simulated_fund_playbook: str
    apex_recommendation_at_time: str
    actual_later_outcome: str
    outcome_confidence: str
    hindsight_learning: List[HindsightLearning]
    metadata: Dict[str, Any]

class BacktestResult(BaseModel):
    run_id: str
    case_id: str
    company_name: str
    playbook_id: str
    recommendation_at_time: str
    confidence_at_time: str
    evidence_quality_at_time: str
    top_positive_signals: List[str]
    top_negative_signals: List[str]
    missing_data: List[str]
    gates_triggered: List[str]
    later_outcome_comparison: str
    decision_quality: str
    learning: List[str]

class CounterfactualScenario(BaseModel):
    scenario_id: str
    case_id: str
    playbook_id: str
    changed_assumption: str
    original_recommendation: str
    counterfactual_recommendation: str
    score_delta: int
    confidence_delta: str
    risk_delta: str
    learning: str

class MissedDealAnalysis(BaseModel):
    company_name: str
    decision_date: str
    recommendation_at_time: str
    later_outcome: str
    missed_signal: str
    reason_missed: str
    avoidable: bool
    playbook_change_suggested: str
    sourcing_change_suggested: str
    diligence_change_suggested: str

class FalsePositiveAnalysis(BaseModel):
    company_name: str
    misleading_signal: str
    ignored_risk: str
    missing_diligence: str
    gate_that_should_have_triggered: str
    later_issue: str
    learning: str

class SignalAttribution(BaseModel):
    signal_name: str
    impact_on_recommendation: str
    later_outcome_relevance: str
    over_underweighted: str
    confidence: str
    learning: str

class PlaybookBacktestResult(BaseModel):
    playbook_id: str
    cases_tested: int
    simulated_hits: int
    simulated_misses: int
    false_positives: int
    average_decision_quality: str
    gate_discipline: str
    evidence_strictness: str
    best_fit_sectors: List[str]
    weaknesses: List[str]
    recommended_adjustments: List[str]

class CutoffIntegrityReport(BaseModel):
    case_id: str
    cutoff_integrity_score: int
    future_leakage_warnings: List[str]
    invalid_evidence_items: List[str]
    safe_to_use_in_backtest: bool
