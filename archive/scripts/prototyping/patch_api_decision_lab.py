import re

with open("frontend/lib/api.ts", "r") as f:
    content = f.read()

methods = """
  // --- DECISION LAB ---
  getDecisionLabStatus: async () => {
    return fetchAPI('/decision-lab/status');
  },
  getHistoricalCases: async () => {
    return fetchAPI('/decision-lab/cases');
  },
  getHistoricalCase: async (caseId: string) => {
    return fetchAPI(`/decision-lab/cases/${caseId}`);
  },
  createHistoricalCase: async (payload: any) => {
    return fetchAPI('/decision-lab/cases', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  runBacktest: async (payload: any) => {
    return fetchAPI('/decision-lab/backtests/run', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  getBacktests: async () => {
    return fetchAPI('/decision-lab/backtests');
  },
  getBacktest: async (runId: string) => {
    return fetchAPI(`/decision-lab/backtests/${runId}`);
  },
  runCounterfactual: async (payload: any) => {
    return fetchAPI('/decision-lab/counterfactuals/run', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  getCounterfactual: async (scenarioId: string) => {
    return fetchAPI(`/decision-lab/counterfactuals/${scenarioId}`);
  },
  getMissedDeals: async () => {
    return fetchAPI('/decision-lab/missed-deals');
  },
  getFalsePositives: async () => {
    return fetchAPI('/decision-lab/false-positives');
  },
  getSignalAttribution: async () => {
    return fetchAPI('/decision-lab/signals');
  },
  getPlaybookBacktests: async () => {
    return fetchAPI('/decision-lab/playbook-backtests');
  },
  getDecisionQuality: async () => {
    return fetchAPI('/decision-lab/decision-quality');
  },
  getHindsightLearnings: async () => {
    return fetchAPI('/decision-lab/hindsight-learnings');
  },
  getCutoffIntegrity: async (caseId: string) => {
    return fetchAPI(`/decision-lab/cutoff-integrity/${caseId}`);
  },
"""

content = re.sub(r'(\s*};\s*)$', methods + r'\1', content)

with open("frontend/lib/api.ts", "w") as f:
    f.write(content)

print("api.ts patched for decision lab successfully.")
