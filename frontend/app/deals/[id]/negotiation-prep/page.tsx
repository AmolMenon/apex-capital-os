"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { Target, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function NegotiationPrep() {
  const { id } = useParams()
  const [prep, setPrep] = useState<any>(null)

  useEffect(() => {
    if (id) {
      api.getNegotiationPrep(id as string).then(setPrep).catch(console.error)
    }
  }, [id])

  if (!prep) return <div className="p-8">Loading Negotiation Prep...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Target className="text-emerald-600 w-8 h-8"/> Negotiation Prep</h1>
          <p className="text-muted-foreground mt-2">Map out trade-offs and priorities before meeting the founder.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-sky-600"/> Fund Priorities</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm space-y-1">
              {prep.fund_priorities.map((item:string, i:number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-indigo-600"/> Founder Priorities</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm space-y-1">
              {prep.founder_priorities.map((item:string, i:number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardHeader><CardTitle className="text-emerald-800">Terms to Push</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-emerald-900">
              {prep.push.map((item:string, i:number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-sky-200 bg-sky-50/30">
          <CardHeader><CardTitle className="text-sky-800">Terms to Flex</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-sky-900">
              {prep.flex.map((item:string, i:number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-rose-200 bg-rose-50/30">
          <CardHeader><CardTitle className="text-rose-800 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Non-Negotiables</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-rose-900">
              {prep.non_negotiables.map((item:string, i:number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Button className="w-full" onClick={() => alert('Brief copied to clipboard.')}>Copy Negotiation Brief</Button>
    </div>
  )
}
