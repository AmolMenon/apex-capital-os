import re

with open("frontend/lib/api.ts", "r") as f:
    content = f.read()

methods = """
  // --- DEAL STRUCTURING ---
  getDealStructuringStatus: async () => fetchAPI('/deal-structuring/status'),
  getDealStructuringReport: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/report`),
  runDealStructuring: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/run`, { method: 'POST' }),
  getRoundStructure: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/round-structure`),
  getValuationAnalysis: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/valuation`),
  getOwnershipAnalysis: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/ownership`),
  getDilutionScenarios: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/dilution`),
  getSafeVsEquityComparison: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/safe-vs-equity`),
  getProRataAnalysis: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/pro-rata`),
  getLeadParticipateRecommendation: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/lead-or-participate`),
  getSyndicateStrategy: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/syndicate`),
  getTermSheetAnalysis: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/term-sheet`),
  analyzeTermSheet: async (dealId: string, payload: any) => fetchAPI(`/deal-structuring/deals/${dealId}/term-sheet/analyze`, { method: 'POST', body: JSON.stringify(payload) }),
  getNegotiationPrep: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/negotiation-prep`),
  getClosingChecklist: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/closing-checklist`),
  updateClosingChecklistItem: async (dealId: string, itemId: string, payload: any) => fetchAPI(`/deal-structuring/deals/${dealId}/closing-checklist/${itemId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getLegalDiligence: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/legal-diligence`),
  updateLegalDiligenceItem: async (dealId: string, itemId: string, payload: any) => fetchAPI(`/deal-structuring/deals/${dealId}/legal-diligence/${itemId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  runPostCloseHandoff: async (dealId: string) => fetchAPI(`/deal-structuring/deals/${dealId}/post-close-handoff`, { method: 'POST' }),
"""

content = re.sub(r'(\s*};\s*)$', methods + r'\1', content)

with open("frontend/lib/api.ts", "w") as f:
    f.write(content)

print("api.ts patched for deal structuring.")
