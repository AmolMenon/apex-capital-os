"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Presentation } from 'lucide-react'
import Link from 'next/link'

export default function MeetingIntelligence() {
  const [upcoming, setUpcoming] = useState<any[]>([])

  useEffect(() => {
    api.getUpcomingMeetings().then(setUpcoming).catch(console.error)
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Presentation className="text-violet-600 w-8 h-8"/> Meeting Intelligence</h1>
          <p className="text-muted-foreground mt-2">Evaluate prep briefs, analyze call transcripts, and extract follow-ups.</p>
        </div>
        <Button onClick={() => api.syncCalendarMeetings()}>Sync Calendar</Button>
      </div>

      <h2 className="text-2xl font-bold mt-8">Upcoming Meetings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcoming.map((m, idx) => (
          <Card key={idx} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{m.title}</CardTitle>
              <div className="text-xs text-muted-foreground uppercase">{m.meeting_type}</div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
              <div className="text-sm">
                <strong>Time:</strong> {m.start_time}<br/>
                <strong>Participants:</strong> {m.participants.join(", ")}
              </div>
              <Link href={`/meetings/${m.meeting_id}`}>
                <Button variant="outline" className="w-full">View Prep & Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
