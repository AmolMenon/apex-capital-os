"use client"
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
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Counterfactual Simulator</h1>
      <p className="text-muted-foreground">Test "what if" changes on historical cases.</p>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">Case: VectorDesk AI</p>
              <p className="text-sm text-muted-foreground">Original Recommendation: Watchlist / Pass</p>
            </div>
            <Button onClick={runSim}>Simulate "Lowered Traction Gate"</Button>
          </div>
          
          {result && (
            <div className="mt-6 p-4 bg-indigo-50 rounded border border-indigo-100">
              <h3 className="font-bold text-indigo-800">Counterfactual Result</h3>
              <p className="text-lg font-bold mt-2">New Recommendation: {result.counterfactual_recommendation}</p>
              <p className="text-sm mt-2"><strong>Risk Delta:</strong> {result.risk_delta}</p>
              <p className="text-sm mt-2"><strong>Learning:</strong> {result.learning}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
