import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ICSimulation } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, ThumbsUp, ThumbsDown, Scale, FileText, CheckCircle, Copy } from "lucide-react"

export function ICSimulationPanel({ simulation }: { simulation?: ICSimulation }) {
  if (!simulation) return <div>No IC simulation available.</div>

  const copyToClipboard = () => {
    const text = `
IC Simulation Summary:
Committee Decision: ${simulation.committee_decision}
Chair Summary: ${simulation.ic_chair_summary}
Required Diligence: ${(simulation.required_diligence || []).join(", ")}
    `.trim()
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><Users className="h-5 w-5" /> Investment Committee Debate</h2>
          <p className="text-sm text-muted-foreground mt-1">Simulated transcript and partner votes</p>
        </div>
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center gap-2">
          <Copy className="h-4 w-4" /> Copy Summary
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Discussion Transcript
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 space-y-2">
                  <div className="text-xs font-bold text-primary uppercase">Analyst Opening</div>
                  <div className="text-sm text-foreground/90">{simulation.analyst_opening}</div>
                </div>
                
                <div className="p-4 space-y-2 bg-green-500/5">
                  <div className="text-xs font-bold text-green-700 dark:text-green-300 uppercase flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> Bull Case</div>
                  <div className="text-sm text-foreground/90">{simulation.bull_case}</div>
                </div>
                
                <div className="p-4 space-y-2 bg-red-500/5">
                  <div className="text-xs font-bold text-red-700 dark:text-red-300 uppercase flex items-center gap-1"><ThumbsDown className="h-3 w-3" /> Bear Case</div>
                  <div className="text-sm text-foreground/90">{simulation.bear_case}</div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1"><Users className="h-3 w-3" /> Partner Debate</div>
                  <div className="space-y-3">
                    {(simulation.partner_debate || []).map((statement, i) => {
                      const [speaker, ...rest] = statement.split(":")
                      return (
                        <div key={i} className="bg-muted/40 p-3 rounded-md border text-sm">
                          <span className="font-bold">{speaker}:</span> {rest.join(":")}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="p-4 space-y-2 bg-blue-500/5">
                  <div className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase flex items-center gap-1"><Scale className="h-3 w-3" /> Fund Math & Economics</div>
                  <div className="text-sm text-foreground/90">{simulation.fund_math_discussion}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-primary/20 bg-primary/5">
            <CardHeader className="pb-3 border-b border-primary/10">
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <CheckCircle className="h-5 w-5" /> Final Decision
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="text-center py-2">
                <Badge className="text-lg py-1 px-4 bg-primary text-primary-foreground">
                  {simulation.committee_decision}
                </Badge>
              </div>
              
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">IC Chair Summary</div>
                <div className="text-sm font-medium italic">"{simulation.ic_chair_summary}"</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                <FileText className="h-4 w-4" /> Partner Votes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 p-0">
              <div className="divide-y">
                {(simulation.partner_votes || []).map((vote, i) => (
                  <div key={i} className="p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm">{vote.partner_name}</span>
                      <Badge variant="outline" className={vote.vote === "Invest" ? "border-green-500 text-green-700 dark:text-green-300" : vote.vote === "Pass" ? "border-red-500 text-red-700 dark:text-red-300" : "border-amber-500 text-amber-700 dark:text-amber-300"}>
                        {vote.vote}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{vote.rationale}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                <FileText className="h-4 w-4" /> Required Diligence
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <div className="text-xs font-medium text-destructive mb-2">Evidence gaps preventing a decision:</div>
              <div className="text-sm">{simulation.evidence_gaps}</div>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                {(simulation.required_diligence || []).map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
