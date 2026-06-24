export interface Deal {
  id: number;
  startup_name: string;
  sector?: string;
  sub_sector?: string;
  geography?: string;
  stage?: string;
  business_model?: string;
  description?: string;
  website?: string;
  
  source?: string;
  source_type?: string;
  why_interesting?: string;
  notes?: string;
  tags?: string;
  active_playbook_id?: string;
  
  deal_type?: string;
  is_public_benchmark?: boolean;
  public_profile_json?: string;
  
  founder_name?: string;
  founder_email?: string;
  founder_background?: string;
  market_size?: number;
  growth_rate?: number;
  revenue?: number;
  mrr?: number;
  arr?: number;
  users?: number;
  customers?: number;
  retention_rate?: number;
  churn_rate?: number;
  gross_margin?: number;
  cac?: number;
  ltv?: number;
  traction_summary?: string;
  customer_summary?: string;
  revenue_summary?: string;
  
  funding_raised?: number;
  valuation?: number;
  round_size?: string;
  fundraising_status?: string;
  
  competitors?: string;
  status: string;
  created_at: string;
  updated_at: string;
  analysis?: FullAnalysisOutput | null;
}

export interface FullAnalysisOutput {
  deal_id: number;
  company_name: string;
  overall_score: number;
  power_law_score: number;
  risk_score: number;
  recommendation: string;
  confidence: string;
  one_line_thesis: string;
  main_reason: string;
  change_recommendation_condition: string;
  scorecard: Record<string, number>;
  risks: RiskOutput[];
  diligence_questions: any[];
  partner_pushback: any[];
  market_map: any;
  competitors: any[];
  fund_return: any;
  exit_analysis: any;
  diligence_plan: any[];
  archetype: any;
  ic_simulation: any[];
  memo: MemoOutput;
  ic_one_pager: ICOnePagerOutput;
}

export interface RiskOutput {
  category: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  mitigation: string;
}

export interface MemoOutput {
  executive_summary?: string;
  problem?: string;
  solution?: string;
  market_opportunity?: string;
  founder_market_fit?: string;
  product_differentiation?: string;
  traction?: string;
  business_model?: string;
  competition?: string;
  key_risks?: string;
  return_potential?: string;
  final_recommendation?: string;
  research_evidence?: string;
  deck_evidence_review?: string;
  _ai_metadata?: AIMetadata;
}

export interface ICOnePagerOutput {
  company: string;
  sector: string;
  stage: string;
  round_details: string;
  apex_score: number;
  recommendation: string;
  one_line_thesis: string;
  why_now: string;
  why_this_team: string;
  why_this_can_be_big: string;
  key_traction: string;
  main_risks: string[];
  diligence_required: string;
  final_call: string;
  _ai_metadata?: AIMetadata;
}

export interface AIMetadata {
  provider_used: string;
  fallback_used: boolean;
  model: string;
}

export interface ResearchBrief {
  deal_id: number;
  company_name: string;
  market_research: any;
  competitor_research: any[];
  customer_personas: any[];
  pricing_research: any;
  gtm_research: any;
  tam_sam_som: any;
  evidence_grade: EvidenceGrade;
  source_registry: any[];
  research_gaps: string[];
  research_backed_recommendation: string;
}

export interface EvidenceGrade {
  overall_score: number;
  reliability_score: number;
  completeness_score: number;
  conflict_score: number;
  weakest_link: string;
  narrative_warning: string;
}

export interface DeckAnalysis {
  deal_id: number;
  deck_name: string;
  deck_summary: string;
  deck_quality_score: number;
  investor_readiness_score: number;
  extracted_sections: any[];
  key_claims: any[];
  financials: any;
  traction: any;
  risks: any[];
  missing_sections: any[];
  quality_breakdown: any;
  readiness_breakdown: any;
  recommended_follow_up_questions: string[];
}

export interface DiligencePlan {
  deal_id: number;
  company_name: string;
  ic_readiness_score: number;
  diligence_status: string;
  final_diligence_verdict: string;
  priority_tasks: any[];
  claim_verifications: any[];
  founder_followups: any[];
  customer_reference_questions: any[];
  data_room_requests: any[];
  risk_resolution_plan: any[];
  evidence_items: any[];
}

export interface DecisionOutput {
  current_recommendation: string;
  calibrated_recommendation: string;
  confidence_level: string;
  recommendation_reason: string;
  blocking_issues: string[];
  positive_signals: string[];
  evidence_gaps: string[];
  risks_that_could_change_decision: string[];
  next_decision_milestone: string;
  what_would_upgrade_recommendation: string[];
  what_would_downgrade_recommendation: string[];
  change_our_mind: ChangeOurMind;
}

export interface ChangeOurMind {
  upgrade_triggers: string[];
  downgrade_triggers: string[];
  pass_triggers: string[];
}

export interface FundFit {
  deal_id: number;
  company_name: string;
  thesis_fit_score: number;
  fund_return_potential: string;
  target_ownership: number;
  thesis_fit: any;
  portfolio_construction: any;
  ownership_scenarios: any;
  reserve_strategy: any;
  exit_requirements: any;
}

export interface AgentTraceStep {
  step_id?: string;
  agent_name: string;
  status: string;
  started_at?: string;
  completed_at?: string;
  output?: any;
  error?: string;
  provider_metadata?: any;
}

