"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Settings, PlayCircle } from 'lucide-react'
import Link from 'next/link'

export default function PlaybookHQ() {
  const [playbooks, setPlaybooks] = useState<any[]>([])
  const [status, setStatus] = useState<any>(null)

  useEffect(() => {
    api.getPlaybookStatus().then(setStatus).catch(console.error)
    api.getPlaybooks().then(setPlaybooks).catch(console.error)
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><BookOpen className="text-indigo-500 w-8 h-8"/> Playbook HQ</h1>
          <p className="text-muted-foreground mt-2">Fund methodology and investment strategy configuration.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/playbooks/builder"><Button variant="outline">Open Builder</Button></Link>
          <Link href="/playbooks/simulator"><Button>Simulator</Button></Link>
        </div>
      </div>

      {status && (
        <Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20">
          <CardHeader><CardTitle>Active Playbook</CardTitle></CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{status.active_playbook_name}</div>
          </CardContent>
        </Card>
      )}

      <h2 className="text-2xl font-bold mt-8">Demo Playbooks</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {playbooks.map((pb, idx) => (
          <Card key={idx} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{pb.playbook_name}</CardTitle>
              <div className="text-xs text-muted-foreground">Type: {pb.playbook_type}</div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm">{pb.fund_archetype}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  api.activatePlaybook(pb.playbook_id).then(() => location.reload())
                }}>Set Active</Button>
                <Link href={`/playbooks/${pb.playbook_id}`}>
                  <Button variant="ghost" size="sm">Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
