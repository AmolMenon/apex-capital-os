import os

base_dir = "frontend/app/playbooks"
os.makedirs(f"{base_dir}/builder", exist_ok=True)
os.makedirs(f"{base_dir}/[playbook_id]", exist_ok=True)
os.makedirs(f"{base_dir}/simulator", exist_ok=True)

files = {
    "page.tsx": """\"use client\"
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
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <div className=\"flex justify-between items-center\">
        <div>
          <h1 className=\"text-3xl font-bold flex items-center gap-2\"><BookOpen className=\"text-indigo-500 w-8 h-8\"/> Playbook HQ</h1>
          <p className=\"text-muted-foreground mt-2\">Fund methodology and investment strategy configuration.</p>
        </div>
        <div className=\"flex gap-2\">
          <Link href=\"/playbooks/builder\"><Button variant=\"outline\">Open Builder</Button></Link>
          <Link href=\"/playbooks/simulator\"><Button>Simulator</Button></Link>
        </div>
      </div>

      {status && (
        <Card className=\"border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20\">
          <CardHeader><CardTitle>Active Playbook</CardTitle></CardHeader>
          <CardContent>
            <div className=\"text-xl font-bold text-indigo-600 dark:text-indigo-400\">{status.active_playbook_name}</div>
          </CardContent>
        </Card>
      )}

      <h2 className=\"text-2xl font-bold mt-8\">Demo Playbooks</h2>
      <div className=\"grid grid-cols-2 md:grid-cols-3 gap-6\">
        {playbooks.map((pb, idx) => (
          <Card key={idx} className=\"flex flex-col\">
            <CardHeader>
              <CardTitle className=\"text-lg\">{pb.playbook_name}</CardTitle>
              <div className=\"text-xs text-muted-foreground\">Type: {pb.playbook_type}</div>
            </CardHeader>
            <CardContent className=\"flex-1\">
              <p className=\"text-sm\">{pb.fund_archetype}</p>
              <div className=\"mt-4 flex gap-2\">
                <Button variant=\"outline\" size=\"sm\" onClick={() => {
                  api.activatePlaybook(pb.playbook_id).then(() => location.reload())
                }}>Set Active</Button>
                <Link href={`/playbooks/${pb.playbook_id}`}>
                  <Button variant=\"ghost\" size=\"sm\">Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
""",
    "builder/page.tsx": """\"use client\"
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PlaybookBuilder() {
  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <h1 className=\"text-3xl font-bold\">Playbook Builder</h1>
      <p className=\"text-muted-foreground\">Read/Edit Light UI (Mock Save for Demo)</p>
      
      <div className=\"grid grid-cols-2 gap-6\">
        <Card>
          <CardHeader><CardTitle>Investment Philosophy</CardTitle></CardHeader>
          <CardContent className=\"space-y-4\">
            <div><label className=\"text-sm font-bold\">Founder-Market Fit Importance</label><select className=\"w-full p-2 border rounded\"><option>High</option><option>Medium</option></select></div>
            <div><label className=\"text-sm font-bold\">Valuation Sensitivity</label><select className=\"w-full p-2 border rounded\"><option>High</option><option>Low</option></select></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Decision Gates</CardTitle></CardHeader>
          <CardContent className=\"space-y-4\">
            <div><label className=\"text-sm font-bold\">Min Evidence Score for IC</label><input type=\"number\" defaultValue={60} className=\"w-full p-2 border rounded\"/></div>
            <div className=\"text-xs text-rose-500 mt-4\">* Note: Universal safety gates (like no direct invest from public data alone) remain locked and cannot be disabled.</div>
          </CardContent>
        </Card>
      </div>
      <Button className=\"mt-4\">Save Custom Playbook (Mock)</Button>
    </div>
  )
}
""",
    "[playbook_id]/page.tsx": """\"use client\"
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

  if (!playbook) return <div className=\"p-8\">Loading...</div>

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <h1 className=\"text-3xl font-bold\">{playbook.playbook_name}</h1>
      <p className=\"text-muted-foreground\">Archetype: {playbook.fund_archetype}</p>
      
      <div className=\"grid grid-cols-2 gap-6\">
        <Card>
          <CardHeader><CardTitle>Philosophy</CardTitle></CardHeader>
          <CardContent>
            <pre className=\"text-xs bg-muted p-4 rounded overflow-auto\">
              {JSON.stringify(playbook.investment_philosophy, null, 2)}
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Decision Gates</CardTitle></CardHeader>
          <CardContent>
            <pre className=\"text-xs bg-muted p-4 rounded overflow-auto\">
              {JSON.stringify(playbook.decision_gates, null, 2)}
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Scoring Profile</CardTitle></CardHeader>
          <CardContent>
            <pre className=\"text-xs bg-muted p-4 rounded overflow-auto\">
              {JSON.stringify(playbook.scoring_profile, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
""",
    "simulator/page.tsx": """\"use client\"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PlaybookSimulator() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const simulateDeal = async (dealId: string) => {
    setLoading(true)
    try {
      const res = await api.simulateDealAcrossPlaybooks(dealId)
      setResults(res.results)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div className=\"p-8 max-w-6xl mx-auto space-y-6\">
      <h1 className=\"text-3xl font-bold\">Playbook Simulator</h1>
      <p className=\"text-muted-foreground\">See how the same company is graded differently across various fund styles.</p>
      
      <div className=\"flex gap-4 mb-8\">
        <Button onClick={() => simulateDeal(\"1\")} disabled={loading}>Simulate Sarvam AI</Button>
        <Button onClick={() => simulateDeal(\"2\")} disabled={loading}>Simulate NeuralDesk</Button>
      </div>

      {results.length > 0 && (
        <div className=\"space-y-4\">
          <h2 className=\"text-2xl font-bold\">Results for {results[0].company_name}</h2>
          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
            {results.map((r, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className=\"text-lg\">{r.playbook_name}</CardTitle>
                </CardHeader>
                <CardContent className=\"space-y-2 text-sm\">
                  <div><strong>Base Score:</strong> {r.base_score}</div>
                  <div><strong>Adjusted Score:</strong> {r.playbook_adjusted_score}</div>
                  <div><strong>Recommendation:</strong> <span className=\"text-indigo-600 font-bold\">{r.recommendation}</span></div>
                  <div><strong>Biggest Blocker:</strong> {r.biggest_blocker}</div>
                  <div><strong>Next Action:</strong> {r.required_next_action}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
"""
}

for name, content in files.items():
    with open(os.path.join(base_dir, name), "w") as f:
        f.write(content)

print("Frontend pages scaffolded.")
