import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PartnerPersona } from "@/types"
import { Badge } from "@/components/ui/badge"
import { User, ThumbsUp, ThumbsDown, CircleHelp, FileSearch, CircleArrowRight } from "lucide-react"

export function PartnerPersonaGrid({ personas }: { personas?: PartnerPersona[] }) {
  if (!personas || personas.length === 0) return <div>No partner personas available.</div>

  const getSupportColor = (support: string) => {
    switch (support) {
      case "Support": return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
      case "Lean Support": return "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
      case "Neutral": return "bg-gray-100 text-gray-800 border-gray-200"
      case "Lean Against": return "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800"
      case "Oppose": return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {(personas || []).map((persona, idx) => (
        <Card key={idx} className="shadow-sm overflow-hidden flex flex-col">
          <div className="h-2 w-full bg-muted-foreground/10" />
          <CardHeader className="pb-3 border-b bg-muted/10">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" /> {persona.name}
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-wider font-semibold mt-1">
                  Focus: {persona.focus_area}
                </CardDescription>
              </div>
              <Badge variant="outline" className={getSupportColor(persona.support_level)}>
                {persona.support_level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex-1 space-y-5">
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">View of Deal</h4>
              <p className="text-sm font-medium italic border-l-2 pl-3 border-primary/20 text-foreground/90">
                "{persona.view_of_deal}"
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                <CircleHelp className="h-3 w-3" /> Top Questions
              </h4>
              <ul className="space-y-2">
                {(persona.top_questions || []).map((q, i) => (
                  <li key={i} className="text-sm bg-muted/30 p-2 rounded">
                    <div className="font-semibold">{q.question}</div>
                    <div className="text-xs text-muted-foreground mt-1">Reason: {q.reason}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                <FileSearch className="h-3 w-3" /> Evidence Needed to Close
              </h4>
              <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                {(persona.evidence_needed || []).map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          </CardContent>
          <div className="bg-muted/30 p-4 border-t mt-auto">
            <div className="flex items-center gap-2 text-sm">
              <CircleArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold text-muted-foreground uppercase text-xs">What would change view:</span>
              <span className="text-foreground">{persona.what_would_change_view}</span>
            </div>
            <div className="mt-2 text-xs font-bold">
              Likely Vote Today: <span className="text-primary">{persona.likely_vote}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
