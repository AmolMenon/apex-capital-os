import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AntiThesis } from "@/types"
import { AlertOctagon, TrendingDown, Users, DollarSign, Building2, ShieldAlert } from "lucide-react"

export function AntiThesisPanel({ antiThesis }: { antiThesis?: AntiThesis }) {
  if (!antiThesis) return <div>No anti-thesis available.</div>

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-destructive shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2 text-destructive">
            <AlertOctagon className="h-6 w-6" /> The Anti-Thesis
          </CardTitle>
          <CardDescription className="text-base font-medium text-foreground">
            {antiThesis.strongest_case_against}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {(antiThesis.market_risks || []).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" /> Market Risks
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm bg-destructive/5 p-3 rounded-md border border-destructive/10">
                  {(antiThesis.market_risks || []).map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
            
            {(antiThesis.competition_risks || []).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Users className="h-4 w-4" /> Competition Risks
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm bg-destructive/5 p-3 rounded-md border border-destructive/10">
                  {(antiThesis.competition_risks || []).map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}

            {(antiThesis.economics_risks || []).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Unit Economics & Valuation
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm bg-destructive/5 p-3 rounded-md border border-destructive/10">
                  {(antiThesis.economics_risks || []).map((r, i) => <li key={i}>{r}</li>)}
                  {(antiThesis.valuation_risks || []).map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}

            {(antiThesis.fund_fit_risks || []).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Fund Fit Risks
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm bg-destructive/5 p-3 rounded-md border border-destructive/10">
                  {(antiThesis.fund_fit_risks || []).map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}

          </div>

          <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" /> Pass Triggers
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {(antiThesis.pass_triggers || []).map((p, i) => <li key={i} className="font-medium">{p}</li>)}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Unknown Metrics Blocking IC</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {(antiThesis.unknown_private_metrics || []).map((m, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-muted rounded-md border font-medium">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
