"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useParams } from 'next/navigation'

export default function PlaybookDetail() {
  const { playbook_id } = useParams()
  const [playbook, setPlaybook] = useState<any>(null)

  useEffect(() => {
    if (playbook_id) {
      api.getPlaybook(playbook_id as string).then(setPlaybook).catch(console.error)
    }
  }, [playbook_id])

  if (!playbook) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{playbook.playbook_name}</h1>
      <p className="text-muted-foreground">Archetype: {playbook.fund_archetype}</p>
      
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Philosophy</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(playbook.investment_philosophy, null, 2)}
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Decision Gates</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(playbook.decision_gates, null, 2)}
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Scoring Profile</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(playbook.scoring_profile, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
