import { Deal, FullAnalysisOutput, DiligencePlan, DecisionOutput, FundFit, AgentWorkflowRun, SystemStatus } from "@/types";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_BASE_URL = RAW_API_URL.replace(/\/$/, "");

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      let errorMsg = response.statusText;
      try {
        const errorData = await response.json();
        if (errorData.detail) errorMsg = errorData.detail;
      } catch (e) {}
      throw new ApiError(response.status, errorMsg);
    }
    return response.json();
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    throw error;
  }
}


function resolveId(id: string | number | undefined | null): string {
  if (id === undefined || id === null) {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeDealId") || "1";
    }
    return "1";
  }
  const strId = id.toString().replace("deal-", "");
  if (strId === "active") {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeDealId") || "1";
    }
    return "1";
  }
  return strId;
}

export const api = {

  // Data Room
  getDataRoomStatus: () => fetchAPI<any>("/data-room/status"),
  uploadDataRoomDocument: async (id: string | number, file: File, category: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    // Cannot use fetchAPI directly for FormData due to Content-Type headers being automatically set incorrectly by fetchAPI wrapper
    const activeId = resolveId(id);
    const response = await fetch(`${API_BASE_URL}/data-room/deals/${activeId}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload document");
    return response.json();
  },
  getDataRoomDocuments: (id: string | number) => fetchAPI<any[]>(`/data-room/deals/${resolveId(id)}/documents`),
  parseDataRoom: (id: string | number) => fetchAPI<any>(`/data-room/deals/${resolveId(id)}/parse`, { method: "POST" }),
  getDataRoomReport: (id: string | number) => fetchAPI<any>(`/data-room/deals/${resolveId(id)}/report`),
  getDataRoomMetrics: (id: string | number) => fetchAPI<any[]>(`/data-room/deals/${resolveId(id)}/metrics`),
  getDataRoomContradictions: (id: string | number) => fetchAPI<any[]>(`/data-room/deals/${resolveId(id)}/contradictions`),
  getDataRoomCompleteness: (id: string | number) => fetchAPI<any>(`/data-room/deals/${resolveId(id)}/completeness`),
  getPrivateEvidenceGraph: (id: string | number) => fetchAPI<any>(`/data-room/deals/${resolveId(id)}/evidence-graph`),

  // System / Health
  getHealth: () => fetchAPI<any>("/health"),
  getVersion: () => fetchAPI<any>("/version"),
  getSystemStatus: () => fetchAPI<SystemStatus>("/system-status"),

  // AI
  getAIStatus: () => fetchAPI<any>("/ai/status"),
  getAIRouting: () => fetchAPI<any>("/ai/routing"),
  testAIProvider: (taskType: string, context: string) => fetchAPI<any>("/ai/test-provider", { method: "POST", body: JSON.stringify({ task_type: taskType, context }) }),

  // Deals
  getDeals: () => fetchAPI<Deal[]>("/deals"),
  getDeal: async (id: string | number) => {
    try {
      return await fetchAPI<Deal>(`/deals/${resolveId(id)}`);
    } catch (e) {
      console.warn(`[getDeal] Failed to fetch deal ${id}, returning mock data.`);
      return {
        id: resolveId(id),
        startup_name: "Mock AI Corp",
        sector: "AI Infrastructure",
        stage: "Series A",
        valuation: 50000000,
        status: "In Progress",
        deal_type: "demo",
        analysis: {
          one_line_thesis: "A highly technical team building the orchestration layer for enterprise AI.",
          recommendation: "Strong Buy",
          risks: [{ category: "Market", description: "High competition from AWS/GCP." }],
          change_recommendation_condition: "Require 3 more enterprise design partners."
        }
      } as any;
    }
  },
  createDeal: (data: any) => fetchAPI<Deal>("/deals", { method: "POST", body: JSON.stringify(data) }),
  updateDeal: (id: string | number, data: any) => fetchAPI<Deal>(`/deals/${resolveId(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  archiveDeal: (id: string | number) => fetchAPI<Deal>(`/deals/${resolveId(id)}/archive`, { method: "POST" }),
  restoreDeal: (id: string | number) => fetchAPI<Deal>(`/deals/${resolveId(id)}/restore`, { method: "POST" }),
  
  // Selected Deal Logic
  getSelectedDeal: async () => {
    const deals = await api.getDeals();
    if (!deals || deals.length === 0) return null;
    
    const activeId = typeof window !== 'undefined' ? localStorage.getItem("activeDealId") : null;
    if (activeId) {
      const found = deals.find(d => d.id.toString() === activeId || d.id === parseInt(activeId));
      if (found) return found;
    }
    
    const priorityNames = ["Sarvam AI", "NeuralDesk", "Zepto", "Mistral AI"];
    for (const name of priorityNames) {
      const found = deals.find(d => d.startup_name === name);
      if (found) {
        if (typeof window !== 'undefined') localStorage.setItem("activeDealId", found.id.toString());
        return found;
      }
    }
    
    if (typeof window !== 'undefined') localStorage.setItem("activeDealId", deals[0].id.toString());
    return deals[0];
  },

  // Web Research
  getWebResearchStatus: () => fetchAPI<any>("/web-research/status"),
  getWebResearch: (id: string | number) => fetchAPI<any>(`/web-research/deals/${resolveId(id)}`),
  runWebResearch: (id: string | number) => fetchAPI<any>(`/web-research/deals/${resolveId(id)}/run`, { method: "POST" }),

  // Agent Workflow
  getAgentWorkflowStatus: () => fetchAPI<any>("/agent-workflow/status"),
  getAgentWorkflow: (id: string | number) => fetchAPI<AgentWorkflowRun>(`/agent-workflow/deals/${resolveId(id)}`),
  runAgentWorkflow: (id: string | number) => fetchAPI<AgentWorkflowRun>(`/agent-workflow/deals/${resolveId(id)}/run`, { method: "POST" }),
  getAgentTrace: (runId: string) => fetchAPI<any>(`/agent-workflow/runs/${runId}/trace`),

  // Deal War Room
  getWarRoomStatus: () => fetchAPI<any>("/war-room/status"),
  getWarRoom: (id: string | number) => fetchAPI<any>(`/war-room/deals/${resolveId(id)}`),
  runWarRoom: (id: string | number) => fetchAPI<any>(`/war-room/deals/${resolveId(id)}/run`, { method: "POST" }),
  getICSimulation: (id: string | number) => fetchAPI<any>(`/war-room/deals/${resolveId(id)}/ic-simulation`),
  getValuationSensitivity: (id: string | number) => fetchAPI<any>(`/war-room/deals/${resolveId(id)}/valuation`),
  getFundReturn: (id: string | number) => fetchAPI<any>(`/war-room/deals/${resolveId(id)}/fund-return`),

  // Outputs
  getDecision: (id: string | number) => fetchAPI<DecisionOutput>(`/deals/${resolveId(id)}/decision`),
  getFundFit: (id: string | number) => fetchAPI<FundFit>(`/fund/deals/${resolveId(id)}/fit`),
  getMemo: (id: string | number) => fetchAPI<any>(`/deals/${resolveId(id)}/memo`),
  getICOnePager: (id: string | number) => fetchAPI<any>(`/deals/${resolveId(id)}/one-pager`),
  getICPacket: (id: string | number) => fetchAPI<any>(`/deals/${resolveId(id)}/one-pager`),

  // Legacy analysis & deck routes (kept for compatibility if components still call them)
  analyzeDeal: (id: string | number) => fetchAPI<FullAnalysisOutput>(`/analyze/${resolveId(id)}`, { method: "POST" }),
  getAnalysis: (id: string | number) => fetchAPI<FullAnalysisOutput>(`/deals/${resolveId(id)}/analysis`),
  getDeckAnalysis: (id: string | number) => fetchAPI<any>(`/decks/${resolveId(id)}`),
  analyzeDeck: (id: string | number, text: string) => fetchAPI<any>(`/decks/analyze/${resolveId(id)}`, { method: "POST", body: JSON.stringify({ deck_name: "Uploaded Deck", raw_text: text }) }),
  getDiligencePlan: (id: string | number) => fetchAPI<DiligencePlan>(`/diligence/${resolveId(id)}`),
  generateDiligencePlan: (id: string | number) => fetchAPI<DiligencePlan>(`/diligence/${resolveId(id)}`, { method: "POST" }),
  getConversationIntelligence: (id: string | number) => fetchAPI<any>(`/conversations/${resolveId(id)}`),

  // Copilot
  getCopilotStatus: () => fetchAPI<any>("/copilot/status"),
  askDealCopilot: (id: string | number, question: string) => fetchAPI<any>(`/copilot/deals/${resolveId(id)}/ask`, { method: "POST", body: JSON.stringify({ question }) }),
  getSuggestedCopilotQuestions: (id: string | number) => fetchAPI<string[]>(`/copilot/deals/${resolveId(id)}/suggested-questions`),
  getCopilotSession: (id: string | number) => fetchAPI<any>(`/copilot/deals/${resolveId(id)}/session`),
  clearCopilotSession: (id: string | number) => fetchAPI<any>(`/copilot/deals/${resolveId(id)}/clear-session`, { method: "POST" }),
  askWorkspaceCopilot: (question: string) => fetchAPI<any>("/copilot/ask", { method: "POST", body: JSON.stringify({ question }) }),

  // Knowledge Graph
  getKnowledgeGraphStatus: () => fetchAPI<any>("/knowledge-graph/status"),
  rebuildKnowledgeGraph: () => fetchAPI<any>("/knowledge-graph/rebuild", { method: "POST" }),
  rebuildDealKnowledgeGraph: (id: string | number) => fetchAPI<any>(`/knowledge-graph/deals/${resolveId(id)}/rebuild`, { method: "POST" }),
  getDealKnowledgeGraph: (id: string | number) => fetchAPI<any>(`/knowledge-graph/deals/${resolveId(id)}`),
  getSimilarDeals: (id: string | number) => fetchAPI<any[]>(`/knowledge-graph/deals/${resolveId(id)}/similar`),
  getCrossDealInsights: () => fetchAPI<any>("/knowledge-graph/insights"),

  // Sourcing Engine
  getSourcingStatus: () => fetchAPI<any>("/sourcing/status"),
  getTheses: () => fetchAPI<any[]>("/sourcing/theses"),
  getThesis: (id: string) => fetchAPI<any>(`/sourcing/theses/${id}`),
  getMarketRadar: () => fetchAPI<any[]>("/sourcing/market-radar"),
  refreshMarketRadar: () => fetchAPI<any[]>("/sourcing/market-radar/refresh", { method: "POST" }),
  discoverCompanies: (thesisId?: string) => fetchAPI<any[]>("/sourcing/discover", { method: "POST", body: JSON.stringify({ thesis_id: thesisId }) }),
  getDiscoveredCompanies: () => fetchAPI<any[]>("/sourcing/discovered-companies"),
  getSourcedCompany: (id: string) => fetchAPI<any>(`/sourcing/companies/${id}`),
  scoreSourcedCompany: (id: string) => fetchAPI<any>(`/sourcing/companies/${id}/score`, { method: "POST" }),
  generateFounderOutreach: (id: string) => fetchAPI<any>(`/sourcing/companies/${id}/outreach`, { method: "POST" }),
  convertSourcedCompanyToDeal: (id: string) => fetchAPI<any>(`/sourcing/companies/${id}/convert-to-deal`, { method: "POST" }),
  getSourcingPipeline: () => fetchAPI<any[]>("/sourcing/pipeline"),
  updateSourcingPipelineItem: (itemId: string, payload: any) => fetchAPI<any>(`/sourcing/pipeline/${itemId}`, { method: "PUT", body: JSON.stringify(payload) }),
  getMarketMap: (thesisId: string) => fetchAPI<any>(`/sourcing/market-map/${thesisId}`),

  // Portfolio Intelligence Engine
  getPortfolioStatus: () => fetchAPI<any>("/api/portfolio/status"),
  getPortfolioCompanies: () => fetchAPI<any[]>("/api/portfolio/companies"),
  getPortfolioCompany: (id: string) => fetchAPI<any>(`/api/portfolio/companies/${id}`),
  createPortfolioCompanyFromDeal: (id: string, payload: any) => fetchAPI<any>(`/api/portfolio/companies/from-deal/${id}`, { method: "POST", body: JSON.stringify(payload) }),
  getPortfolioKPIs: (id: string) => fetchAPI<any>(`/api/portfolio/companies/${id}/kpis`),
  addFounderUpdate: (id: string, payload: any) => fetchAPI<any>(`/api/portfolio/companies/${id}/founder-update`, { method: "POST", body: JSON.stringify(payload) }),
  getFounderUpdates: (id: string) => fetchAPI<any[]>(`/api/portfolio/companies/${id}/founder-updates`),
  analyzeBoardDeck: (id: string, payload: any) => fetchAPI<any>(`/api/portfolio/companies/${id}/analyze-board-deck`, { method: "POST", body: JSON.stringify(payload) }),
  getBoardDeckAnalysis: (id: string) => fetchAPI<any>(`/api/portfolio/companies/${id}/board-deck-analysis`),
  getPortfolioCompanyHealth: (id: string) => fetchAPI<any>(`/api/portfolio/companies/${id}/health`),
  getFollowOnRecommendation: (id: string) => fetchAPI<any>(`/api/portfolio/companies/${id}/follow-on`),
  getValueCreationPlan: (id: string) => fetchAPI<any[]>(`/api/portfolio/companies/${id}/value-creation`),
  getPortfolioHealth: () => fetchAPI<any>("/api/portfolio/health"),
  getPortfolioRisks: () => fetchAPI<any[]>("/api/portfolio/risks"),
  getPortfolioReserves: () => fetchAPI<any>("/api/portfolio/reserves"),
  getFollowOnCandidates: () => fetchAPI<any[]>("/api/portfolio/follow-on-candidates"),
  getLPReport: () => fetchAPI<any>("/api/portfolio/lp-report"),

  // Fund Operating System & LP Intelligence
  getFundOSStatus: () => fetchAPI<any>("/fund-os/status"),
  getFundProfile: () => fetchAPI<any>("/fund-os/profile"),
  getFundConstruction: () => fetchAPI<any>("/fund-os/construction"),
  getFundPerformance: () => fetchAPI<any>("/fund-os/performance"),
  getFundConcentration: () => fetchAPI<any>("/fund-os/concentration"),
  getFundRisks: () => fetchAPI<any[]>("/fund-os/risks"),
  getGPCockpit: () => fetchAPI<any>("/fund-os/gp-cockpit"),
  getLPs: () => fetchAPI<any[]>("/fund-os/lps"),
  getLP: (id: string) => fetchAPI<any>(`/fund-os/lps/${id}`),
  getFundraisingPipeline: () => fetchAPI<any[]>("/fund-os/fundraising-pipeline"),
  updateFundraisingPipelineItem: (itemId: string, payload: any) => fetchAPI<any>(`/fund-os/fundraising-pipeline/${itemId}`, { method: "PUT", body: JSON.stringify(payload) }),
  getLPQuestions: () => fetchAPI<any[]>("/fund-os/lp-questions"),
  getFundLPReport: () => fetchAPI<any>("/fund-os/lp-report"),

  // Operations Autopilot
  getOperationsStatus: () => fetchAPI<any>("/operations/status"),
  getTasks: () => fetchAPI<any[]>("/operations/tasks"),
  generateTasks: () => fetchAPI<any[]>("/operations/tasks/generate", { method: "POST" }),
  getTask: (taskId: string) => fetchAPI<any>(`/operations/tasks/${taskId}`),
  updateTask: (taskId: string, payload: any) => fetchAPI<any>(`/operations/tasks/${taskId}`, { method: "PUT", body: JSON.stringify(payload) }),
  completeTask: (taskId: string) => fetchAPI<any>(`/operations/tasks/${taskId}/complete`, { method: "POST" }),
  blockTask: (taskId: string) => fetchAPI<any>(`/operations/tasks/${taskId}/block`, { method: "POST" }),
  getWorkflows: () => fetchAPI<any[]>("/operations/workflows"),
  getWorkflow: (entityType: string, entityId: string) => fetchAPI<any>(`/operations/workflows/${entityType}/${entityId}`),
  updateWorkflowStage: (entityType: string, entityId: string, stage: string) => fetchAPI<any>(`/operations/workflows/${entityType}/${entityId}/stage`, { method: "PUT", body: JSON.stringify({ stage }) }),
  getNextActions: () => fetchAPI<any[]>("/operations/next-actions"),
  getDealNextActions: (dealId: string) => fetchAPI<any[]>(`/operations/next-actions/deals/${dealId}`),
  getPortfolioNextActions: (companyId: string) => fetchAPI<any[]>(`/operations/next-actions/portfolio/${companyId}`),
  getFundNextActions: () => fetchAPI<any[]>("/operations/next-actions/fund"),
  getAlerts: () => fetchAPI<any[]>("/operations/alerts"),
  refreshAlerts: () => fetchAPI<any>("/operations/alerts/refresh", { method: "POST" }),
  getNotifications: () => fetchAPI<any[]>("/operations/notifications"),
  draftNotification: (payload: any) => fetchAPI<any>("/operations/notifications/draft", { method: "POST", body: JSON.stringify(payload) }),
  getApprovals: () => fetchAPI<any[]>("/operations/approvals"),
  createApproval: (payload: any) => fetchAPI<any>("/operations/approvals", { method: "POST", body: JSON.stringify(payload) }),
  approveRequest: (approvalId: string) => fetchAPI<any>(`/operations/approvals/${approvalId}/approve`, { method: "POST" }),
  rejectRequest: (approvalId: string) => fetchAPI<any>(`/operations/approvals/${approvalId}/reject`, { method: "POST" }),
  getDailyCadence: () => fetchAPI<any>("/operations/cadence/daily"),
  getWeeklyPartnerCadence: () => fetchAPI<any>("/operations/cadence/weekly-partner"),
  getSourcingCadence: () => fetchAPI<any>("/operations/cadence/sourcing"),
  getPortfolioCadence: () => fetchAPI<any>("/operations/cadence/portfolio"),
  getLPUpdateCadence: () => fetchAPI<any>("/operations/cadence/lp-update"),
  getAuditLog: () => fetchAPI<any[]>("/operations/audit-log"),

  getFundDataRoom: () => fetchAPI<any[]>("/fund-os/data-room"),
  updateFundDataRoomItem: (itemId: string, payload: any) => fetchAPI<any>(`/fund-os/data-room/${itemId}`, { method: "PUT", body: JSON.stringify(payload) }),
  getCapitalCalls: () => fetchAPI<any[]>("/fund-os/capital-calls"),
  planCapitalCall: (payload?: any) => fetchAPI<any>("/fund-os/capital-calls/plan", { method: "POST", body: payload ? JSON.stringify(payload) : undefined }),
  getDistributions: () => fetchAPI<any>("/fund-os/distributions"),
  getFundNarrative: () => fetchAPI<any>("/fund-os/narrative"),
  generateFundNarrative: (payload?: any) => fetchAPI<any>("/fund-os/narrative/generate", { method: "POST", body: payload ? JSON.stringify(payload) : undefined }),
  // --- TRUST LAYER ---
  getTrustStatus: async () => {
    return fetchAPI<any>('/trust/status');
  },
  runTrustAudit: async () => {
    return fetchAPI<any>('/trust/audit', { method: 'POST' });
  },
  getTrustScores: async () => {
    return fetchAPI<any>('/trust/scores');
  },
  getProvenance: async () => {
    return fetchAPI<any>('/trust/provenance');
  },
  getClaims: async () => {
    return fetchAPI<any>('/trust/claims');
  },
  getGates: async () => {
    return fetchAPI<any>('/trust/gates');
  },
  getReviewQueue: async () => {
    return fetchAPI<any>('/trust/review-queue');
  },
  updateReviewStatus: async (outputId: string, payload: any) => {
    return fetchAPI<any>(`/trust/review/${outputId}/update`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // --- EVALS ---
  getEvalsStatus: async () => {
    return fetchAPI<any>('/evals/status');
  },
  runEvals: async () => {
    return fetchAPI<any>('/evals/run', { method: 'POST' });
  },
  getEvalResults: async () => {
    return fetchAPI<any>('/evals/results');
  },
  getGoldenCases: async () => {
    return fetchAPI<any>('/evals/golden-cases');
  },
  getCopilotEvals: async () => {
    return fetchAPI<any>('/evals/copilot');
  },
  getDecisionGates: async () => {
    return fetchAPI<any>('/evals/decision-gates');
  },
  getDemoFlowEvals: async () => {
    return fetchAPI<any>('/evals/demo-flow');
  },

  // --- OBSERVABILITY ---
  getObsStatus: async () => {
    return fetchAPI<any>('/observability/status');
  },
  getObservabilityHealth: async () => {
    return fetchAPI<any>('/observability/health');
  },
  getErrors: async () => {
    return fetchAPI<any>('/observability/errors');
  },
  getProviderHealth: async () => {
    return fetchAPI<any>('/observability/provider-health');
  },
  getFeatureHealth: async () => {
    return fetchAPI<any>('/observability/feature-health');
  },
  runRouteCheck: async () => {
    return fetchAPI<any>('/observability/route-check', { method: 'POST' });
  },
  runDemoFlowCheck: async () => {
    return fetchAPI<any>('/observability/demo-flow-check', { method: 'POST' });
  },

  // --- SECURITY / RBAC ---
  getSecurityStatus: async () => {
    return fetchAPI<any>('/security/status');
  },
  getRbac: async () => {
    return fetchAPI<any>('/security/rbac');
  },
  switchRole: async (role: string) => {
    return fetchAPI<any>('/security/role-switch', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
  },

  // --- DEMO RELIABILITY ---
  getDemoReliabilityStatus: async () => {
    return fetchAPI<any>('/demo-reliability/status');
  },
  runDemoCheck: async () => {
    return fetchAPI<any>('/demo-reliability/run-check', { method: 'POST' });
  },
  // --- FUND PLAYBOOK ENGINE ---
  getPlaybookStatus: async () => {
    return fetchAPI<any>('/playbooks/status');
  },
  getPlaybooks: async () => {
    return fetchAPI<any>('/playbooks');
  },
  getDefaultPlaybooks: async () => {
    return fetchAPI<any>('/playbooks/defaults');
  },
  getPlaybook: async (playbookId: string) => {
    return fetchAPI<any>(`/playbooks/${playbookId}`);
  },
  activatePlaybook: async (playbookId: string) => {
    return fetchAPI<any>('/playbooks/activate', {
      method: 'POST',
      body: JSON.stringify({ playbook_id: playbookId })
    });
  },
  simulateDealAcrossPlaybooks: async (dealId: string) => {
    return fetchAPI<any>(`/playbooks/simulate/deal/${dealId}`, { method: 'POST' });
  },
  comparePlaybooks: async (playbookA: string, playbookB: string) => {
    return fetchAPI<any>('/playbooks/compare', {
      method: 'POST',
      body: JSON.stringify({ playbookA, playbookB })
    });
  },
  // --- DECISION LAB ---
  getDecisionLabStatus: async () => {
    return fetchAPI<any>('/decision-lab/status');
  },
  getHistoricalCases: async () => {
    return fetchAPI<any>('/decision-lab/cases');
  },
  getHistoricalCase: async (caseId: string) => {
    return fetchAPI<any>(`/decision-lab/cases/${caseId}`);
  },
  createHistoricalCase: async (payload: any) => {
    return fetchAPI<any>('/decision-lab/cases', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  runBacktest: async (payload: any) => {
    return fetchAPI<any>('/decision-lab/backtests/run', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  getBacktests: async () => {
    return fetchAPI<any>('/decision-lab/backtests');
  },
  getBacktest: async (runId: string) => {
    return fetchAPI<any>(`/decision-lab/backtests/${runId}`);
  },
  runCounterfactual: async (payload: any) => {
    return fetchAPI<any>('/decision-lab/counterfactuals/run', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  getCounterfactual: async (scenarioId: string) => {
    return fetchAPI<any>(`/decision-lab/counterfactuals/${scenarioId}`);
  },
  getMissedDeals: async () => {
    return fetchAPI<any>('/decision-lab/missed-deals');
  },
  getFalsePositives: async () => {
    return fetchAPI<any>('/decision-lab/false-positives');
  },
  getSignalAttribution: async () => {
    return fetchAPI<any>('/decision-lab/signals');
  },
  getPlaybookBacktests: async () => {
    return fetchAPI<any>('/decision-lab/playbook-backtests');
  },
  getDecisionQuality: async () => {
    return fetchAPI<any>('/decision-lab/decision-quality');
  },
  getHindsightLearnings: async () => {
    return fetchAPI<any>('/decision-lab/hindsight-learnings');
  },
  getCutoffIntegrity: async (caseId: string) => {
    return fetchAPI<any>(`/decision-lab/cutoff-integrity/${caseId}`);
  },
  // --- CONNECTOR HUB ---
  getConnectorStatus: async () => fetchAPI<any>('/connectors/status'),
  getConnectorProviders: async () => fetchAPI<any[]>('/connectors/providers'),
  getProviderStatus: async (provider: string) => fetchAPI<any>(`/connectors/${provider}/status`),
  syncProvider: async (provider: string) => fetchAPI<any>(`/connectors/${provider}/sync`, { method: 'POST' }),
  getConnectorSyncRuns: async () => fetchAPI<any[]>('/connectors/sync-runs'),
  getConnectorPrivacyPolicy: async () => fetchAPI<any>('/connectors/privacy-policy'),
  getMockEmails: async () => fetchAPI<any>('/connectors/mock/emails'),
  getMockCalendar: async () => fetchAPI<any>('/connectors/mock/calendar'),
  getMockDrive: async () => fetchAPI<any>('/connectors/mock/drive'),
  getMockCRM: async () => fetchAPI<any>('/connectors/mock/crm'),
  getMockSlack: async () => fetchAPI<any>('/connectors/mock/slack'),

  // --- DEAL INBOX ---
  getDealInboxStatus: async () => fetchAPI<any>('/deal-inbox/status'),
  getDealInboxItems: async () => fetchAPI<any>('/deal-inbox/items'),
  getDealInboxItem: async (inboundId: string) => fetchAPI<any>(`/deal-inbox/items/${inboundId}`),
  syncDealInbox: async () => fetchAPI<any>('/deal-inbox/sync', { method: 'POST' }),
  triageInboundDeal: async (inboundId: string) => fetchAPI<any>(`/deal-inbox/items/${inboundId}/triage`, { method: 'POST' }),
  convertInboundToDeal: async (inboundId: string) => fetchAPI<any>(`/deal-inbox/items/${inboundId}/convert-to-deal`, { method: 'POST' }),
  passInboundDeal: async (inboundId: string) => fetchAPI<any>(`/deal-inbox/items/${inboundId}/pass`, { method: 'POST' }),
  watchlistInboundDeal: async (inboundId: string) => fetchAPI<any>(`/deal-inbox/items/${inboundId}/watchlist`, { method: 'POST' }),
  requestInboundInfo: async (inboundId: string) => fetchAPI<any>(`/deal-inbox/items/${inboundId}/request-info`, { method: 'POST' }),
  getInboundDuplicates: async () => fetchAPI<any>('/deal-inbox/duplicates'),
  getInboundPriorityQueue: async () => fetchAPI<any>('/deal-inbox/priority-queue'),

  // --- MEETING INTELLIGENCE ---
  getMeetingsStatus: async () => fetchAPI<any>('/meetings/status'),
  getMeetings: async () => fetchAPI<any>('/meetings'),
  getMeeting: async (meetingId: string) => fetchAPI<any>(`/meetings/${meetingId}`),
  syncCalendarMeetings: async () => fetchAPI<any>('/meetings/sync-calendar', { method: 'POST' }),
  generateMeetingPrep: async (meetingId: string) => fetchAPI<any>(`/meetings/${meetingId}/generate-prep`, { method: 'POST' }),
  uploadMeetingTranscript: async (meetingId: string, payload: any) => fetchAPI<any>(`/meetings/${meetingId}/upload-transcript`, { method: 'POST', body: JSON.stringify(payload) }),
  analyzeMeetingTranscript: async (meetingId: string) => fetchAPI<any>(`/meetings/${meetingId}/analyze-transcript`, { method: 'POST' }),
  getMeetingSummary: async (meetingId: string) => fetchAPI<any>(`/meetings/${meetingId}/summary`),
  getMeetingActionItems: async (meetingId: string) => fetchAPI<any>(`/meetings/${meetingId}/action-items`),
  addPartnerNote: async (meetingId: string, payload: any) => fetchAPI<any>(`/meetings/${meetingId}/partner-note`, { method: 'POST', body: JSON.stringify(payload) }),
  getUpcomingMeetings: async () => fetchAPI<any>('/meetings/queue/upcoming'),
  getMeetingFollowups: async () => fetchAPI<any>('/meetings/queue/followups'),
  // --- DEAL STRUCTURING ---
  getDealStructuringStatus: async () => fetchAPI<any>('/deal-structuring/status'),
  getDealStructuringReport: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/report`),
  runDealStructuring: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/run`, { method: 'POST' }),
  getRoundStructure: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/round-structure`),
  getValuationAnalysis: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/valuation`),
  getOwnershipAnalysis: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/ownership`),
  getDilutionScenarios: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/dilution`),
  getSafeVsEquityComparison: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/safe-vs-equity`),
  getProRataAnalysis: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/pro-rata`),
  getLeadParticipateRecommendation: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/lead-or-participate`),
  getSyndicateStrategy: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/syndicate`),
  getTermSheetAnalysis: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/term-sheet`),
  analyzeTermSheet: async (dealId: string, payload: any) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/term-sheet/analyze`, { method: 'POST', body: JSON.stringify(payload) }),
  getNegotiationPrep: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/negotiation-prep`),
  getClosingChecklist: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/closing-checklist`),
  updateClosingChecklistItem: async (dealId: string, itemId: string, payload: any) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/closing-checklist/${itemId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getLegalDiligence: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/legal-diligence`),
  updateLegalDiligenceItem: async (dealId: string, itemId: string, payload: any) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/legal-diligence/${itemId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  runPostCloseHandoff: async (dealId: string) => fetchAPI<any>(`/deal-structuring/deals/${dealId}/post-close-handoff`, { method: 'POST' }),

  // --- DOCUMENT INTELLIGENCE ---
  getDocumentStatus: async () => fetchAPI<any>('/documents/status'),
  getDealDocuments: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/documents`),
  uploadDealDocument: async (dealId: string, file: File, documentType?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (documentType) formData.append('document_type', documentType);
    
    // Custom fetch for multipart/form-data
    const res = await fetch(`${API_BASE_URL}/deals/${dealId}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
  getDealDocument: async (dealId: string, documentId: string) => fetchAPI<any>(`/deals/${dealId}/documents/${documentId}`),
  deleteDealDocument: async (dealId: string, documentId: string) => fetchAPI<any>(`/deals/${dealId}/documents/${documentId}`, { method: 'DELETE' }),
  archiveDealDocument: async (dealId: string, documentId: string) => fetchAPI<any>(`/deals/${dealId}/documents/${documentId}/archive`, { method: 'POST' }),
  reprocessDealDocument: async (dealId: string, documentId: string) => fetchAPI<any>(`/deals/${dealId}/documents/${documentId}/reprocess`, { method: 'POST' }),
  getDocumentParseResult: async (dealId: string, documentId: string) => fetchAPI<any>(`/deals/${dealId}/documents/${documentId}/parse-result`),
  getDocumentClaims: async (dealId: string, documentId: string) => fetchAPI<any>(`/deals/${dealId}/documents/${documentId}/claims`),
  getDocumentSummary: async (dealId: string, documentId: string) => fetchAPI<any>(`/deals/${dealId}/documents/${documentId}/summary`),
  classifyDocument: async (dealId: string, documentId: string) => fetchAPI<any>(`/deals/${dealId}/documents/${documentId}/classify`, { method: 'POST' }),
  updateDocumentType: async (dealId: string, documentId: string, documentType: string) => fetchAPI<any>(`/deals/${dealId}/documents/${documentId}/document-type`, { method: 'PUT', body: JSON.stringify({ document_type: documentType }) }),
  mapDocumentToEvidence: async (dealId: string, documentId: string) => fetchAPI<any>(`/deals/${dealId}/documents/${documentId}/map-to-evidence`, { method: 'POST' }),
  getDocumentEvidenceImpact: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/documents/evidence-impact`),
  getDocumentMissingInfoImpact: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/documents/missing-info-impact`),

  // --- ONE-CLICK DILIGENCE RUN ---
  getDiligenceRunStatus: async () => fetchAPI<any>('/diligence-runs/status'),
  getDealDiligenceRuns: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/diligence-runs`),
  runDealDiligence: async (dealId: string, config: any) => fetchAPI<any>(`/deals/${dealId}/diligence-runs/run`, { method: 'POST', body: JSON.stringify(config) }),
  getLatestDiligenceRun: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/diligence-runs/latest`),
  getDiligenceRun: async (dealId: string, runId: string) => fetchAPI<any>(`/deals/${dealId}/diligence-runs/${runId}`),
  getDiligenceRunSteps: async (dealId: string, runId: string) => fetchAPI<any>(`/deals/${dealId}/diligence-runs/${runId}/steps`),
  getDiligenceRunReport: async (dealId: string, runId: string) => fetchAPI<any>(`/deals/${dealId}/diligence-runs/${runId}/report`),
  getDiligenceRunTasks: async (dealId: string, runId: string) => fetchAPI<any>(`/deals/${dealId}/diligence-runs/${runId}/tasks`),
  rerunDiligenceRun: async (dealId: string, runId: string, config: any) => fetchAPI<any>(`/deals/${dealId}/diligence-runs/${runId}/rerun`, { method: 'POST', body: JSON.stringify(config) }),
  compareDiligenceRuns: async (dealId: string, runA: string, runB: string) => fetchAPI<any>(`/deals/${dealId}/diligence-runs/compare?run_a=${runA}&run_b=${runB}`),
  // --- PLATFORM DILIGENCE ---
  getPlatformDiligenceStatus: async () => fetchAPI<any>('/platform-diligence/status'),
  getPlatformSources: async () => fetchAPI<any>('/platform-diligence/sources'),
  updatePlatformSource: async (sourceName: string, payload: any) => fetchAPI<any>(`/platform-diligence/sources/${sourceName}`, { method: 'PUT', body: JSON.stringify(payload) }),
  testPlatformSource: async (sourceName: string) => fetchAPI<any>(`/platform-diligence/test-source/${sourceName}`, { method: 'POST' }),
  
  runPlatformDiligence: async (dealId: string, config: any) => fetchAPI<any>(`/deals/${dealId}/platform-diligence/run`, { method: 'POST', body: JSON.stringify(config) }),
  getLatestPlatformDiligence: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/platform-diligence/latest`),
  getPlatformDiligenceRuns: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/platform-diligence/runs`),
  getPlatformDiligenceRun: async (dealId: string, runId: string) => fetchAPI<any>(`/deals/${dealId}/platform-diligence/runs/${runId}`),
  getPlatformDiligenceReport: async (dealId: string, runId: string) => fetchAPI<any>(`/deals/${dealId}/platform-diligence/runs/${runId}/report`),
  
  getPlatformSignals: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/platform-signals`),
  getRedditSignals: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/platform-signals/reddit`),
  getReviewSignals: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/platform-signals/reviews`),
  getCompetitorSignals: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/platform-signals/competitors`),
  getPainPointSignals: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/platform-signals/pain-points`),
  getReputationRisks: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/platform-signals/reputation-risks`),
  
  mapPlatformRunToEvidence: async (dealId: string, runId: string) => fetchAPI<any>(`/deals/${dealId}/platform-diligence/runs/${runId}/map-to-evidence`, { method: 'POST' }),
  getPlatformEvidenceImpact: async (dealId: string) => fetchAPI<any>(`/deals/${dealId}/platform-diligence/evidence-impact`),
};

