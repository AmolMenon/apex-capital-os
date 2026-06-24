"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Activity } from 'lucide-react'

export default function ObservabilityPage() {
  const [health, setHealth] = useState<any>(null)
  const [errors, setErrors] = useState<any[]>([])

  useEffect(() => {
    api.getObservabilityHealth().then(setHealth).catch(console.error)
    api.getErrors().then(data => setErrors(data.errors)).catch(console.error)
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2"><Activity className="text-blue-500 w-8 h-8"/> Observability</h1>
      <p className="text-muted-foreground">System health, provider latencies, and error tracking.</p>
      
      {health && (
        <Card>
          <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div><strong>API:</strong> {health.api_health}</div>
            <div><strong>Database:</strong> {health.database_health}</div>
            <div><strong>LLM:</strong> {health.llm_health}</div>
            <div><strong>Scraper:</strong> {health.scraper_health}</div>
          </CardContent>
        </Card>
      )}

      <h2 className="text-2xl font-bold mt-8">Recent Errors</h2>
      {errors.map((e, idx) => (
        <Card key={idx} className="border-red-200">
          <CardContent className="pt-4 text-sm">
            <strong>[{e.error_id}]</strong> {e.timestamp} - {e.route}: <span className="text-red-500">{e.message}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
