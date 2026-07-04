with open("frontend/types/index.ts", "a") as f:
    f.write("""
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
""")
