import os

base_dir = "frontend/app/decision-lab"
os.makedirs(f"{base_dir}/cases/[case_id]", exist_ok=True)
os.makedirs(f"{base_dir}/counterfactuals", exist_ok=True)
os.makedirs(f"{base_dir}/playbook-backtests", exist_ok=True)
os.makedirs(f"{base_dir}/missed-deals", exist_ok=True)
os.makedirs(f"{base_dir}/false-positives", exist_ok=True)

files = {
    "page.tsx": """\"use client\"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FlaskConical } from 'lucide-react'
import Link from 'next/link'

export default function DecisionLabHQ() {
  const [status, setStatus] = useState<any>(null)
  const [cases, setCases] = useState<any[]>([])

  useEffect(() => {
    api.getDecisionLabStatus().then(setStatus).catch(console.error)
    api.getHistoricalCases().then(setCases).catch(console.error)
  }, [])

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <div className=\"flex justify-between items-center\">
        <div>
          <h1 className=\"text-3xl font-bold flex items-center gap-2\"><FlaskConical className=\"text-rose-500 w-8 h-8\"/> Decision Lab HQ</h1>
          <p className=\"text-muted-foreground mt-2\">Counterfactual Investment Simulator and Decision Quality Engine.</p>
        </div>
      </div>

      <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">
        <Link href=\"/decision-lab/playbook-backtests\"><Button variant=\"outline\" className=\"w-full\">Playbook Backtests</Button></Link>
        <Link href=\"/decision-lab/counterfactuals\"><Button variant=\"outline\" className=\"w-full\">Counterfactuals</Button></Link>
        <Link href=\"/decision-lab/missed-deals\"><Button variant=\"outline\" className=\"w-full\">Missed Deals</Button></Link>
        <Link href=\"/decision-lab/false-positives\"><Button variant=\"outline\" className=\"w-full\">False Positives</Button></Link>
      </div>

      <h2 className=\"text-2xl font-bold mt-8\">Historical Case Library</h2>
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
        {cases.map((c, idx) => (
          <Card key={idx} className=\"flex flex-col\">
            <CardHeader>
              <CardTitle className=\"text-lg\">{c.company_name}</CardTitle>
              <div className=\"text-xs text-muted-foreground\">{c.case_type} | {c.stage_at_decision}</div>
            </CardHeader>
            <CardContent className=\"flex-1\">
              <p className=\"text-sm mb-2\"><strong>Outcome:</strong> {c.actual_later_outcome}</p>
              <Link href={`/decision-lab/cases/${c.case_id}`}>
                <Button className=\"w-full\">Open Case</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
""",
    "cases/[case_id]/page.tsx": """\"use client\"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function CaseDetail() {
  const { case_id } = useParams()
  const [data, setData] = useState<any>(null)
  const [backtest, setBacktest] = useState<any>(null)
  const [integrity, setIntegrity] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (case_id) {
      api.getHistoricalCase(case_id as string).then(setData).catch(console.error)
      api.getCutoffIntegrity(case_id as string).then(setIntegrity).catch(console.error)
    }
  }, [case_id])

  const runBacktest = async () => {
    setLoading(true)
    try {
      const res = await api.runBacktest({ case_id, playbook_id: \"Apex Default Early-Stage\" })
      setBacktest(res)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  if (!data) return <div className=\"p-8\">Loading...</div>

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <div className=\"flex items-center gap-2 mb-2\">
        <span className=\"px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded uppercase tracking-wider\">{data.case_type}</span>
      </div>
      <h1 className=\"text-3xl font-bold\">Case Study: {data.company_name}</h1>
      <p className=\"text-muted-foreground\">Decision Date: {data.decision_date} | Cutoff: {data.information_cutoff}</p>
      
      {integrity && integrity.safe_to_use_in_backtest ? (
        <div className=\"flex items-center gap-2 text-emerald-600 bg-emerald-50 p-2 rounded\"><CheckCircle2 className=\"w-4 h-4\"/> Cutoff Integrity Verified (No Future Leakage)</div>
      ) : (
        <div className=\"flex items-center gap-2 text-rose-600 bg-rose-50 p-2 rounded\"><AlertTriangle className=\"w-4 h-4\"/> Cutoff Integrity Warning</div>
      )}

      <div className=\"grid grid-cols-2 gap-6\">
        <Card className=\"border-slate-300\">
          <CardHeader className=\"bg-slate-50\"><CardTitle>At-the-Time Evidence</CardTitle></CardHeader>
          <CardContent className=\"pt-4 space-y-2\">
            {data.available_evidence.map((e:string, i:number) => <div key={i} className=\"text-sm\">• {e}</div>)}
          </CardContent>
        </Card>
        <Card className=\"border-rose-200 bg-rose-50/30\">
          <CardHeader><CardTitle className=\"text-rose-700\">Excluded Future Evidence (Hindsight)</CardTitle></CardHeader>
          <CardContent className=\"pt-4 space-y-2\">
            {data.excluded_future_evidence.map((e:string, i:number) => <div key={i} className=\"text-sm text-rose-600\">• {e}</div>)}
          </CardContent>
        </Card>
      </div>

      <div className=\"py-4\">
        <Button onClick={runBacktest} disabled={loading} size=\"lg\" className=\"w-full\">Run Simulated Backtest</Button>
      </div>

      {backtest && (
        <Card className=\"border-indigo-300 bg-indigo-50/50\">
          <CardHeader><CardTitle>Backtest Results</CardTitle></CardHeader>
          <CardContent className=\"space-y-4\">
            <div className=\"grid grid-cols-2 gap-4\">
              <div>
                <p className=\"text-sm font-bold\">Recommendation at Time</p>
                <p className=\"text-lg\">{backtest.recommendation_at_time}</p>
              </div>
              <div>
                <p className=\"text-sm font-bold\">Later Outcome</p>
                <p className=\"text-lg\">{backtest.later_outcome_comparison}</p>
              </div>
              <div>
                <p className=\"text-sm font-bold\">Decision Quality</p>
                <p className=\"text-lg text-indigo-700 font-bold\">{backtest.decision_quality}</p>
              </div>
            </div>
            {backtest.learning && backtest.learning.length > 0 && (
              <div className=\"mt-4\">
                <p className=\"text-sm font-bold\">Suggested Learning</p>
                <p className=\"text-sm italic\">\"{backtest.learning[0]}\"</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
""",
    "counterfactuals/page.tsx": """\"use client\"
import { useState } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CounterfactualSimulator() {
  const [result, setResult] = useState<any>(null)
  
  const runSim = async () => {
    const res = await api.runCounterfactual({ case_id: "vectordesk_ai", changed_assumption: "Lowered traction gate" })
    setResult(res)
  }

  return (
    <div className=\"p-8 max-w-4xl mx-auto space-y-6\">
      <h1 className=\"text-3xl font-bold\">Counterfactual Simulator</h1>
      <p className=\"text-muted-foreground\">Test \"what if\" changes on historical cases.</p>
      
      <Card>
        <CardContent className=\"p-6 space-y-4\">
          <div className=\"flex justify-between items-center\">
            <div>
              <p className=\"font-bold\">Case: VectorDesk AI</p>
              <p className=\"text-sm text-muted-foreground\">Original Recommendation: Watchlist / Pass</p>
            </div>
            <Button onClick={runSim}>Simulate \"Lowered Traction Gate\"</Button>
          </div>
          
          {result && (
            <div className=\"mt-6 p-4 bg-indigo-50 rounded border border-indigo-100\">
              <h3 className=\"font-bold text-indigo-800\">Counterfactual Result</h3>
              <p className=\"text-lg font-bold mt-2\">New Recommendation: {result.counterfactual_recommendation}</p>
              <p className=\"text-sm mt-2\"><strong>Risk Delta:</strong> {result.risk_delta}</p>
              <p className=\"text-sm mt-2\"><strong>Learning:</strong> {result.learning}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
""",
    "playbook-backtests/page.tsx": """\"use client\"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function PlaybookBacktests() {
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    api.getPlaybookBacktests().then(setResults).catch(console.error)
  }, [])

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <h1 className=\"text-3xl font-bold\">Playbook Backtests</h1>
      <p className=\"text-muted-foreground\">Comparing decision quality across fund methodologies on the same dataset.</p>
      
      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
        {results.map((r, idx) => (
          <Card key={idx}>
            <CardHeader><CardTitle>{r.playbook_id}</CardTitle></CardHeader>
            <CardContent className=\"space-y-2 text-sm\">
              <div><strong>Decision Quality:</strong> {r.average_decision_quality}</div>
              <div><strong>Simulated Hits:</strong> {r.simulated_hits}</div>
              <div><strong>Simulated Misses:</strong> {r.simulated_misses}</div>
              <div><strong>False Positives:</strong> {r.false_positives}</div>
              <div className=\"pt-2 border-t mt-2\"><strong>Weakness:</strong> {r.weaknesses.join(\", \")}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
""",
    "missed-deals/page.tsx": """\"use client\"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function MissedDeals() {
  const [deals, setDeals] = useState<any[]>([])

  useEffect(() => {
    api.getMissedDeals().then(setDeals).catch(console.error)
  }, [])

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <h1 className=\"text-3xl font-bold\">Missed Deal Analysis</h1>
      <p className=\"text-muted-foreground\">Attributing root causes to missed winners.</p>
      
      <div className=\"space-y-4\">
        {deals.map((d, idx) => (
          <Card key={idx}>
            <CardHeader><CardTitle>{d.company_name}</CardTitle></CardHeader>
            <CardContent className=\"space-y-2 text-sm\">
              <div><strong>Recommendation at time:</strong> {d.recommendation_at_time}</div>
              <div><strong>Later Outcome:</strong> {d.later_outcome}</div>
              <div><strong>Missed Signal:</strong> {d.missed_signal}</div>
              <div><strong>Avoidable:</strong> {d.avoidable ? \"Yes\" : \"No\"}</div>
              <div className=\"mt-4 p-2 bg-muted rounded\">
                <strong>Suggested Playbook Change:</strong> {d.playbook_change_suggested}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
""",
    "false-positives/page.tsx": """\"use client\"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function FalsePositives() {
  const [deals, setDeals] = useState<any[]>([])

  useEffect(() => {
    api.getFalsePositives().then(setDeals).catch(console.error)
  }, [])

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <h1 className=\"text-3xl font-bold\">False Positive Analysis</h1>
      <p className=\"text-muted-foreground\">Analyzing hype investments and ignored risks.</p>
      
      <div className=\"space-y-4\">
        {deals.map((d, idx) => (
          <Card key={idx}>
            <CardHeader><CardTitle>{d.company_name}</CardTitle></CardHeader>
            <CardContent className=\"space-y-2 text-sm\">
              <div><strong>Misleading Signal:</strong> {d.misleading_signal}</div>
              <div><strong>Ignored Risk:</strong> {d.ignored_risk}</div>
              <div><strong>Gate that should have triggered:</strong> {d.gate_that_should_have_triggered}</div>
              <div className=\"mt-4 p-2 bg-muted rounded\">
                <strong>Learning:</strong> {d.learning}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
"""
}

for name, content in files.items():
    with open(os.path.join(base_dir, name), "w") as f:
        f.write(content)

print("Decision Lab Frontend pages scaffolded.")
