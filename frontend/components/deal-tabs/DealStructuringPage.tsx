"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Calculator, Target, ShieldAlert, LineChart } from 'lucide-react'

export default function DealStructuringHQ() {
  const { id } = useParams()
  const [report, setReport] = useState<any>(null)

  useEffect(() => {
    if (id) {
      api.getDealStructuringReport(id as string).then(setReport).catch(console.error)
    }
  }, [id])

  if (!report) return <div className="p-8">Loading Deal Structuring HQ...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Calculator className="text-sky-600 w-8 h-8"/> Deal Structuring HQ: {report.company_name}</h1>
          <p className="text-muted-foreground mt-2">Model ownership, structure the round, and prepare for closing.</p>
        </div>
        <Button onClick={() => api.runDealStructuring(id as string).then(()=>alert('Structuring run complete!'))}>Run Deal Structuring</Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
        <ShieldAlert className="text-amber-600 w-6 h-6 mt-1" />
        <div>
          <h3 className="font-bold text-amber-800">Legal Disclaimer</h3>
          <p className="text-sm text-amber-700">Not legal advice. All term sheet analysis and closing checklists require counsel review before use.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Proposed Round</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{report.round_type}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Proposed Valuation</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{report.entry_valuation}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Target Ownership</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{report.target_ownership}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Cheque Required</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{report.recommended_check_size}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader><CardTitle>Valuation & Ownership Analysis</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-sm mb-2 text-muted-foreground">Ownership Scenarios</h4>
                {report.ownership_scenarios.map((s:any, i:number) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b">
                    <span>{s.scenario}</span>
                    <span className="font-bold">{s.ownership}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2 text-muted-foreground">Dilution Scenarios</h4>
                {report.dilution_scenarios.map((s:any, i:number) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b">
                    <span>{s.round} Dilution</span>
                    <span className="font-bold text-rose-600">{s.dilution}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg mt-4">
              <h4 className="font-bold text-sm mb-1">Fund Return Compatibility</h4>
              <p className="text-sm">{report.fund_return_analysis.return_potential}. Multiple needed to return fund: {report.fund_return_analysis.multiple_needed_for_fund_return}.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Syndicate Strategy</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <strong>Strategy:</strong> {report.lead_or_participate.recommendation}<br/>
              <span className="text-muted-foreground">{report.lead_or_participate.reason}</span>
            </div>
            <hr/>
            <div className="space-y-2">
              <Link href={`/deals/${id}/term-sheet`}><Button variant="outline" className="w-full justify-start">Open Term Sheet Intelligence</Button></Link>
              <Link href={`/deals/${id}/negotiation-prep`}><Button variant="outline" className="w-full justify-start">Open Negotiation Prep</Button></Link>
              <Link href={`/deals/${id}/closing`}><Button variant="outline" className="w-full justify-start">Open Closing Workflow</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
