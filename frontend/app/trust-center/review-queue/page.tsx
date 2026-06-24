"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ReviewQueuePage() {
  const [queue, setQueue] = useState<any[]>([])

  useEffect(() => {
    api.getReviewQueue().then(data => setQueue(data.queue)).catch(console.error)
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Review Queue</h1>
      <p className="text-muted-foreground">Outputs marked for human-in-the-loop validation.</p>
      
      {queue.map((item, idx) => (
        <Card key={idx}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{item.output_id} ({item.entity})</CardTitle>
              <Badge variant="outline" className="bg-amber-100 text-amber-800">{item.review_status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p><strong>Trust Score:</strong> {item.trust_score}</p>
            <p><strong>Risk Flags:</strong> {item.risk_flags.join(', ')}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
