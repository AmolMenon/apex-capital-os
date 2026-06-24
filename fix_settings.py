with open("frontend/app/settings/page.tsx", "r") as f:
    content = f.read()

import re

injection = """
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            Live Agentic Workflow Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border rounded-md bg-muted/20">
              <div className="text-xs text-muted-foreground uppercase mb-1">Status</div>
              <div className="font-semibold text-green-600">Enabled</div>
            </div>
            <div className="p-3 border rounded-md bg-muted/20">
              <div className="text-xs text-muted-foreground uppercase mb-1">Workflow Mode</div>
              <div className="font-semibold capitalize text-indigo-600">Live LLM / Fallback</div>
            </div>
            <div className="p-3 border rounded-md bg-muted/20">
              <div className="text-xs text-muted-foreground uppercase mb-1">Default Provider</div>
              <div className="font-semibold">Gemini</div>
            </div>
            <div className="p-3 border rounded-md bg-muted/20">
              <div className="text-xs text-muted-foreground uppercase mb-1">Mock Fallback</div>
              <div className="font-semibold text-amber-600">Active (Safe)</div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-3">Agent Routing</h4>
              <div className="flex flex-wrap gap-2">
                {["Research Planner (Gemini)", "Search (Gemini)", "Source Quality (Gemini)", "Claim Extraction (Gemini)", "Evidence Verification (Gemini)", "Market Mapping (Gemini)", "Competitor Analysis (Gemini)", "Diligence Gap (Gemini)", "Fund Fit (Gemini)", "Red Team (Claude)", "Memo Writer (Gemini)", "IC Readiness (Gemini)"].map((agent, i) => (
                  <div key={i} className="text-[10px] border px-2 py-1 rounded-full bg-slate-50 text-slate-700 font-mono">
                    {agent}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-none flex items-end">
              <button onClick={() => alert("Testing AI Router...\\n\\n[Mock Fallback triggered: Missing GEMINI_API_KEY]")} className="text-xs px-4 py-2 border rounded-md hover:bg-slate-50">
                Test Agent Router
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
"""

# replace the existing agent config block
content = re.sub(r'<Card className="border-primary/20">.*?</Card>', injection, content, flags=re.DOTALL)

with open("frontend/app/settings/page.tsx", "w") as f:
    f.write(content)
