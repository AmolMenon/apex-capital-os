"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function MissedDeals() {
  const [deals, setDeals] = useState<any[]>([])

  useEffect(() => {
    api.getMissedDeals().then(setDeals).catch(console.error)
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Missed Deal Analysis</h1>
      <p className="text-muted-foreground">Attributing root causes to missed winners.</p>
      
      <div className="space-y-4">
        {deals.map((d, idx) => (
          <Card key={idx}>
            <CardHeader><CardTitle>{d.company_name}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Recommendation at time:</strong> {d.recommendation_at_time}</div>
              <div><strong>Later Outcome:</strong> {d.later_outcome}</div>
              <div><strong>Missed Signal:</strong> {d.missed_signal}</div>
              <div><strong>Avoidable:</strong> {d.avoidable ? "Yes" : "No"}</div>
              <div className="mt-4 p-2 bg-muted rounded">
                <strong>Suggested Playbook Change:</strong> {d.playbook_change_suggested}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
