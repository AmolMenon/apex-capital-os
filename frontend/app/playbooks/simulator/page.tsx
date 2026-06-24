"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PlaybookSimulator() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const simulateDeal = async (dealId: string) => {
    setLoading(true)
    try {
      const res = await api.simulateDealAcrossPlaybooks(dealId)
      setResults(res.results)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Playbook Simulator</h1>
      <p className="text-muted-foreground">See how the same company is graded differently across various fund styles.</p>
      
      <div className="flex gap-4 mb-8">
        <Button onClick={() => simulateDeal("1")} disabled={loading}>Simulate Sarvam AI</Button>
        <Button onClick={() => simulateDeal("2")} disabled={loading}>Simulate NeuralDesk</Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Results for {results[0].company_name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((r, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{r.playbook_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Base Score:</strong> {r.base_score}</div>
                  <div><strong>Adjusted Score:</strong> {r.playbook_adjusted_score}</div>
                  <div><strong>Recommendation:</strong> <span className="text-indigo-600 font-bold">{r.recommendation}</span></div>
                  <div><strong>Biggest Blocker:</strong> {r.biggest_blocker}</div>
                  <div><strong>Next Action:</strong> {r.required_next_action}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
