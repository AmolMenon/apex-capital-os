"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'

export default function MeetingDetail() {
  const { meeting_id } = useParams()
  const [meeting, setMeeting] = useState<any>(null)

  useEffect(() => {
    if (meeting_id) {
      api.getMeeting(meeting_id as string).then(setMeeting).catch(console.error)
    }
  }, [meeting_id])

  if (!meeting) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 bg-violet-100 text-violet-800 text-xs font-bold rounded uppercase tracking-wider">{meeting.meeting_type}</span>
      </div>
      <h1 className="text-3xl font-bold">{meeting.title}</h1>
      <p className="text-muted-foreground">Time: {meeting.start_time} | Participants: {meeting.participants.join(", ")}</p>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2 space-y-6">
          {meeting.prep_brief && Object.keys(meeting.prep_brief).length > 0 && (
            <Card>
              <CardHeader><CardTitle>Meeting Prep Brief</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm"><strong>Summary:</strong> {meeting.prep_brief.company_summary}</div>
                <div className="text-sm"><strong>Thesis Fit:</strong> {meeting.prep_brief.thesis_fit}</div>
                <div>
                  <strong>Suggested Questions:</strong>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {meeting.prep_brief.suggested_questions?.map((q:string, i:number) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {meeting.summary && Object.keys(meeting.summary).length > 0 && (
            <Card>
              <CardHeader><CardTitle>AI Meeting Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div><strong>What Happened:</strong> {meeting.summary.what_happened}</div>
                <div><strong>Next Best Action:</strong> {meeting.summary.next_best_action}</div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={() => api.generateMeetingPrep(meeting_id as string).then(alert)}>Evaluate Prep</Button>
              <Button variant="outline" className="w-full" onClick={() => api.analyzeMeetingTranscript(meeting_id as string).then(alert)}>Analyze Transcript</Button>
            </CardContent>
          </Card>

          {meeting.action_items?.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Follow-Ups Extracted</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {meeting.action_items.map((ai:any, i:number) => (
                  <div key={i} className="p-2 bg-slate-50 border rounded text-sm">
                    <strong>{ai.owner}:</strong> {ai.task} (Due {ai.due_date})
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
