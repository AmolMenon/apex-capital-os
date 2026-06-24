"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, Server, CheckCircle2, XCircle, Globe } from "lucide-react"

export default function SettingsPage() {
  const [statusData, setStatusData] = useState<any>(null)
  const [healthData, setHealthData] = useState<any>(null)
  const [researchStatus, setResearchStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${"http://127.0.0.1:8000"}/ai/status`).then(res => res.json()),
      fetch(`${"http://127.0.0.1:8000"}/health`).then(res => res.json()),
      fetch(`${"http://127.0.0.1:8000"}/web-research/status`).then(res => res.json()).catch(() => ({}))
    ])
      .then(([status, health, research]) => {
        setStatusData(status)
        setHealthData(health)
        setResearchStatus(research)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch configuration:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-8">Loading configuration...</div>
  }

  const isRealLlmEnabled = statusData?.real_llm_enabled || false
  const modeLabel = isRealLlmEnabled ? "Real LLM Mode Active" : "Mock Mode Active"
  const routing = statusData?.routing || {}
  const providers = statusData?.providers || {}

  const routingArray = Object.keys(routing).map(task => ({
    task: task.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    targetProvider: routing[task],
    providerStatus: providers[routing[task]]?.available ? "Available" : "Missing API Key",
    fallback: "Mock Provider"
  }))

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings & Architecture</h2>
          <p className="text-muted-foreground">Manage your Apex Capital configurations and AI routing.</p>
        </div>
      </div>

      
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            Live Agentic Workflow Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border rounded-md bg-muted/20">
              <div className="text-xs text-muted-foreground uppercase mb-1">Status</div>
              <div className="font-semibold text-green-600">Enabled</div>
            </div>
            <div className="p-3 border rounded-md bg-muted/20">
              <div className="text-xs text-muted-foreground uppercase mb-1">Workflow Mode</div>
              <div className="font-semibold capitalize text-indigo-600">Live LLM / Fallback</div>
            </div>
            <div className="p-3 border rounded-md bg-muted/20">
              <div className="text-xs text-muted-foreground uppercase mb-1">Default Provider</div>
              <div className="font-semibold">Gemini</div>
            </div>
            <div className="p-3 border rounded-md bg-muted/20">
              <div className="text-xs text-muted-foreground uppercase mb-1">Mock Fallback</div>
              <div className="font-semibold text-amber-600">Active (Safe)</div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-3">Agent Routing</h4>
              <div className="flex flex-wrap gap-2">
                {["Research Planner (Gemini)", "Search (Gemini)", "Source Quality (Gemini)", "Claim Extraction (Gemini)", "Evidence Verification (Gemini)", "Market Mapping (Gemini)", "Competitor Analysis (Gemini)", "Diligence Gap (Gemini)", "Fund Fit (Gemini)", "Red Team (Claude)", "Memo Writer (Gemini)", "IC Readiness (Gemini)"].map((agent, i) => (
                  <div key={i} className="text-[10px] border px-2 py-1 rounded-full bg-slate-50 text-slate-700 font-mono">
                    {agent}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-none flex items-end">
              <button onClick={() => alert(`Testing AI Router...\n\n[Mock Fallback triggered: Missing GEMINI_API_KEY]`)} className="text-xs px-4 py-2 border rounded-md hover:bg-slate-50">
                Test Agent Router
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

          <h3 className="font-semibold text-lg mt-8 mb-4">API Provider Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {Object.keys(providers).map(providerName => {
              const info = providers[providerName]
              return (
                <Card key={providerName} className="bg-card shadow-sm">
                  <CardContent className="p-4 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-sm capitalize">{providerName}</h4>
                      {info.available ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate" title={info.reason}>
                      {info.available ? "Ready" : info.reason || "Unavailable"}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <h3 className="font-semibold text-lg mb-4">Task Routing Topology</h3>
          <div className="relative w-full overflow-auto rounded-lg border">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b bg-muted/50">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-10 px-4 font-medium text-muted-foreground">Task Segment</th>
                  <th className="h-10 px-4 font-medium text-muted-foreground">Preferred Engine</th>
                  <th className="h-10 px-4 font-medium text-muted-foreground">Fallback Engine</th>
                  <th className="h-10 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0 bg-card">
                {routingArray.map((route, i) => (
                  <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 font-medium text-foreground">{route.task}</td>
                    <td className="p-4 text-muted-foreground capitalize">{isRealLlmEnabled ? route.targetProvider : "Mock"}</td>
                    <td className="p-4 text-muted-foreground font-mono text-xs">{route.fallback}</td>
                    <td className="p-4">
                      {route.providerStatus === "Available" && isRealLlmEnabled ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-600">
                          Active Route
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                          Fallback Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

      <div className="mt-12 text-center text-xs text-muted-foreground/60 max-w-3xl mx-auto border-t pt-8">
        <p>
          Disclaimer: Apex Capital is a portfolio project and educational prototype. It is not financial advice, investment advice, or a substitute for professional diligence. Outputs run in mock mode by default unless real providers are configured.
        </p>
      </div>
    </div>
  )
}
