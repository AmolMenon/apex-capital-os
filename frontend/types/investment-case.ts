export interface InvestmentCaseDecision {
  id: number;
  title: string;
  status: string;
}

export interface AnalyticalRecommendation {
  value: string | null;
  status: string | null;
}

export interface DecisionIntegrity {
  status: string | null;
  blocking_conditions: any[];
}

export interface HumanDecision {
  value: string;
  rationale?: string | null;
  conditions_json?: any | null;
}

export interface ClaimLink {
  claim_id: number;
  relationship: "SUPPORTS" | "CONTRADICTS" | "CONTEXT";
}

export interface Assumption {
  id: number;
  statement: string;
  status: "Verified" | "Unverified" | "Invalidated";
  claims: ClaimLink[];
}

export interface InvestmentCaseAssumptions {
  [category: string]: Assumption[];
}

export interface Conflict {
  id: number;
  claim_a_id: number;
  claim_b_id: number;
  status: "OPEN" | "RESOLVED" | "CONFIRMED_CONTRADICTION";
  origin: "SYSTEM_DETECTED" | "ANALYST_LOGGED";
}

export interface DiligenceTask {
  id: number;
  target_type: "Assumption" | "EvidenceConflict" | "EscalationSignal";
  target_id: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
}

export interface Finding {
  id: number;
  task_id: number;
  resolution_effect: string | null;
  assumption_effect: string | null;
}

export interface Diligence {
  tasks: DiligenceTask[];
  findings: Finding[];
}

export interface InvestmentCaseResponse {
  decision: InvestmentCaseDecision;
  analytical_recommendation: AnalyticalRecommendation | null;
  decision_integrity: DecisionIntegrity | null;
  human_decision: HumanDecision;
  investment_case_assumptions: InvestmentCaseAssumptions;
  conflicts: Conflict[];
  diligence: Diligence;
}
