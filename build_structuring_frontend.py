import os

base_dir = "frontend/app/deals/[id]"
os.makedirs(f"{base_dir}/deal-structuring", exist_ok=True)
os.makedirs(f"{base_dir}/term-sheet", exist_ok=True)
os.makedirs(f"{base_dir}/negotiation-prep", exist_ok=True)
os.makedirs(f"{base_dir}/closing", exist_ok=True)

files = {
    "deal-structuring/page.tsx": """\"use client\"
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

  if (!report) return <div className=\"p-8\">Loading Deal Structuring HQ...</div>

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <div className=\"flex justify-between items-center\">
        <div>
          <h1 className=\"text-3xl font-bold flex items-center gap-2\"><Calculator className=\"text-sky-600 w-8 h-8\"/> Deal Structuring HQ: {report.company_name}</h1>
          <p className=\"text-muted-foreground mt-2\">Model ownership, structure the round, and prepare for closing.</p>
        </div>
        <Button onClick={() => api.runDealStructuring(id as string).then(()=>alert('Structuring run complete!'))}>Run Deal Structuring</Button>
      </div>

      <div className=\"bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3\">
        <ShieldAlert className=\"text-amber-600 w-6 h-6 mt-1\" />
        <div>
          <h3 className=\"font-bold text-amber-800\">Legal Disclaimer</h3>
          <p className=\"text-sm text-amber-700\">Not legal advice. All term sheet analysis and closing checklists require counsel review before use.</p>
        </div>
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
        <Card>
          <CardHeader className=\"pb-2\"><CardTitle className=\"text-sm text-muted-foreground\">Proposed Round</CardTitle></CardHeader>
          <CardContent><div className=\"text-2xl font-bold\">{report.round_type}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className=\"pb-2\"><CardTitle className=\"text-sm text-muted-foreground\">Proposed Valuation</CardTitle></CardHeader>
          <CardContent><div className=\"text-2xl font-bold\">{report.entry_valuation}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className=\"pb-2\"><CardTitle className=\"text-sm text-muted-foreground\">Target Ownership</CardTitle></CardHeader>
          <CardContent><div className=\"text-2xl font-bold\">{report.target_ownership}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className=\"pb-2\"><CardTitle className=\"text-sm text-muted-foreground\">Cheque Required</CardTitle></CardHeader>
          <CardContent><div className=\"text-2xl font-bold\">{report.recommended_check_size}</div></CardContent>
        </Card>
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
        <Card className=\"col-span-2\">
          <CardHeader><CardTitle>Valuation & Ownership Analysis</CardTitle></CardHeader>
          <CardContent className=\"space-y-4\">
            <div className=\"grid grid-cols-2 gap-4\">
              <div>
                <h4 className=\"font-bold text-sm mb-2 text-muted-foreground\">Ownership Scenarios</h4>
                {report.ownership_scenarios.map((s:any, i:number) => (
                  <div key={i} className=\"flex justify-between text-sm py-1 border-b\">
                    <span>{s.scenario}</span>
                    <span className=\"font-bold\">{s.ownership}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className=\"font-bold text-sm mb-2 text-muted-foreground\">Dilution Scenarios</h4>
                {report.dilution_scenarios.map((s:any, i:number) => (
                  <div key={i} className=\"flex justify-between text-sm py-1 border-b\">
                    <span>{s.round} Dilution</span>
                    <span className=\"font-bold text-rose-600\">{s.dilution}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className=\"bg-slate-50 p-4 rounded-lg mt-4\">
              <h4 className=\"font-bold text-sm mb-1\">Fund Return Compatibility</h4>
              <p className=\"text-sm\">{report.fund_return_analysis.return_potential}. Multiple needed to return fund: {report.fund_return_analysis.multiple_needed_for_fund_return}.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Syndicate Strategy</CardTitle></CardHeader>
          <CardContent className=\"space-y-4\">
            <div className=\"text-sm\">
              <strong>Strategy:</strong> {report.lead_or_participate.recommendation}<br/>
              <span className=\"text-muted-foreground\">{report.lead_or_participate.reason}</span>
            </div>
            <hr/>
            <div className=\"space-y-2\">
              <Link href={`/deals/${id}/term-sheet`}><Button variant=\"outline\" className=\"w-full justify-start\">Open Term Sheet Intelligence</Button></Link>
              <Link href={`/deals/${id}/negotiation-prep`}><Button variant=\"outline\" className=\"w-full justify-start\">Open Negotiation Prep</Button></Link>
              <Link href={`/deals/${id}/closing`}><Button variant=\"outline\" className=\"w-full justify-start\">Open Closing Workflow</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
""",
    "term-sheet/page.tsx": """\"use client\"
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

  if (!analysis) return <div className=\"p-8\">Loading Term Sheet Intelligence...</div>

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <div className=\"flex justify-between items-center\">
        <div>
          <h1 className=\"text-3xl font-bold flex items-center gap-2\"><FileText className=\"text-indigo-600 w-8 h-8\"/> Term Sheet Intelligence</h1>
          <p className=\"text-muted-foreground mt-2\">Extract terms, assess fund/founder impact, and identify legal review items.</p>
        </div>
        <Button onClick={() => api.analyzeTermSheet(id as string, {}).then(()=>alert('Term sheet analyzed!'))}>Analyze Mock Term Sheet</Button>
      </div>

      <div className=\"bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3\">
        <ShieldAlert className=\"text-amber-600 w-6 h-6 mt-1\" />
        <div>
          <h3 className=\"font-bold text-amber-800\">Not Legal Advice</h3>
          <p className=\"text-sm text-amber-700\">Apex provides business intelligence on term sheets. Counsel review is strictly required before signing.</p>
        </div>
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
        <Card className=\"col-span-2\">
          <CardHeader><CardTitle>Extracted Terms & Impact</CardTitle></CardHeader>
          <CardContent className=\"space-y-4\">
            <div className=\"grid grid-cols-2 gap-4\">
              <div className=\"p-3 bg-slate-50 rounded border text-sm\"><strong>Valuation:</strong> {analysis.valuation}</div>
              <div className=\"p-3 bg-slate-50 rounded border text-sm\"><strong>Round Size:</strong> {analysis.round_size}</div>
              <div className=\"p-3 bg-slate-50 rounded border text-sm\"><strong>Security Type:</strong> {analysis.security_type}</div>
              <div className=\"p-3 bg-slate-50 rounded border text-sm\"><strong>Board Rights:</strong> {analysis.board_rights}</div>
              <div className=\"p-3 bg-slate-50 rounded border text-sm\"><strong>Liquidation Pref:</strong> {analysis.liquidation_preference}</div>
              <div className=\"p-3 bg-slate-50 rounded border text-sm\"><strong>Pro-Rata Rights:</strong> {analysis.pro_rata_rights}</div>
            </div>

            <div className=\"mt-6 space-y-4\">
              <div>
                <h4 className=\"font-bold text-sm mb-2\">Fund Impact</h4>
                {Object.entries(analysis.fund_impact).map(([key, val]:any, i) => (
                  <div key={i} className=\"text-sm\"><span className=\"capitalize font-medium\">{key.replace('_', ' ')}:</span> {val}</div>
                ))}
              </div>
              <div>
                <h4 className=\"font-bold text-sm mb-2\">Founder Impact</h4>
                {Object.entries(analysis.founder_impact).map(([key, val]:any, i) => (
                  <div key={i} className=\"text-sm\"><span className=\"capitalize font-medium\">{key.replace('_', ' ')}:</span> {val}</div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className=\"space-y-6\">
          <Card className=\"border-rose-200\">
            <CardHeader className=\"bg-rose-50 pb-4 border-b border-rose-100\">
              <CardTitle className=\"text-rose-800 flex items-center gap-2\"><AlertTriangle className=\"w-5 h-5\"/> Counsel Review Required</CardTitle>
            </CardHeader>
            <CardContent className=\"pt-4 space-y-2\">
              {analysis.legal_review_required.map((item:string, i:number) => (
                <div key={i} className=\"text-sm p-2 bg-rose-50/50 rounded\">{item}</div>
              ))}
              <Button variant=\"outline\" className=\"w-full mt-4 border-rose-200 text-rose-700 hover:bg-rose-50\">Create Counsel Review Tasks</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Missing Terms</CardTitle></CardHeader>
            <CardContent>
               <ul className=\"list-disc list-inside text-sm text-muted-foreground\">
                {analysis.missing_terms.map((item:string, i:number) => <li key={i}>{item}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
""",
    "negotiation-prep/page.tsx": """\"use client\"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { Target, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function NegotiationPrep() {
  const { id } = useParams()
  const [prep, setPrep] = useState<any>(null)

  useEffect(() => {
    if (id) {
      api.getNegotiationPrep(id as string).then(setPrep).catch(console.error)
    }
  }, [id])

  if (!prep) return <div className=\"p-8\">Loading Negotiation Prep...</div>

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <div className=\"flex justify-between items-center\">
        <div>
          <h1 className=\"text-3xl font-bold flex items-center gap-2\"><Target className=\"text-emerald-600 w-8 h-8\"/> Negotiation Prep</h1>
          <p className=\"text-muted-foreground mt-2\">Map out trade-offs and priorities before meeting the founder.</p>
        </div>
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
        <Card>
          <CardHeader><CardTitle className=\"flex items-center gap-2\"><CheckCircle2 className=\"w-5 h-5 text-sky-600\"/> Fund Priorities</CardTitle></CardHeader>
          <CardContent>
            <ul className=\"list-disc list-inside text-sm space-y-1\">
              {prep.fund_priorities.map((item:string, i:number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className=\"flex items-center gap-2\"><Target className=\"w-5 h-5 text-indigo-600\"/> Founder Priorities</CardTitle></CardHeader>
          <CardContent>
            <ul className=\"list-disc list-inside text-sm space-y-1\">
              {prep.founder_priorities.map((item:string, i:number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
        <Card className=\"border-emerald-200 bg-emerald-50/30\">
          <CardHeader><CardTitle className=\"text-emerald-800\">Terms to Push</CardTitle></CardHeader>
          <CardContent>
            <ul className=\"list-disc list-inside text-sm text-emerald-900\">
              {prep.push.map((item:string, i:number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card className=\"border-sky-200 bg-sky-50/30\">
          <CardHeader><CardTitle className=\"text-sky-800\">Terms to Flex</CardTitle></CardHeader>
          <CardContent>
            <ul className=\"list-disc list-inside text-sm text-sky-900\">
              {prep.flex.map((item:string, i:number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card className=\"border-rose-200 bg-rose-50/30\">
          <CardHeader><CardTitle className=\"text-rose-800 flex items-center gap-2\"><ShieldAlert className=\"w-4 h-4\"/> Non-Negotiables</CardTitle></CardHeader>
          <CardContent>
            <ul className=\"list-disc list-inside text-sm text-rose-900\">
              {prep.non_negotiables.map((item:string, i:number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Button className=\"w-full\" onClick={() => alert('Brief copied to clipboard.')}>Copy Negotiation Brief</Button>
    </div>
  )
}
""",
    "closing/page.tsx": """\"use client\"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { CheckSquare, Briefcase, FileText, Send } from 'lucide-react'

export default function ClosingWorkflow() {
  const { id } = useParams()
  const [checklist, setChecklist] = useState<any[]>([])
  const [diligence, setDiligence] = useState<any[]>([])

  useEffect(() => {
    if (id) {
      api.getClosingChecklist(id as string).then(setChecklist).catch(console.error)
      api.getLegalDiligence(id as string).then(setDiligence).catch(console.error)
    }
  }, [id])

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <div className=\"flex justify-between items-center\">
        <div>
          <h1 className=\"text-3xl font-bold flex items-center gap-2\"><Briefcase className=\"text-slate-800 w-8 h-8\"/> Closing Workflow</h1>
          <p className=\"text-muted-foreground mt-2\">Track execution, legal diligence, and portfolio onboarding.</p>
        </div>
        <Button onClick={() => api.runPostCloseHandoff(id as string).then(()=>alert('Post-close handoff started! Created Portfolio Company.'))}>
          <Send className=\"w-4 h-4 mr-2\"/> Run Post-Close Handoff
        </Button>
      </div>

      <div className=\"bg-slate-100 p-4 rounded text-sm text-slate-700 italic border border-slate-200\">
        \"Legal diligence tracking only. Counsel review required.\"
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
        <Card>
          <CardHeader><CardTitle className=\"flex items-center gap-2\"><CheckSquare className=\"w-5 h-5 text-indigo-600\"/> Closing Checklist</CardTitle></CardHeader>
          <CardContent className=\"p-0\">
            <table className=\"w-full text-sm text-left\">
              <thead className=\"bg-slate-50 border-y\">
                <tr>
                  <th className=\"p-3\">Item</th>
                  <th className=\"p-3\">Owner</th>
                  <th className=\"p-3\">Status</th>
                </tr>
              </thead>
              <tbody>
                {checklist.map((c, i) => (
                  <tr key={i} className=\"border-b\">
                    <td className=\"p-3\">
                      <div className=\"font-bold\">{c.item}</div>
                      <div className=\"text-xs text-muted-foreground\">Requires: {c.evidence_required}</div>
                    </td>
                    <td className=\"p-3\">{c.owner}</td>
                    <td className=\"p-3\">
                      <span className={`px-2 py-1 rounded text-xs ${c.status==='Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className=\"flex items-center gap-2\"><FileText className=\"w-5 h-5 text-sky-600\"/> Legal Diligence Tracker</CardTitle></CardHeader>
          <CardContent className=\"p-0\">
            <table className=\"w-full text-sm text-left\">
              <thead className=\"bg-slate-50 border-y\">
                <tr>
                  <th className=\"p-3\">Item</th>
                  <th className=\"p-3\">Status</th>
                  <th className=\"p-3\">Notes</th>
                </tr>
              </thead>
              <tbody>
                {diligence.map((d, i) => (
                  <tr key={i} className=\"border-b\">
                    <td className=\"p-3 font-medium\">{d.item}</td>
                    <td className=\"p-3\">
                      <span className={`px-2 py-1 rounded text-xs ${d.status==='Received' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className=\"p-3 text-xs text-muted-foreground\">{d.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
"""
}

for name, content in files.items():
    with open(os.path.join(base_dir, name), "w") as f:
        f.write(content)

print("Frontend pages scaffolded successfully.")
