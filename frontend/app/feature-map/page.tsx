import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ExternalLink, CheckCircle, FlaskConical, ShieldAlert, Zap } from "lucide-react"

export default function FeatureMapPage() {
  const categories = [
    {
      title: "Core Infrastructure",
      features: [
        { name: "Command Center", desc: "VC Analyst Hub (Priorities, Queues)", status: "Ready", route: "/command-center" },
        { name: "Demo Control Center", desc: "Centralized demo navigation", status: "Ready", route: "/demo-control-center" },
        { name: "System Status", path: "Backend & LLM routing health", status: "Ready", route: "/system-status" },
        { name: "Investor Walkthrough", desc: "Scripted presentation mode", status: "Ready", route: "/walkthrough" },
      ]
    },
    {
      title: "Intelligence & Workflows",
      features: [
        { name: "Public Web Research", desc: "Searches web for background context", status: "Live & Mock", route: "/deals/1000/web-research" },
        { name: "Agentic VC Workflow", desc: "12-Agent sequential evaluation loop", status: "Live & Mock", route: "/deals/1000/agent-workflow" },
        { name: "Deck Intelligence", desc: "Analyzes uploaded pitch decks", status: "Needs API Key", route: "/deals/1000/deck" },
        { name: "Conversation Intelligence", desc: "Analyzes founder call transcripts", status: "Needs Private Data", route: "/deals/1000/conversations" },
      ]
    },
    {
      title: "Diligence & Decision Engine",
      features: [
        { name: "Evidence Center", desc: "Source-backed fact verification graph", status: "Ready", route: "/deals/1000/evidence-center" },
        { name: "Red Team Room", desc: "Skeptical partner objections & hype risk", status: "Ready", route: "/deals/1000/red-team" },
        { name: "Decision Engine", desc: "Calculated scoring and recommendation cap", status: "Ready", route: "/deals/1000/decision" },
        { name: "Fund Fit", desc: "Checks mandate and ownership potential", status: "Ready", route: "/deals/1000/fund-fit" },
      ]
    },
    {
      title: "Investment Outputs",
      features: [
        { name: "IC Packet Builder", desc: "Compiled IC Document", status: "Ready", route: "/deals/1000/ic-packet" },
        { name: "Public Benchmark Memo", desc: "Generated deal memo based on public signal", status: "Ready", route: "/deals/1000/memo" },
        { name: "IC One-Pager", desc: "Summarized single page overview", status: "Ready", route: "/deals/1000/ic-one-pager" },
        { name: "Founder Email", desc: "Generated diligence follow-up email", status: "Ready", route: "/deals/1000/founder-email" },
      ]
    }
  ]

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Ready": return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100"><CheckCircle className="w-3 h-3 mr-1"/> Ready</Badge>
      case "Live & Mock": return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100"><Zap className="w-3 h-3 mr-1"/> Live & Mock</Badge>
      case "Needs API Key": return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100"><ShieldAlert className="w-3 h-3 mr-1"/> Needs API Key</Badge>
      case "Needs Private Data": return <Badge className="bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100"><FlaskConical className="w-3 h-3 mr-1"/> Private Data Only</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feature Map</h1>
        <p className="text-muted-foreground text-lg mt-2">A complete directory of all capabilities within Apex Capital Agentic OS.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {categories.map((cat, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2">{cat.title}</h3>
            <div className="grid grid-cols-1 gap-3">
              {cat.features.map((feat, j) => (
                <Card key={j} className="hover:shadow-md transition-all">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{feat.name}</span>
                        {getStatusBadge(feat.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{feat.desc || feat.path}</p>
                    </div>
                    {feat.route && (
                      <Link href={feat.route}>
                        <div className="p-2 rounded-full hover:bg-slate-100 text-indigo-600 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
