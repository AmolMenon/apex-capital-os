import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, ThumbsUp, ThumbsDown, Target, Copy } from "lucide-react"

export default async function CustomerReferenceScriptPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const deal = await api.getDeal(params.id)
  
  let scriptData: any = null
  try {
    const res = await fetch(`${"http://127.0.0.1:8000"}/deals/${params.id}/customer-reference-script`)
    if (res.ok) scriptData = await res.json()
  } catch (e) {
    console.error(e)
  }

  if (!scriptData) {
    return (
      <div className="flex-1 p-8 pt-6 space-y-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Generating Script...</h1>
          <p className="text-sm text-muted-foreground mt-2 animate-pulse">Designing targeted interview questions based on diligence gaps</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 pt-6 space-y-8 min-h-screen bg-muted/10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Customer Reference Script</h1>
            <Badge variant="secondary" className="font-mono">{deal.startup_name}</Badge>
          </div>
          <p className="text-muted-foreground mt-1">Targeted interview guide to validate product-market fit</p>
        </div>
        <Button variant="outline">
          <Copy className="w-4 h-4 mr-2" />
          Copy Script
        </Button>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-md p-5 shadow-sm flex items-start gap-3">
        <Target className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h3 className="font-semibold text-sm text-primary uppercase tracking-wider mb-1">Call Objective</h3>
          <p className="text-sm text-foreground/90 font-medium">
            {scriptData.objective}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Phone className="w-5 h-5 text-muted-foreground" />
                Interview Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {scriptData.questions.map((q: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground">{q.category}</Badge>
                  <p className="font-medium text-base text-foreground leading-relaxed">{q.q}</p>
                  <div className="h-20 bg-muted/20 border border-dashed rounded-md w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-emerald-200 shadow-sm">
            <CardHeader className="bg-emerald-50/50 pb-3 border-b border-emerald-100">
              <CardTitle className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" /> Positive Signals
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-emerald-50/20">
              <ul className="space-y-3">
                {scriptData.positive_signals.map((s: string, idx: number) => (
                  <li key={idx} className="flex gap-2 text-sm text-emerald-950 font-medium">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 shadow-sm">
            <CardHeader className="bg-destructive/5 pb-3 border-b border-destructive/10">
              <CardTitle className="text-sm font-bold text-destructive flex items-center gap-2">
                <ThumbsDown className="w-4 h-4" /> Red Flags
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-destructive/[0.02]">
              <ul className="space-y-3">
                {scriptData.red_flags.map((s: string, idx: number) => (
                  <li key={idx} className="flex gap-2 text-sm text-destructive font-medium">
                    <span className="text-destructive mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
