import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Deal } from "@/types"
import Link from "next/link"
import { MessageSquare, AlertTriangle } from "lucide-react"

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

export default async function DecisionBoardPage() {
  const deals = await api.getDeals()
  
  const columns = [
    { id: "New", title: "New", deals: deals.filter(d => d.status === "New") },
    { id: "Screening", title: "Screening", deals: deals.filter(d => d.status === "Screening") },
    { id: "Diligence", title: "Diligence", deals: deals.filter(d => d.status === "Diligence") },
    { id: "Partner Review", title: "Partner Review", deals: deals.filter(d => d.status === "Partner Review") },
    { id: "IC Ready", title: "IC Ready", deals: deals.filter(d => d.status === "IC Ready") },
    { id: "Passed", title: "Passed", deals: deals.filter(d => d.status === "Passed") }
  ]

  const convIntels = await getConversationIntelForDeals(deals)

  return (
    <div className="flex-1 p-8 pt-6 space-y-8 min-h-screen bg-muted/10 overflow-x-auto">
      <div className="flex items-center justify-between min-w-max">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Decision Board</h1>
          <p className="text-muted-foreground mt-1">Kanban view of pipeline velocity</p>
        </div>
      </div>

      <div className="flex gap-6 min-w-max pb-10">
        {columns.map(col => (
          <div key={col.id} className="w-80 flex flex-col bg-muted/30 rounded-lg p-3 shrink-0">
            <div className="flex items-center justify-between mb-4 px-2 border-b pb-2 border-border/50">
              <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">{col.title}</h3>
              <Badge variant="secondary" className="font-mono">{col.deals.length}</Badge>
            </div>
            
            <div className="space-y-3 flex-1">
              {col.deals.map(d => (
                <Card key={d.id} className="hover:border-primary/50 transition-colors shadow-sm group relative">
                  <Link href={`/deals/${d.id}/deal-room`} className="block">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">{d.startup_name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{d.sector}</p>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex flex-col">
                          <div className="text-[10px] uppercase font-semibold text-muted-foreground">Apex Score</div>
                          <div className="font-bold text-sm text-primary">{d.analysis?.overall_score || '--'}</div>
                        </div>
                        {convIntels[d.id] && (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className={`text-[10px] px-1 h-5 ${convIntels[d.id].contradiction_risk_score > 50 ? 'border-red-500/50 text-red-500 bg-red-500/10' : 'border-purple-500/50 text-purple-600 bg-purple-500/10'}`}>
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {convIntels[d.id].overall_conversation_score}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                     <button className="text-[10px] bg-muted/80 hover:bg-primary hover:text-primary-foreground px-2 py-1 rounded border shadow-sm">
                       Advance
                     </button>
                  </div>
                </Card>
              ))}
              {col.deals.length === 0 && (
                <div className="h-24 border-2 border-dashed border-muted flex items-center justify-center rounded-md">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Empty</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
