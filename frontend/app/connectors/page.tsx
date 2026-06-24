"use client"
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
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Network className="text-emerald-600 w-8 h-8"/> Connector Hub</h1>
          <p className="text-muted-foreground mt-2">Manage external workflow integrations safely.</p>
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
        <ShieldCheck className="text-amber-600 w-6 h-6 mt-1" />
        <div>
          <h3 className="font-bold text-amber-800">Privacy & Safety Active</h3>
          <p className="text-sm text-amber-700">Connectors run in strict read-only mode. Mock data is being used for this demo. No real API keys are exposed or saved to logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between">
                {p.connector_name}
                <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs rounded uppercase">{p.status}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-1">
                <div><strong>Last Sync:</strong> {p.last_sync_at}</div>
                <div><strong>Records Synced:</strong> {p.records_synced}</div>
                <div><strong>Permissions:</strong> {p.permissions.join(", ")}</div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => api.syncProvider(p.provider)}>Sync Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <h2 className="text-2xl font-bold mt-8">Recent Sync Runs</h2>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4">Provider</th>
                <th className="p-4">Started</th>
                <th className="p-4">Records</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r, i) => (
                <tr key={i} className="border-b">
                  <td className="p-4 font-bold">{r.provider}</td>
                  <td className="p-4">{r.started}</td>
                  <td className="p-4">{r.records}</td>
                  <td className="p-4">{r.errors === 0 ? "Success" : `${r.errors} errors`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
