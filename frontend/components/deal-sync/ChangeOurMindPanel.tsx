import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChangeOurMindCondition } from "@/types"
import { Badge } from "@/components/ui/badge"
import { CircleArrowUp, CircleArrowDown, AlertCircle } from "lucide-react"

export function ChangeOurMindPanel({ conditions }: { conditions?: ChangeOurMindCondition[] }) {
  if (!conditions || conditions.length === 0) return <div>No conditions available.</div>

  const upgrades = conditions.filter(c => c.condition_type === "Upgrade")
  const downgrades = conditions.filter(c => c.condition_type === "Downgrade")

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        We reserve the right to change our view if new evidence emerges. Here are the specific conditions that would alter the IC recommendation.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-300">
              <CircleArrowUp className="h-5 w-5" /> Upgrade to Invest if...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upgrades.length === 0 ? (
              <div className="text-sm text-muted-foreground italic p-4 bg-muted/30 rounded">No upgrade conditions defined.</div>
            ) : (
              upgrades.map((c, i) => (
                <div key={i} className="space-y-2 bg-green-500/5 border border-green-500/10 p-3 rounded-md">
                  <div className="font-semibold text-sm">{c.condition}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="font-semibold text-foreground/80">Evidence needed: </span>
                    {c.evidence_needed}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-green-500/10">
                    <Badge variant="outline" className="text-[10px] bg-background">Status: {c.current_status}</Badge>
                    <Badge variant="outline" className="text-[10px] bg-background">Owner: {c.owner}</Badge>
                    <Badge variant="outline" className={c.priority === "High" ? "text-[10px] bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200" : "text-[10px] bg-background"}>{c.priority} Priority</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <CircleArrowDown className="h-5 w-5" /> Downgrade or Pass if...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {downgrades.length === 0 ? (
              <div className="text-sm text-muted-foreground italic p-4 bg-muted/30 rounded">No downgrade conditions defined.</div>
            ) : (
              downgrades.map((c, i) => (
                <div key={i} className="space-y-2 bg-red-500/5 border border-red-500/10 p-3 rounded-md">
                  <div className="font-semibold text-sm">{c.condition}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="font-semibold text-foreground/80">Trigger: </span>
                    {c.evidence_needed}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-red-500/10">
                    <Badge variant="outline" className="text-[10px] bg-background">Status: {c.current_status}</Badge>
                    <Badge variant="outline" className="text-[10px] bg-background">Impact: {c.decision_impact}</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
