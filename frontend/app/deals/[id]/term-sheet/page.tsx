"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { FileText, ShieldAlert, AlertTriangle } from 'lucide-react'

export default function TermSheetIntelligence() {
  const { id } = useParams()
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    if (id) {
      api.getTermSheetAnalysis(id as string).then(setAnalysis).catch(console.error)
    }
  }, [id])

  if (!analysis) return <div className="p-8">Loading Term Sheet Intelligence...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><FileText className="text-indigo-600 w-8 h-8"/> Term Sheet Intelligence</h1>
          <p className="text-muted-foreground mt-2">Extract terms, assess fund/founder impact, and identify legal review items.</p>
        </div>
        <Button onClick={() => api.analyzeTermSheet(id as string, {}).then(()=>alert('Term sheet analyzed!'))}>Analyze Mock Term Sheet</Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
        <ShieldAlert className="text-amber-600 w-6 h-6 mt-1" />
        <div>
          <h3 className="font-bold text-amber-800">Not Legal Advice</h3>
          <p className="text-sm text-amber-700">Apex provides business intelligence on term sheets. Counsel review is strictly required before signing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader><CardTitle>Extracted Terms & Impact</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded border text-sm"><strong>Valuation:</strong> {analysis.valuation}</div>
              <div className="p-3 bg-slate-50 rounded border text-sm"><strong>Round Size:</strong> {analysis.round_size}</div>
              <div className="p-3 bg-slate-50 rounded border text-sm"><strong>Security Type:</strong> {analysis.security_type}</div>
              <div className="p-3 bg-slate-50 rounded border text-sm"><strong>Board Rights:</strong> {analysis.board_rights}</div>
              <div className="p-3 bg-slate-50 rounded border text-sm"><strong>Liquidation Pref:</strong> {analysis.liquidation_preference}</div>
              <div className="p-3 bg-slate-50 rounded border text-sm"><strong>Pro-Rata Rights:</strong> {analysis.pro_rata_rights}</div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-bold text-sm mb-2">Fund Impact</h4>
                {Object.entries(analysis.fund_impact).map(([key, val]:any, i) => (
                  <div key={i} className="text-sm"><span className="capitalize font-medium">{key.replace('_', ' ')}:</span> {val}</div>
                ))}
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2">Founder Impact</h4>
                {Object.entries(analysis.founder_impact).map(([key, val]:any, i) => (
                  <div key={i} className="text-sm"><span className="capitalize font-medium">{key.replace('_', ' ')}:</span> {val}</div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-rose-200">
            <CardHeader className="bg-rose-50 pb-4 border-b border-rose-100">
              <CardTitle className="text-rose-800 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Counsel Review Required</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {analysis.legal_review_required.map((item:string, i:number) => (
                <div key={i} className="text-sm p-2 bg-rose-50/50 rounded">{item}</div>
              ))}
              <Button variant="outline" className="w-full mt-4 border-rose-200 text-rose-700 hover:bg-rose-50">Create Counsel Review Tasks</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Missing Terms</CardTitle></CardHeader>
            <CardContent>
               <ul className="list-disc list-inside text-sm text-muted-foreground">
                {analysis.missing_terms.map((item:string, i:number) => <li key={i}>{item}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