export interface AgenticResearchReport {
  public_benchmark_conclusion: string;
  private_diligence_required: string[];
  fund_fit_summary: string;
  ic_readiness_status: string;
  recommended_next_step: string;
  key_findings: any[];
}

export interface AgentWorkflowRun {
  run_id: string;
  deal_id: string;
  company_name: string;
  workflow_mode: string;
  status: string;
  agents_run: string[];
  trace: AgentTraceStep[];
  final_report?: AgenticResearchReport;
  metadata?: any;
}

export interface SystemStatus {
  backend_status: string;
  api_url: string;
  app_mode: string;
  enable_real_llm: boolean;
  default_provider: string;
  web_research_enabled: boolean;
  agent_workflow_enabled: boolean;
  db_type: string;
  deal_count: number;
  features_health: Record<string, string>;
}

export interface ThesisPoint {
  point: string
  evidence_label: string
  source_confidence: string
  proof_status: string
}

export interface InvestmentThesis {
  one_line_thesis: string
  why_now: string
  why_this_company: string
  why_this_team: string
  why_this_market: string
  why_venture_scale: string
  evidence_supporting: ThesisPoint[]
  assumptions: string[]
  private_diligence_required: string[]
}

export interface AntiThesis {
  strongest_case_against: string
  market_risks: string[]
  product_risks: string[]
  competition_risks: string[]
  economics_risks: string[]
  fund_fit_risks: string[]
  valuation_risks: string[]
  unknown_private_metrics: string[]
  pass_triggers: string[]
}

export interface WhatMustBeTrue {
  statement: string
  why_it_matters: string
  current_evidence: string
  evidence_source: string
  confidence: string
  required_proof: string[]
  diligence_owner: string
  status: string
}

export interface PartnerQuestion {
  question: string
  reason: string
}

export interface PartnerPersona {
  name: string
  focus_area: string
  support_level: string
  view_of_deal: string
  top_questions: PartnerQuestion[]
  evidence_needed: string[]
  likely_vote: string
  what_would_change_view: string
}

export interface PartnerVote {
  partner_name: string
  vote: string
  rationale: string
}

export interface ICSimulation {
  analyst_opening: string
  bull_case: string
  bear_case: string
  partner_debate: string[]
  fund_math_discussion: string
  evidence_gaps: string
  partner_votes: PartnerVote[]
  ic_chair_summary: string
  required_diligence: string[]
  committee_decision: string
}

export interface ConvictionDelta {
  driver: string
  impact: string
  reason: string
}

export interface ConvictionScore {
  overall_score: number
  conviction_level: string
  market_conviction: number
  team_conviction: number
  product_conviction: number
  traction_conviction: number
  evidence_conviction: number
  fund_fit_conviction: number
  valuation_conviction: number
  diligence_completeness: number
  red_team_severity: string
  source_confidence: string
  drivers: string[]
  detractors: string[]
  deltas: ConvictionDelta[]
}

export interface ValuationScenario {
  scenario_name: string
  entry_valuation: number
  exit_valuation: number
  ownership_at_entry: number
  ownership_at_exit: number
  fund_return: number
  fund_multiple_contribution: number
  notes: string
}

export interface ValuationSensitivity {
  latest_known_valuation: string
  assumed_entry_valuation: number
  cheque_size: number
  target_ownership: number
  required_exit_value: number
  dilution_assumptions: string
  scenarios: ValuationScenario[]
  warnings: string[]
}

export interface OwnershipScenario {
  fund_size: number
  target_ownership: number
  cheque_size: number
  entry_valuation: number
  stage: string
  reserve_ratio: number
  expected_dilution: number
  ownership_feasibility: string
  initial_ownership: number
  pro_rata_requirement: number
  follow_on_reserve_needed: number
  expected_exit_ownership: number
  warnings: string[]
}

export interface FundReturnScenario {
  fund_size: number
  entry_ownership: number
  exit_ownership: number
  exit_valuation: number
  capital_invested: number
  exit_proceeds: number
  gross_multiple: number
  percentage_of_fund_returned: number
  can_return_1x_fund: boolean
  required_exit_for_1x: number
  required_ownership_for_1x: number
}

export interface ChangeOurMindCondition {
  condition_type: string
  condition: string
  evidence_needed: string
  current_status: string
  decision_impact: string
  owner: string
  priority: string
}

export interface DecisionGate {
  gate_name: string
  passed: boolean
  reason: string
}

export interface WarRoomFinalRecommendation {
  recommendation: string
  rationale: string
  next_action: string
}

export interface WarRoomMetadata {
  generated_at: string
  mode: string
  deal_type: string
  models_used: string[]
}

export interface DealWarRoom {
  deal_id: string
  company_name: string
  war_room_status: string
  thesis: InvestmentThesis
  anti_thesis: AntiThesis
  what_must_be_true: WhatMustBeTrue[]
  partner_personas: PartnerPersona[]
  ic_simulation: ICSimulation
  conviction_score: ConvictionScore
  valuation_sensitivity: ValuationSensitivity
  ownership_scenarios: OwnershipScenario[]
  fund_return_scenarios: FundReturnScenario[]
  change_our_mind: ChangeOurMindCondition[]
  decision_gates: DecisionGate[]
  final_recommendation: WarRoomFinalRecommendation
  metadata: WarRoomMetadata
}
