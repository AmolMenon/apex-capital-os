"use client"
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
      const res = await api.runBacktest({ case_id, playbook_id: "Apex Default Early-Stage" })
      setBacktest(res)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  if (!data) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded uppercase tracking-wider">{data.case_type}</span>
      </div>
      <h1 className="text-3xl font-bold">Case Study: {data.company_name}</h1>
      <p className="text-muted-foreground">Decision Date: {data.decision_date} | Cutoff: {data.information_cutoff}</p>
      
      {integrity && integrity.safe_to_use_in_backtest ? (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-2 rounded"><CheckCircle2 className="w-4 h-4"/> Cutoff Integrity Verified (No Future Leakage)</div>
      ) : (
        <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-2 rounded"><AlertTriangle className="w-4 h-4"/> Cutoff Integrity Warning</div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <Card className="border-slate-300">
          <CardHeader className="bg-slate-50"><CardTitle>At-the-Time Evidence</CardTitle></CardHeader>
          <CardContent className="pt-4 space-y-2">
            {data.available_evidence.map((e:string, i:number) => <div key={i} className="text-sm">• {e}</div>)}
          </CardContent>
        </Card>
        <Card className="border-rose-200 bg-rose-50/30">
          <CardHeader><CardTitle className="text-rose-700">Excluded Future Evidence (Hindsight)</CardTitle></CardHeader>
          <CardContent className="pt-4 space-y-2">
            {data.excluded_future_evidence.map((e:string, i:number) => <div key={i} className="text-sm text-rose-600">• {e}</div>)}
          </CardContent>
        </Card>
      </div>

      <div className="py-4">
        <Button onClick={runBacktest} disabled={loading} size="lg" className="w-full">Run Simulated Backtest</Button>
      </div>

      {backtest && (
        <Card className="border-indigo-300 bg-indigo-50/50">
          <CardHeader><CardTitle>Backtest Results</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold">Recommendation at Time</p>
                <p className="text-lg">{backtest.recommendation_at_time}</p>
              </div>
              <div>
                <p className="text-sm font-bold">Later Outcome</p>
                <p className="text-lg">{backtest.later_outcome_comparison}</p>
              </div>
              <div>
                <p className="text-sm font-bold">Decision Quality</p>
                <p className="text-lg text-indigo-700 font-bold">{backtest.decision_quality}</p>
              </div>
            </div>
            {backtest.learning && backtest.learning.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-bold">Suggested Learning</p>
                <p className="text-sm italic">"{backtest.learning[0]}"</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
