"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Inbox, Zap } from 'lucide-react'
import Link from 'next/link'

export default function DealInbox() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    api.getDealInboxItems().then(data => {
      if (data && data.length > 0) {
        setItems(data)
      } else {
        setItems([{
          inbound_id: "demo-1",
          company_name: "QuantumLeap AI",
          founder_name: "Jane Smith",
          source: "Direct Email",
          summary: "Building quantum-resistant encryption protocols for financial institutions. Currently at $1M ARR with strong enterprise pipeline.",
          priority_score: { priority: "High Priority" },
          thesis_match: { match: "Strong Match - Enterprise Security" }
        }])
      }
    }).catch(e => {
      console.error(e)
      setItems([{
        inbound_id: "demo-1",
        company_name: "QuantumLeap AI",
        founder_name: "Jane Smith",
        source: "Direct Email",
        summary: "Building quantum-resistant encryption protocols for financial institutions. Currently at $1M ARR with strong enterprise pipeline.",
        priority_score: { priority: "High Priority" },
        thesis_match: { match: "Strong Match - Enterprise Security" }
      }])
    })
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Inbox className="text-indigo-600 w-8 h-8"/> Deal Inbox</h1>
          <p className="text-muted-foreground mt-2">Triage inbound founder emails, decks, and CRM leads.</p>
        </div>
        <Button onClick={() => api.syncDealInbox()}>Sync Inbound Queue</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <Card key={idx} className={`flex flex-col ${item.priority_score?.priority === 'High Priority' ? 'border-indigo-400 ring-1 ring-indigo-200' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.company_name}</CardTitle>
                {item.priority_score?.priority === 'High Priority' && <Zap className="text-amber-500 w-5 h-5" />}
              </div>
              <div className="text-xs text-muted-foreground">{item.founder_name} | {item.source}</div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
              <p className="text-sm flex-1">{item.summary}</p>
              <div className="bg-slate-50 p-2 rounded text-xs">
                <strong>Thesis Match:</strong> {item.thesis_match?.match}
              </div>
              <Link href={`/deal-inbox/items/${item.inbound_id}`}>
                <Button className="w-full">Triage & Review</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
