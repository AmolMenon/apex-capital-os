"use client"
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
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><FlaskConical className="text-rose-500 w-8 h-8"/> Decision Lab HQ</h1>
          <p className="text-muted-foreground mt-2">Counterfactual Investment Simulator and Decision Quality Engine.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/decision-lab/playbook-backtests"><Button variant="outline" className="w-full">Playbook Backtests</Button></Link>
        <Link href="/decision-lab/counterfactuals"><Button variant="outline" className="w-full">Counterfactuals</Button></Link>
        <Link href="/decision-lab/missed-deals"><Button variant="outline" className="w-full">Missed Deals</Button></Link>
        <Link href="/decision-lab/false-positives"><Button variant="outline" className="w-full">False Positives</Button></Link>
      </div>

      <h2 className="text-2xl font-bold mt-8">Historical Case Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((c, idx) => (
          <Card key={idx} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{c.company_name}</CardTitle>
              <div className="text-xs text-muted-foreground">{c.case_type} | {c.stage_at_decision}</div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm mb-2"><strong>Outcome:</strong> {c.actual_later_outcome}</p>
              <Link href={`/decision-lab/cases/${c.case_id}`}>
                <Button className="w-full">Open Case</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
