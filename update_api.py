with open("frontend/lib/api.ts", "r") as f:
    content = f.read()

injection = """
export async function getDealWebResearch(dealId: number) {
  const res = await fetch(`${API_BASE_URL}/web-research/deals/${dealId}`);
  if (!res.ok) throw new Error("Failed to fetch web research");
  return res.json();
}

export async function runDealWebResearch(dealId: number) {
  const res = await fetch(`${API_BASE_URL}/web-research/deals/${dealId}/run`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to run web research");
  return res.json();
}

export async function getWebResearchStatus() {
  const res = await fetch(`${API_BASE_URL}/web-research/status`);
  if (!res.ok) throw new Error("Failed to fetch web research status");
  return res.json();
}
"""

if "getDealWebResearch" not in content:
    content += injection

with open("frontend/lib/api.ts", "w") as f:
    f.write(content)
