import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { api } from "@/lib/api"
import { Activity, ShieldAlert, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"

export const dynamic = "force-dynamic"

export default async function ScorecardPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let deal = null
  try {
    deal = await api.getDeal(params.id)
  } catch (e) {
    console.error("Deal fetch error", e)
  }
  
  if (!deal) {
    notFound()
  }

  const analysis = deal.analysis || {
    overall_score: "N/A",
    scorecard: {},
    archetype: null,
    main_reason: "Pending analysis",
    change_recommendation_condition: "Pending analysis",
    risks: []
  }
  
  return (
    <div className="space-y-6 bg-gradient-to-br from-background to-emerald-500/5 dark:to-emerald-900/10 min-h-screen p-6 rounded-xl border border-emerald-500/10">
      <PageHelpBanner 
        title="Scorecard & Red Flags" 
        explanation="This deterministic scorecard grades the startup across 10 dimensions based on our fund thesis."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Scorecard */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-xl bg-background/80 backdrop-blur-md border-primary/20">
            <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-foreground">Apex Scorecard</CardTitle>
                  <CardDescription className="text-base mt-1">Multi-dimensional evaluation based on fund thesis parameters.</CardDescription>
                </div>
                <div className="text-right bg-background p-3 rounded-lg shadow-sm border border-border">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Overall Score</div>
                  <div className="text-3xl font-black text-primary leading-none">{analysis.overall_score}<span className="text-lg text-muted-foreground font-medium">/100</span></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {analysis.scorecard && Object.entries(analysis.scorecard).map(([key, value]: [string, any]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold text-foreground">
                      <span className="capitalize">{key.replace(/_score/g, '').replace(/_/g, ' ')}</span>
                      <span className={value >= 8 ? "text-emerald-600" : value < 5 ? "text-destructive" : "text-muted-foreground"}>{value}/10</span>
                    </div>
                    <Progress value={value * 10} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Archetype */}
          <Card className="shadow-lg bg-background/80 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Archetype: {analysis.archetype?.name || "Standard Venture"}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6 bg-muted/20 p-6 rounded-b-lg border-t">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">What Matters Most</h4>
                <p className="text-sm text-foreground">{analysis.archetype?.what_matters_most || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Relevant Comparables</h4>
                <p className="text-sm text-foreground font-medium">{analysis.archetype?.relevant_comparables?.join(', ') || "N/A"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Verdict & Risks */}
        <div className="space-y-6">
          <Card className="bg-background/80 backdrop-blur-md shadow-lg border-l-4 border-l-primary border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">Analyst Verdict</h3>
                <p className="text-sm font-semibold text-foreground">{analysis.main_reason}</p>
              </div>
              <div className="pt-4 border-t border-border">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">Change Condition</h3>
                <p className="text-sm text-muted-foreground">{analysis.change_recommendation_condition}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 bg-destructive/5 backdrop-blur-md shadow-lg">
            <CardHeader className="pb-2 border-b border-destructive/10">
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-5 w-5" />
                Red Flags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.risks?.map((risk: any, i: number) => (
                <div key={i} className="text-sm bg-background p-3 rounded border border-destructive/10 shadow-sm">
                  <div className="flex flex-col gap-1 text-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant={risk.severity === 'Critical' ? 'destructive' : 'secondary'} className="text-[10px] px-1.5 py-0 uppercase">
                        {risk.severity}
                      </Badge>
                      <span className="font-bold">{risk.category || "Risk"}</span>
                    </div>
                    <p className="font-semibold text-xs mt-1">{risk.risk || risk.description}</p>
                    <span className="text-xs text-muted-foreground mt-1 block border-t pt-1 border-destructive/10">{risk.mitigation || risk.why_it_matters}</span>
                  </div>
                </div>
              ))}
              {(!analysis.risks || analysis.risks.length === 0) && (
                <p className="text-sm text-muted-foreground">No critical risks identified.</p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
