import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Deal } from "@/types"
import { CheckCircle2, AlertTriangle, Scale, Target } from "lucide-react"
import Link from "next/link"
import { calculateDealHealth } from "@/lib/deal-logic"

async function getConversationIntelForDeals(deals: Deal[]) {
  const intels: Record<number, any> = {}
  for (const deal of deals) {
    try {
      const res = await fetch(`${"http://127.0.0.1:8000"}/conversations/${deal.id}`, { cache: 'no-store' })
      if (res.ok) {
        intels[deal.id] = await res.json()
      }
    } catch (e) {
      // ignore
    }
  }
  return intels
}

export const dynamic = "force-dynamic"

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const resolvedParams = await searchParams;
  const deals = await api.getDeals()
  const mode = resolvedParams.mode || 'demo'
  let activeDeals = []
  if (mode === 'benchmark') {
    activeDeals = deals.filter(d => d.startup_name === 'Sarvam AI' || d.startup_name === 'Zepto' || d.startup_name === 'Mistral AI').slice(0, 3)
  } else {
    activeDeals = deals.filter(d => d.deal_type === 'demo' && d.status !== 'Passed' && d.status !== 'New').slice(0, 3)
  }
  
  const convIntels = await getConversationIntelForDeals(activeDeals)

  return (
    <div className="flex-1 p-8 pt-6 space-y-8 pb-20 bg-muted/10 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Deal Comparison</h1>
          <p className="text-muted-foreground mt-1">Cross-evaluating priority opportunities</p>
        </div>
      </div>

      
      <div className="flex gap-2">
        <Link href="?mode=demo">
          <Badge variant={mode === "demo" ? "default" : "outline"} className="cursor-pointer text-sm py-1 px-3">Demo Comparison</Badge>
        </Link>
        <Link href="?mode=benchmark">
          <Badge variant={mode === "benchmark" ? "default" : "outline"} className="cursor-pointer text-sm py-1 px-3">Public Benchmarks (Sarvam vs Zepto vs Mistral)</Badge>
        </Link>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-md p-6 shadow-sm">
        <h3 className="font-bold text-primary flex items-center gap-2 mb-2"><Scale className="w-5 h-5" /> Partner View</h3>
        <p className="text-sm font-serif leading-relaxed text-foreground/90">
          <strong>NeuralDesk</strong> should be prioritized over <strong>VetPulse AI</strong> because it has stronger power-law potential and better software margins, while VetPulse AI requires more proof of scalable clinic adoption. <strong>CarbonLoop</strong> remains a wildcard pending regulatory validation.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 space-y-4 pt-[72px]">
          <div className="h-20 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">Recommendation</div>
          <div className="h-16 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">Apex Score</div>
          <div className="h-16 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">Conversation Intel</div>
          <div className="h-16 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">Evidence</div>
          <div className="h-16 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">IC Readiness</div>
          <div className="h-16 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">Power Law</div>
          <div className="h-24 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">Main Risk</div>
          <div className="h-16 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">Next Action</div>
        </div>

        {activeDeals.map(d => {
          const health = calculateDealHealth(d)
          const plScore = d.analysis?.power_law_score || 50;
          const apexScore = d.analysis?.overall_score || '--';
          const icReadiness = d.analysis?.ic_one_pager?.apex_score || '--';
          const mainRisk = d.analysis?.risks?.[0]?.description || "Unvalidated GTM";

          return (
            <Card key={d.id} className="col-span-1 relative">
              <CardHeader className="border-b bg-card pb-4">
                <CardTitle className="text-xl font-bold">{d.startup_name}</CardTitle>
                <p className="text-sm text-muted-foreground">{d.sector} • {d.stage}</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-20 p-4 border-b flex items-center justify-center">
                  <Badge variant={health.recommendation === "IC Ready" ? "default" : "secondary"}>{health.recommendation}</Badge>
                </div>
                <div className="h-16 p-4 border-b flex items-center justify-center text-lg font-bold">
                  {apexScore}
                </div>
                <div className="h-16 p-4 border-b flex items-center justify-center text-lg font-bold text-purple-400">
                  {convIntels[d.id]?.overall_conversation_score || '--'}
                </div>
                <div className="h-16 p-4 border-b flex items-center justify-center text-lg font-bold">
                  {d.id === 1 ? 68 : d.id === 2 ? 55 : 45}
                </div>
                <div className="h-16 p-4 border-b flex items-center justify-center text-lg font-bold">
                  {icReadiness}
                </div>
                <div className="h-16 p-4 border-b flex items-center justify-center text-lg font-bold text-primary">
                  {plScore}
                </div>
                <div className="h-24 p-4 border-b flex items-center justify-center text-sm text-center text-muted-foreground">
                  {mainRisk}
                </div>
                <div className="h-16 p-4 border-b flex items-center justify-center text-sm font-semibold text-center">
                  {health.nextActionTitle}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
