import os

base_dir = "frontend/app"
os.makedirs(f"{base_dir}/connectors", exist_ok=True)
os.makedirs(f"{base_dir}/deal-inbox/items/[inbound_id]", exist_ok=True)
os.makedirs(f"{base_dir}/meetings/[meeting_id]", exist_ok=True)

files = {
    "connectors/page.tsx": """\"use client\"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Network, ShieldCheck } from 'lucide-react'

export default function ConnectorHub() {
  const [providers, setProviders] = useState<any[]>([])
  const [runs, setRuns] = useState<any[]>([])

  useEffect(() => {
    api.getConnectorProviders().then(setProviders).catch(console.error)
    api.getConnectorSyncRuns().then(setRuns).catch(console.error)
  }, [])

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <div className=\"flex justify-between items-center\">
        <div>
          <h1 className=\"text-3xl font-bold flex items-center gap-2\"><Network className=\"text-emerald-600 w-8 h-8\"/> Connector Hub</h1>
          <p className=\"text-muted-foreground mt-2\">Manage external workflow integrations safely.</p>
        </div>
      </div>
      
      <div className=\"bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3\">
        <ShieldCheck className=\"text-amber-600 w-6 h-6 mt-1\" />
        <div>
          <h3 className=\"font-bold text-amber-800\">Privacy & Safety Active</h3>
          <p className=\"text-sm text-amber-700\">Connectors run in strict read-only mode. Mock data is being used for this demo. No real API keys are exposed or saved to logs.</p>
        </div>
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
        {providers.map((p, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className=\"text-lg flex justify-between\">
                {p.connector_name}
                <span className=\"px-2 py-1 bg-slate-100 text-slate-800 text-xs rounded uppercase\">{p.status}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className=\"space-y-4\">
              <div className=\"text-sm text-muted-foreground space-y-1\">
                <div><strong>Last Sync:</strong> {p.last_sync_at}</div>
                <div><strong>Records Synced:</strong> {p.records_synced}</div>
                <div><strong>Permissions:</strong> {p.permissions.join(\", \")}</div>
              </div>
              <Button variant=\"outline\" className=\"w-full\" onClick={() => api.syncProvider(p.provider)}>Sync Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <h2 className=\"text-2xl font-bold mt-8\">Recent Sync Runs</h2>
      <Card>
        <CardContent className=\"p-0\">
          <table className=\"w-full text-sm text-left\">
            <thead className=\"bg-slate-50 border-b\">
              <tr>
                <th className=\"p-4\">Provider</th>
                <th className=\"p-4\">Started</th>
                <th className=\"p-4\">Records</th>
                <th className=\"p-4\">Status</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r, i) => (
                <tr key={i} className=\"border-b\">
                  <td className=\"p-4 font-bold\">{r.provider}</td>
                  <td className=\"p-4\">{r.started}</td>
                  <td className=\"p-4\">{r.records}</td>
                  <td className=\"p-4\">{r.errors === 0 ? \"Success\" : `${r.errors} errors`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
""",
    "deal-inbox/page.tsx": """\"use client\"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Inbox, Zap } from 'lucide-react'
import Link from 'next/link'

export default function DealInbox() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    api.getDealInboxItems().then(setItems).catch(console.error)
  }, [])

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <div className=\"flex justify-between items-center\">
        <div>
          <h1 className=\"text-3xl font-bold flex items-center gap-2\"><Inbox className=\"text-indigo-600 w-8 h-8\"/> Deal Inbox</h1>
          <p className=\"text-muted-foreground mt-2\">Triage inbound founder emails, decks, and CRM leads.</p>
        </div>
        <Button onClick={() => api.syncDealInbox()}>Sync Inbound Queue</Button>
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
        {items.map((item, idx) => (
          <Card key={idx} className={`flex flex-col ${item.priority_score?.priority === 'High Priority' ? 'border-indigo-400 ring-1 ring-indigo-200' : ''}`}>
            <CardHeader className=\"pb-2\">
              <div className=\"flex justify-between items-start\">
                <CardTitle className=\"text-lg\">{item.company_name}</CardTitle>
                {item.priority_score?.priority === 'High Priority' && <Zap className=\"text-amber-500 w-5 h-5\" />}
              </div>
              <div className=\"text-xs text-muted-foreground\">{item.founder_name} | {item.source}</div>
            </CardHeader>
            <CardContent className=\"flex-1 flex flex-col space-y-4\">
              <p className=\"text-sm flex-1\">{item.summary}</p>
              <div className=\"bg-slate-50 p-2 rounded text-xs\">
                <strong>Thesis Match:</strong> {item.thesis_match?.match}
              </div>
              <Link href={`/deal-inbox/items/${item.inbound_id}`}>
                <Button className=\"w-full\">Triage & Review</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
""",
    "deal-inbox/items/[inbound_id]/page.tsx": """\"use client\"
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

  if (!item) return <div className=\"p-8\">Loading...</div>

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <div className=\"flex items-center gap-2 mb-2\">
        <span className=\"px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded uppercase tracking-wider\">{item.priority_score?.priority}</span>
      </div>
      <h1 className=\"text-3xl font-bold\">{item.company_name}</h1>
      <p className=\"text-muted-foreground\">From: {item.founder_name} &lt;{item.founder_email}&gt; | Received: {item.received_at}</p>

      <div className=\"grid grid-cols-3 gap-6 mt-6\">
        <div className=\"col-span-2 space-y-6\">
          <Card>
            <CardHeader><CardTitle>Inbound Email Summary</CardTitle></CardHeader>
            <CardContent>
              <p className=\"text-sm italic\">\"{item.summary}\"</p>
              {item.attachments?.length > 0 && (
                <div className=\"mt-4\">
                  <strong>Attachments:</strong> {item.attachments.join(\", \")}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Parsed Founder Claims (Unverified)</CardTitle></CardHeader>
            <CardContent className=\"space-y-2\">
              {item.parsed_claims.map((c:string, i:number) => (
                <div key={i} className=\"p-2 bg-slate-50 border rounded text-sm flex items-center justify-between\">
                  <span>{c}</span>
                  <span className=\"text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded\">Claim</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className=\"space-y-6\">
          <Card>
            <CardHeader><CardTitle>Conversion</CardTitle></CardHeader>
            <CardContent className=\"space-y-4\">
              <div className=\"text-sm\">
                <strong>Thesis Match:</strong> {item.thesis_match?.match}<br/>
                <span className=\"text-muted-foreground\">{item.thesis_match?.reason}</span>
              </div>
              <div className=\"text-sm\">
                <strong>Action:</strong> {item.recommended_next_action}
              </div>
              <Button className=\"w-full\" onClick={() => api.convertInboundToDeal(inbound_id as string).then(alert)}>
                Convert to Apex Deal
              </Button>
              <Button variant=\"outline\" className=\"w-full\" onClick={() => api.requestInboundInfo(inbound_id as string).then(alert)}>
                Request More Info
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
""",
    "meetings/page.tsx": """\"use client\"
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
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <div className=\"flex justify-between items-center\">
        <div>
          <h1 className=\"text-3xl font-bold flex items-center gap-2\"><Presentation className=\"text-violet-600 w-8 h-8\"/> Meeting Intelligence</h1>
          <p className=\"text-muted-foreground mt-2\">Generate prep briefs, analyze call transcripts, and extract follow-ups.</p>
        </div>
        <Button onClick={() => api.syncCalendarMeetings()}>Sync Calendar</Button>
      </div>

      <h2 className=\"text-2xl font-bold mt-8\">Upcoming Meetings</h2>
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
        {upcoming.map((m, idx) => (
          <Card key={idx} className=\"flex flex-col\">
            <CardHeader>
              <CardTitle className=\"text-lg\">{m.title}</CardTitle>
              <div className=\"text-xs text-muted-foreground uppercase\">{m.meeting_type}</div>
            </CardHeader>
            <CardContent className=\"flex-1 flex flex-col space-y-4\">
              <div className=\"text-sm\">
                <strong>Time:</strong> {m.start_time}<br/>
                <strong>Participants:</strong> {m.participants.join(\", \")}
              </div>
              <Link href={`/meetings/${m.meeting_id}`}>
                <Button variant=\"outline\" className=\"w-full\">View Prep & Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
""",
    "meetings/[meeting_id]/page.tsx": """\"use client\"
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

  if (!meeting) return <div className=\"p-8\">Loading...</div>

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <div className=\"flex items-center gap-2 mb-2\">
        <span className=\"px-2 py-1 bg-violet-100 text-violet-800 text-xs font-bold rounded uppercase tracking-wider\">{meeting.meeting_type}</span>
      </div>
      <h1 className=\"text-3xl font-bold\">{meeting.title}</h1>
      <p className=\"text-muted-foreground\">Time: {meeting.start_time} | Participants: {meeting.participants.join(\", \")}</p>

      <div className=\"grid grid-cols-3 gap-6 mt-6\">
        <div className=\"col-span-2 space-y-6\">
          {meeting.prep_brief && Object.keys(meeting.prep_brief).length > 0 && (
            <Card>
              <CardHeader><CardTitle>Meeting Prep Brief</CardTitle></CardHeader>
              <CardContent className=\"space-y-4\">
                <div className=\"text-sm\"><strong>Summary:</strong> {meeting.prep_brief.company_summary}</div>
                <div className=\"text-sm\"><strong>Thesis Fit:</strong> {meeting.prep_brief.thesis_fit}</div>
                <div>
                  <strong>Suggested Questions:</strong>
                  <ul className=\"list-disc list-inside text-sm mt-1\">
                    {meeting.prep_brief.suggested_questions?.map((q:string, i:number) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {meeting.summary && Object.keys(meeting.summary).length > 0 && (
            <Card>
              <CardHeader><CardTitle>AI Meeting Summary</CardTitle></CardHeader>
              <CardContent className=\"space-y-4 text-sm\">
                <div><strong>What Happened:</strong> {meeting.summary.what_happened}</div>
                <div><strong>Next Best Action:</strong> {meeting.summary.next_best_action}</div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className=\"space-y-6\">
          <Card>
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent className=\"space-y-4\">
              <Button className=\"w-full\" onClick={() => api.generateMeetingPrep(meeting_id as string).then(alert)}>Generate Prep</Button>
              <Button variant=\"outline\" className=\"w-full\" onClick={() => api.analyzeTranscript(meeting_id as string).then(alert)}>Analyze Transcript</Button>
            </CardContent>
          </Card>

          {meeting.action_items?.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Follow-Ups Extracted</CardTitle></CardHeader>
              <CardContent className=\"space-y-2\">
                {meeting.action_items.map((ai:any, i:number) => (
                  <div key={i} className=\"p-2 bg-slate-50 border rounded text-sm\">
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
"""
}

for name, content in files.items():
    with open(os.path.join(base_dir, name), "w") as f:
        f.write(content)

print("Frontend pages scaffolded.")
