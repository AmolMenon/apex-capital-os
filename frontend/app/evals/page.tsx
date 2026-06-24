"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FlaskConical } from 'lucide-react'

export default function EvalsPage() {
  const [status, setStatus] = useState<any>(null)
  const [cases, setCases] = useState<any[]>([])

  useEffect(() => {
    api.getEvalsStatus().then(setStatus).catch(console.error)
    api.getGoldenCases().then(data => setCases(data.cases)).catch(console.error)
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2"><FlaskConical className="text-indigo-500 w-8 h-8"/> Evals Dashboard</h1>
      <p className="text-muted-foreground">Deterministic tests, golden cases, and capability benchmarks.</p>
      
      <div className="grid grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle>Passed</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-emerald-500">{status ? status.passed : '...'}</CardContent></Card>
        <Card><CardHeader><CardTitle>Failed</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-red-500">{status ? status.failed : '...'}</CardContent></Card>
        <Card><CardHeader><CardTitle>Warnings</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-amber-500">{status ? status.warnings : '...'}</CardContent></Card>
      </div>

      <h2 className="text-2xl font-bold mt-8">Golden Cases</h2>
      <div className="grid grid-cols-2 gap-4">
        {cases.map((c, idx) => (
          <Card key={idx}>
            <CardHeader><CardTitle className="text-lg">{c.case}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm font-medium mb-1">Status: <span className="text-emerald-500">{c.status}</span></div>
              <div className="text-xs text-muted-foreground">{c.details}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
