"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function PlaybookBacktests() {
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    api.getPlaybookBacktests().then(setResults).catch(console.error)
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Playbook Backtests</h1>
      <p className="text-muted-foreground">Comparing decision quality across fund methodologies on the same dataset.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((r, idx) => (
          <Card key={idx}>
            <CardHeader><CardTitle>{r.playbook_id}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Decision Quality:</strong> {r.average_decision_quality}</div>
              <div><strong>Simulated Hits:</strong> {r.simulated_hits}</div>
              <div><strong>Simulated Misses:</strong> {r.simulated_misses}</div>
              <div><strong>False Positives:</strong> {r.false_positives}</div>
              <div className="pt-2 border-t mt-2"><strong>Weakness:</strong> {r.weaknesses.join(", ")}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
