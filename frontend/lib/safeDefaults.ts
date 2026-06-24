import { 
  Deal, FullAnalysisOutput, ResearchBrief, DeckAnalysis, DiligencePlan, DecisionOutput, FundFit 
} from "@/types";

export const defaultDeal: Deal = {
  id: 0,
  startup_name: "Unknown Deal",
  sector: "Unknown",
  stage: "Unknown",
  description: "No description available.",
  status: "new",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const defaultAnalysis: FullAnalysisOutput = {
  deal_id: 0,
  company_name: "Unknown",
  overall_score: 0,
  power_law_score: 0,
  risk_score: 0,
  recommendation: "Needs Info",
  confidence: "Low",
  one_line_thesis: "Analysis pending.",
  main_reason: "Data unavailable",
  change_recommendation_condition: "Needs full evaluation",
  scorecard: {},
  risks: [],
  diligence_questions: [],
  partner_pushback: [],
  market_map: {
    incumbents: [],
    direct_competitors: [],
    indirect_alternatives: [],
    emerging_challengers: [],
    white_space: "Unknown"
  },
  competitors: [],
  fund_return: null,
  exit_analysis: { scenarios: [] },
  diligence_plan: [],
  archetype: null,
  ic_simulation: [],
  memo: {},
  ic_one_pager: {
    company: "Unknown",
    sector: "Unknown",
    stage: "Unknown",
    round_details: "Unknown",
    apex_score: 0,
    recommendation: "Pending",
    one_line_thesis: "Pending",
    why_now: "Pending",
    why_this_team: "Pending",
    why_this_can_be_big: "Pending",
    key_traction: "Pending",
    main_risks: [],
    diligence_required: "Pending",
    final_call: "Pending"
  }
};

export const defaultDecision: DecisionOutput = {
  current_recommendation: "Needs Info",
  calibrated_recommendation: "Needs Info",
  confidence_level: "Low",
  recommendation_reason: "Insufficient data.",
  blocking_issues: [],
  positive_signals: [],
  evidence_gaps: [],
  risks_that_could_change_decision: [],
  next_decision_milestone: "Gather Information",
  what_would_upgrade_recommendation: [],
  what_would_downgrade_recommendation: [],
  change_our_mind: { upgrade_triggers: [], downgrade_triggers: [], pass_triggers: [] }
};

export const defaultResearchBrief: ResearchBrief = {
  deal_id: 0,
  company_name: "Unknown",
  market_research: {},
  competitor_research: [],
  customer_personas: [],
  pricing_research: {},
  gtm_research: {},
  tam_sam_som: {},
  evidence_grade: {
    overall_score: 0,
    reliability_score: 0,
    completeness_score: 0,
    conflict_score: 0,
    weakest_link: "N/A",
    narrative_warning: "N/A"
  },
  source_registry: [],
  research_gaps: [],
  research_backed_recommendation: "Pending"
};

export const defaultDeckAnalysis: DeckAnalysis = {
  deal_id: 0,
  deck_name: "Unknown",
  deck_summary: "No deck analyzed.",
  deck_quality_score: 0,
  investor_readiness_score: 0,
  extracted_sections: [],
  key_claims: [],
  financials: {},
  traction: {},
  risks: [],
  missing_sections: [],
  quality_breakdown: {},
  readiness_breakdown: {},
  recommended_follow_up_questions: []
};

export const defaultDiligencePlan: DiligencePlan = {
  deal_id: 0,
  company_name: "Unknown",
  ic_readiness_score: 0,
  diligence_status: "Pending",
  final_diligence_verdict: "Pending",
  priority_tasks: [],
  claim_verifications: [],
  founder_followups: [],
  customer_reference_questions: [],
  data_room_requests: [],
  risk_resolution_plan: [],
  evidence_items: []
};

export const defaultFundFit: FundFit = {
  deal_id: 0,
  company_name: "Unknown",
  thesis_fit_score: 0,
  fund_return_potential: "Pending",
  target_ownership: 0,
  thesis_fit: { verdict: "Pending" },
  portfolio_construction: {},
  ownership_scenarios: {
    pre_money_valuation: 0,
    check_size: 0,
    post_dilution_ownership: 0,
    required_exit_value_1x_fund: 0
  },
  reserve_strategy: {
    initial_check: 0,
    recommended_reserve: 0,
    reserve_ratio: 0,
    capital_allocation_priority: "Low"
  },
  exit_requirements: {}
};
