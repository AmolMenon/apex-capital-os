import axios from "axios";
import { InvestmentCaseResponse } from "../types/investment-case";

// Define the base URL
const API_BASE = "/api/v1";

export const InvestmentCaseService = {
  /**
   * Fetch the canonical investment case for a decision.
   */
  async getInvestmentCase(decisionId: string | number): Promise<InvestmentCaseResponse> {
    const res = await axios.get(`${API_BASE}/decisions/${decisionId}/investment-case`);
    return res.data;
  },

  /**
   * Get all claims for a decision (Claim Inventory)
   * This is an independent data source representing all extracted deal claims,
   * used for linked/unlinked discovery and analyst workflows.
   */
  async getClaimInventory(decisionId: string | number): Promise<any[]> {
    const res = await axios.get(`${API_BASE}/decisions/${decisionId}/claims`);
    return res.data;
  },

  /**
   * Create a new assumption for the deal.
   */
  async createAssumption(decisionId: string | number, statement: string, category: string = "Other"): Promise<{ id: number }> {
    const res = await axios.post(`${API_BASE}/decisions/${decisionId}/assumptions`, {
      statement,
      category
    });
    return res.data;
  },

  /**
   * Update safe editable fields of an assumption.
   */
  async updateAssumption(decisionId: string | number, assumptionId: number, statement?: string, category?: string): Promise<void> {
    const payload: any = {};
    if (statement) payload.statement = statement;
    if (category) payload.category = category;
    
    await axios.patch(`${API_BASE}/decisions/${decisionId}/assumptions/${assumptionId}`, payload);
  },

  /**
   * Link an existing claim to an assumption.
   */
  async linkClaimToAssumption(
    decisionId: string | number,
    assumptionId: number,
    claimId: number,
    relationship: "SUPPORTS" | "CONTRADICTS" | "CONTEXT"
  ): Promise<void> {
    await axios.post(`${API_BASE}/decisions/${decisionId}/assumptions/${assumptionId}/claim-links`, {
      claim_id: claimId,
      relationship
    });
  },

  /**
   * Log an analyst-identified conflict between two claims.
   */
  async logConflict(decisionId: string | number, claimAId: number, claimBId: number): Promise<{ id: number }> {
    const res = await axios.post(`${API_BASE}/decisions/${decisionId}/conflicts`, {
      claim_a_id: claimAId,
      claim_b_id: claimBId
    });
    return res.data;
  },

  /**
   * Trigger diligence analysis to evaluate evidence conflicts and assumptions.
   */
  async runDiligenceAnalysis(decisionId: string | number): Promise<any> {
    const res = await axios.post(`${API_BASE}/decisions/${decisionId}/evaluate_adaptive`);
    return res.data;
  },

  /**
   * Get the current status of diligence analysis
   */
  async getDiligenceStatus(decisionId: string | number): Promise<{status: string, run_id?: number}> {
    const res = await axios.get(`${API_BASE}/decisions/${decisionId}/status`);
    return res.data;
  }
};
