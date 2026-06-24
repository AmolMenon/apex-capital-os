import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Scale, ShieldAlert, Sparkles, MessageSquare } from "lucide-react"

export default async function PartnerReviewPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const deal = await api.getDeal(params.id)
  
  let reviewData: any = null
  let convIntel: any = null
  try {
    const [res, convRes] = await Promise.all([
      fetch(`${"http://127.0.0.1:8000"}/deals/${params.id}/partner-review`),
      fetch(`${"http://127.0.0.1:8000"}/conversations/${params.id}`)
    ])
    if (res.ok) reviewData = await res.json()
    if (convRes.ok) convIntel = await convRes.json()
  } catch (e) {
    console.error(e)
  }

  if (!reviewData) {
    return (
      <div className="flex-1 p-8 pt-6 space-y-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Synthesizing Review...</h1>
          <p className="text-sm text-muted-foreground mt-2 animate-pulse">Generating partner-level insights for the investment committee</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 pt-6 space-y-8 min-h-screen bg-muted/10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Partner Review</h1>
            <Badge variant="secondary" className="font-mono">{deal.startup_name}</Badge>
          </div>
          <p className="text-muted-foreground mt-1">Synthesized perspective for the investment committee</p>
        </div>
        <Button>
          <MessageSquare className="w-4 h-4 mr-2" />
          Send to Deal Team
        </Button>
      </div>

      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="bg-primary/5 pb-4 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Partner Synthesis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-lg leading-relaxed text-foreground/90 font-serif">
            {reviewData.summary}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="border-emerald-200 shadow-sm">
          <CardHeader className="bg-emerald-50/50 pb-4 border-b border-emerald-100">
            <CardTitle className="text-lg font-bold text-emerald-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Bull Case
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-base leading-relaxed text-emerald-950 font-medium">
              {reviewData.bull_case}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 shadow-sm">
          <CardHeader className="bg-amber-50/50 pb-4 border-b border-amber-100">
            <CardTitle className="text-lg font-bold text-amber-800 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Bear Case
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-base leading-relaxed text-amber-950 font-medium">
              {reviewData.bear_case}
            </p>
          </CardContent>
        </Card>
      </div>

      {convIntel && (
        <Card className="border-purple-200 shadow-sm mt-6">
          <CardHeader className="bg-purple-50/50 pb-4 border-b border-purple-100">
            <CardTitle className="text-lg font-bold text-purple-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Conversation Intelligence Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex gap-8 border-b pb-4 mb-4 border-purple-100">
              <div>
                <p className="text-xs uppercase text-purple-600/70 font-semibold mb-1">Conviction Score</p>
                <p className="text-xl font-bold text-purple-900">{convIntel.overall_conversation_score}/100</p>
              </div>
              <div>
                <p className="text-xs uppercase text-purple-600/70 font-semibold mb-1">Recommendation Shift</p>
                <p className="text-xl font-bold text-purple-900">{convIntel.decision_impact?.recommendation_adjustment}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-purple-600/70 font-semibold mb-1">Contradiction Risk</p>
                <p className={`text-xl font-bold ${convIntel.contradiction_risk_score > 50 ? 'text-red-600' : 'text-purple-900'}`}>{convIntel.contradiction_risk_score}/100</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-800 mb-1">Final Interview Synthesis</p>
              <p className="text-sm text-purple-900/90 leading-relaxed">{convIntel.decision_impact?.final_explanation}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-muted-foreground" />
            Unanswered Questions for Founders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-4">
            {reviewData.partner_questions.map((q: string, idx: number) => (
              <li key={idx} className="flex gap-3">
                <span className="text-primary font-mono text-sm mt-0.5">Q{idx + 1}</span>
                <span className="text-foreground">{q}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
    </div>
  )
}
