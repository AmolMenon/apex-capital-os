import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ConvictionScore } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, Target, TrendingUp, AlertTriangle, Scale, ThumbsUp, ThumbsDown } from "lucide-react"

export function ConvictionDashboard({ score }: { score?: ConvictionScore }) {
  if (!score) return <div>No conviction score available.</div>

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Conviction is not the same as excitement. It reflects how much of the thesis is supported by evidence.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-1 shadow-sm flex flex-col justify-center items-center p-6 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 border-blue-500/20">
          <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Overall Conviction</div>
          <div className="text-6xl font-black text-blue-700 dark:text-blue-400 mb-4">{score.overall_score}</div>
          <Badge variant="outline" className="text-sm font-bold bg-background text-foreground shadow-sm">
            {score.conviction_level}
          </Badge>
        </Card>

        <Card className="col-span-1 md:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase text-muted-foreground">Conviction Drivers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span>Market</span><span>{score.market_conviction}%</span></div>
                <Progress value={score.market_conviction} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span>Team</span><span>{score.team_conviction}%</span></div>
                <Progress value={score.team_conviction} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span>Product</span><span>{score.product_conviction}%</span></div>
                <Progress value={score.product_conviction} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span>Traction</span><span>{score.traction_conviction}%</span></div>
                <Progress value={score.traction_conviction} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 text-blue-600 dark:text-blue-400"><span>Evidence completeness</span><span>{score.evidence_conviction}%</span></div>
                <Progress value={score.evidence_conviction} className="h-1.5 bg-blue-100 dark:bg-blue-900/40 [&>div]:bg-blue-600" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 text-amber-600 dark:text-amber-400"><span>Valuation support</span><span>{score.valuation_conviction}%</span></div>
                <Progress value={score.valuation_conviction} className="h-1.5 bg-amber-100 dark:bg-amber-900/40 [&>div]:bg-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400" /> Key Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {(score.drivers || []).map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><ThumbsDown className="h-4 w-4 text-destructive" /> Key Detractors</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {(score.detractors || []).map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Conviction Delta</CardTitle>
          <CardDescription>What recently changed our view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(score.deltas || []).map((delta, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-md">
                {delta.impact === "Increased" ? (
                  <div className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 p-1.5 rounded-full mt-0.5"><TrendingUp className="h-4 w-4" /></div>
                ) : (
                  <div className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 p-1.5 rounded-full mt-0.5"><AlertTriangle className="h-4 w-4" /></div>
                )}
                <div>
                  <div className="font-semibold text-sm">{delta.driver}</div>
                  <div className="text-xs text-muted-foreground">{delta.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
