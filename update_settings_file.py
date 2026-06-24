with open("frontend/app/settings/page.tsx", "r") as f:
    content = f.read()

import re

injection_state = """  const [healthData, setHealthData] = useState<any>(null)
  const [researchStatus, setResearchStatus] = useState<any>(null)"""

injection_fetch = """    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/ai/status`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/health`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/web-research/status`).then(res => res.json()).catch(() => ({}))
    ])
      .then(([status, health, research]) => {
        setStatusData(status)
        setHealthData(health)
        setResearchStatus(research)
        setLoading(false)
      })"""

injection_ui = """
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Web Research Engine Config
          </CardTitle>
          <CardDescription>Configure external search providers and evidence limits.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border rounded-md bg-muted/20">
              <div className="text-xs text-muted-foreground uppercase mb-1">Status</div>
              <div className="font-semibold">{researchStatus?.web_research_enabled ? "Enabled" : "Disabled (Mock Only)"}</div>
            </div>
            <div className="p-3 border rounded-md bg-muted/20">
              <div className="text-xs text-muted-foreground uppercase mb-1">Research Mode</div>
              <div className="font-semibold">{researchStatus?.research_mode || "Mock"}</div>
            </div>
            <div className="p-3 border rounded-md bg-muted/20">
              <div className="text-xs text-muted-foreground uppercase mb-1">Search Provider</div>
              <div className="font-semibold capitalize">{researchStatus?.search_provider || "Mock"}</div>
            </div>
            <div className="p-3 border rounded-md bg-muted/20">
              <div className="text-xs text-muted-foreground uppercase mb-1">Max Sources</div>
              <div className="font-semibold">{researchStatus?.max_sources || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>
"""

if "setResearchStatus" not in content:
    content = content.replace("  const [healthData, setHealthData] = useState<any>(null)", injection_state)
    
    content = re.sub(r'    Promise\.all\(\[[\s\S]*?\]\)\n      \.then\(\(\[status, health\]\) => \{[\s\S]*?\}\)', injection_fetch, content)
    
    content = content.replace('import { ShieldAlert, Server, CheckCircle2, XCircle } from "lucide-react"', 'import { ShieldAlert, Server, CheckCircle2, XCircle, Globe } from "lucide-react"')
    
    content = content.replace('      <div className="mt-12 text-center text-xs text-muted-foreground/60 max-w-3xl mx-auto border-t pt-8">', injection_ui + '\n      <div className="mt-12 text-center text-xs text-muted-foreground/60 max-w-3xl mx-auto border-t pt-8">')

with open("frontend/app/settings/page.tsx", "w") as f:
    f.write(content)
