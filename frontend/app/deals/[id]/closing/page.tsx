"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { CheckSquare, Briefcase, FileText, Send } from 'lucide-react'

export default function ClosingWorkflow() {
  const { id } = useParams()
  const [checklist, setChecklist] = useState<any[]>([])
  const [diligence, setDiligence] = useState<any[]>([])

  useEffect(() => {
    if (id) {
      api.getClosingChecklist(id as string).then(setChecklist).catch(console.error)
      api.getLegalDiligence(id as string).then(setDiligence).catch(console.error)
    }
  }, [id])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Briefcase className="text-slate-800 w-8 h-8"/> Closing Workflow</h1>
          <p className="text-muted-foreground mt-2">Track execution, legal diligence, and portfolio onboarding.</p>
        </div>
        <Button onClick={() => api.runPostCloseHandoff(id as string).then(()=>alert('Post-close handoff started! Created Portfolio Company.'))}>
          <Send className="w-4 h-4 mr-2"/> Run Post-Close Handoff
        </Button>
      </div>

      <div className="bg-slate-100 p-4 rounded text-sm text-slate-700 italic border border-slate-200">
        "Legal diligence tracking only. Counsel review required."
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CheckSquare className="w-5 h-5 text-indigo-600"/> Closing Checklist</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-y">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {checklist.map((c, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3">
                      <div className="font-bold">{c.item}</div>
                      <div className="text-xs text-muted-foreground">Requires: {c.evidence_required}</div>
                    </td>
                    <td className="p-3">{c.owner}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${c.status==='Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-sky-600"/> Legal Diligence Tracker</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-y">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {diligence.map((d, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3 font-medium">{d.item}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${d.status==='Received' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{d.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
