export class DecisionsServiceError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "DecisionsServiceError";
  }
}

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_BASE_URL = RAW_API_URL.replace(/\/$/, "");

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  let accessToken = typeof window !== "undefined" ? localStorage.getItem("apex_access_token") : null;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errorData = await response.json();
      if (errorData.detail) errorMsg = errorData.detail;
    } catch (e) {}
    throw new DecisionsServiceError(response.status, errorMsg);
  }
  
  return response.json();
}

export interface HumanDecisionInput {
  human_final_decision: string;
  human_rationale: string;
  override_reason?: string | null;
  approvers_json?: string | null;
  conditions_json?: string | null;
}

export const DecisionsService = {
  getEvaluation: async (decisionId: string | number) => {
    return fetchAPI<any>(`/api/v1/decisions/${decisionId}/evaluate`);
  },
  
  getHumanDecision: async (decisionId: string | number) => {
    return fetchAPI<any>(`/api/v1/decisions/${decisionId}/human_decision`);
  },
  
  recordHumanDecision: async (decisionId: string | number, data: HumanDecisionInput) => {
    return fetchAPI<any>(`/api/v1/decisions/${decisionId}/human_decision`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
};
