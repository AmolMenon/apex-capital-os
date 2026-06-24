"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'

export default function InboundItemDetail() {
  const { inbound_id } = useParams()
  const [item, setItem] = useState<any>(null)

  useEffect(() => {
    if (inbound_id) {
      api.getDealInboxItem(inbound_id as string).then(setItem).catch(console.error)
    }
  }, [inbound_id])

  if (!item) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded uppercase tracking-wider">{item.priority_score?.priority}</span>
      </div>
      <h1 className="text-3xl font-bold">{item.company_name}</h1>
      <p className="text-muted-foreground">From: {item.founder_name} &lt;{item.founder_email}&gt; | Received: {item.received_at}</p>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Inbound Email Summary</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm italic">"{item.summary}"</p>
              {item.attachments?.length > 0 && (
                <div className="mt-4">
                  <strong>Attachments:</strong> {item.attachments.join(", ")}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Parsed Founder Claims (Unverified)</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {item.parsed_claims.map((c:string, i:number) => (
                <div key={i} className="p-2 bg-slate-50 border rounded text-sm flex items-center justify-between">
                  <span>{c}</span>
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">Claim</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Conversion</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <strong>Thesis Match:</strong> {item.thesis_match?.match}<br/>
                <span className="text-muted-foreground">{item.thesis_match?.reason}</span>
              </div>
              <div className="text-sm">
                <strong>Action:</strong> {item.recommended_next_action}
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg" onClick={() => api.convertInboundToDeal(inbound_id as string).then(res => { alert('Converted!'); window.location.href = `/deals/${res.deal_id}/deal-room`; })}>
                Convert to Apex Deal
              </Button>
              <Button variant="outline" className="w-full" onClick={() => api.requestInboundInfo(inbound_id as string).then(alert)}>
                Request More Info
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
