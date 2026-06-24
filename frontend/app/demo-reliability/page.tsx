"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'

export default function DemoReliabilityPage() {
  const [status, setStatus] = useState<any>(null)

  useEffect(() => {
    api.getDemoReliabilityStatus().then(setStatus).catch(console.error)
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2"><ShieldAlert className="text-rose-500 w-8 h-8"/> Demo Reliability Mode</h1>
      <p className="text-muted-foreground">Pre-flight checks to ensure the live showcase does not crash.</p>
      
      {status && (
        <Card>
          <CardHeader><CardTitle>Checklist Status: {status.status}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Last Check: {status.last_check}</p>
            <ul className="list-disc pl-4 space-y-1 text-sm text-amber-600">
              {status.warnings.map((w: string, idx: number) => <li key={idx}>{w}</li>)}
            </ul>
            <Button className="mt-4" onClick={() => api.runDemoCheck().then(() => location.reload())}>Run Pre-Demo Check</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
