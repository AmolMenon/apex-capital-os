import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InvestmentThesis } from "@/types"
import { ShieldCheck, Target, TrendingUp, Users, AlertCircle, FileSearch } from "lucide-react"

export function InvestmentThesisPanel({ thesis }: { thesis?: InvestmentThesis }) {
  if (!thesis) return <div>No thesis available.</div>

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-500 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2 text-blue-900 dark:text-blue-400">
            <Target className="h-6 w-6" /> Investment Thesis
          </CardTitle>
          <CardDescription className="text-base font-medium text-foreground">
            {thesis.one_line_thesis}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Why Now
              </h4>
              <p className="text-sm bg-muted/30 p-3 rounded-md">{thesis.why_now}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Target className="h-4 w-4" /> Why This Company
              </h4>
              <p className="text-sm bg-muted/30 p-3 rounded-md">{thesis.why_this_company}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Users className="h-4 w-4" /> Why This Team
              </h4>
              <p className="text-sm bg-muted/30 p-3 rounded-md">{thesis.why_this_team}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Why Venture Scale
              </h4>
              <p className="text-sm bg-muted/30 p-3 rounded-md">{thesis.why_venture_scale}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-sm mb-3">Evidence Supporting the Thesis</h4>
            <div className="space-y-2">
              {(thesis.evidence_supporting || []).map((ev, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-md gap-2">
                  <span className="text-sm font-medium">{ev.point}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="bg-background text-[10px]">{ev.evidence_label}</Badge>
                    <Badge variant="default" className="bg-green-600 hover:bg-green-600 text-[10px]">{ev.proof_status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Key Assumptions
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {(thesis.assumptions || []).map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <FileSearch className="h-4 w-4" /> Private Diligence Required
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {(thesis.private_diligence_required || []).map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
