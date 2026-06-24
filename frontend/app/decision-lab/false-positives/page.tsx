"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function FalsePositives() {
  const [deals, setDeals] = useState<any[]>([])

  useEffect(() => {
    api.getFalsePositives().then(setDeals).catch(console.error)
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">False Positive Analysis</h1>
      <p className="text-muted-foreground">Analyzing hype investments and ignored risks.</p>
      
      <div className="space-y-4">
        {deals.map((d, idx) => (
          <Card key={idx}>
            <CardHeader><CardTitle>{d.company_name}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Misleading Signal:</strong> {d.misleading_signal}</div>
              <div><strong>Ignored Risk:</strong> {d.ignored_risk}</div>
              <div><strong>Gate that should have triggered:</strong> {d.gate_that_should_have_triggered}</div>
              <div className="mt-4 p-2 bg-muted rounded">
                <strong>Learning:</strong> {d.learning}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
