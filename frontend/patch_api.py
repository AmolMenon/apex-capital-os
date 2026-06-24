import re

with open("frontend/lib/api.ts", "r") as f:
    content = f.read()

trust_methods = """
  // --- TRUST LAYER ---
  getTrustStatus: async () => {
    return fetchAPI('/trust/status');
  },
  runTrustAudit: async () => {
    return fetchAPI('/trust/audit', { method: 'POST' });
  },
  getTrustScores: async () => {
    return fetchAPI('/trust/scores');
  },
  getProvenance: async () => {
    return fetchAPI('/trust/provenance');
  },
  getClaims: async () => {
    return fetchAPI('/trust/claims');
  },
  getGates: async () => {
    return fetchAPI('/trust/gates');
  },
  getReviewQueue: async () => {
    return fetchAPI('/trust/review-queue');
  },
  updateReviewStatus: async (outputId: string, payload: any) => {
    return fetchAPI(`/trust/review/${outputId}/update`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // --- EVALS ---
  getEvalsStatus: async () => {
    return fetchAPI('/evals/status');
  },
  runEvals: async () => {
    return fetchAPI('/evals/run', { method: 'POST' });
  },
  getEvalResults: async () => {
    return fetchAPI('/evals/results');
  },
  getGoldenCases: async () => {
    return fetchAPI('/evals/golden-cases');
  },
  getCopilotEvals: async () => {
    return fetchAPI('/evals/copilot');
  },
  getDecisionGates: async () => {
    return fetchAPI('/evals/decision-gates');
  },
  getDemoFlowEvals: async () => {
    return fetchAPI('/evals/demo-flow');
  },

  // --- OBSERVABILITY ---
  getObsStatus: async () => {
    return fetchAPI('/observability/status');
  },
  getHealth: async () => {
    return fetchAPI('/observability/health');
  },
  getErrors: async () => {
    return fetchAPI('/observability/errors');
  },
  getProviderHealth: async () => {
    return fetchAPI('/observability/provider-health');
  },
  getFeatureHealth: async () => {
    return fetchAPI('/observability/feature-health');
  },
  runRouteCheck: async () => {
    return fetchAPI('/observability/route-check', { method: 'POST' });
  },
  runDemoFlowCheck: async () => {
    return fetchAPI('/observability/demo-flow-check', { method: 'POST' });
  },

  // --- SECURITY / RBAC ---
  getSecurityStatus: async () => {
    return fetchAPI('/security/status');
  },
  getRbac: async () => {
    return fetchAPI('/security/rbac');
  },
  switchRole: async (role: string) => {
    return fetchAPI('/security/role-switch', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
  },

  // --- DEMO RELIABILITY ---
  getDemoReliabilityStatus: async () => {
    return fetchAPI('/demo-reliability/status');
  },
  runDemoCheck: async () => {
    return fetchAPI('/demo-reliability/run-check', { method: 'POST' });
  },
"""

# Insert right before the last closing brace in the `export const api = { ... };` object.
content = re.sub(r'(\s*};\s*)$', trust_methods + r'\1', content)

with open("frontend/lib/api.ts", "w") as f:
    f.write(content)

print("api.ts patched successfully.")
