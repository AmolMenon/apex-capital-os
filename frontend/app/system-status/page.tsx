"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Database, Cpu, Globe, Server, AlertTriangle, CheckCircle, Bot } from "lucide-react"
import { api } from "@/lib/api"
import { SystemStatus } from "@/types"

export default function SystemStatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [copilotStatus, setCopilotStatus] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStatus() {
      try {
        const data = await api.getSystemStatus()
        setStatus(data)
        
        try {
          const copilotData = await api.getCopilotStatus()
          setCopilotStatus(copilotData)
        } catch (e) {
          console.warn("Copilot status not available yet.")
        }
      } catch (e: any) {
        setError(e.message || "Could not connect to the Apex backend. Start FastAPI on http://127.0.0.1:8000 or check NEXT_PUBLIC_API_URL.")
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-muted-foreground">Probing system health...</div>
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 text-red-800 p-6 rounded-lg border border-red-200">
          <AlertTriangle className="w-8 h-8 mb-4 text-red-600" />
          <h2 className="text-xl font-bold mb-2">Backend Connection Failed</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!status) return null;

  const isRealMode = status.app_mode === "real" && status.enable_real_llm;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Status Center</h1>
        <p className="text-muted-foreground text-lg mt-2">Real-time health of the Apex Capital OS infrastructure and AI routing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3 border-b bg-slate-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="w-5 h-5 text-slate-500" /> API Gateway
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Status</span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Connected</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Base URL</span>
              <span className="text-xs text-muted-foreground">{status.api_url}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 border-b bg-slate-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-500" /> AI Routing Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Mode</span>
              {isRealMode ? (
                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Live LLM</Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Mock Fallback</Badge>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Default Provider</span>
              <span className="text-xs font-mono uppercase bg-slate-100 px-2 py-1 rounded">{status.default_provider}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 border-b bg-slate-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5 text-slate-500" /> Data Store
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Database Engine</span>
              <span className="text-xs text-muted-foreground uppercase">{status.db_type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Deals Loaded</span>
              <span className="text-sm font-bold">{status.deal_count}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {copilotStatus && (
        <Card className="border-blue-200 bg-blue-50/20">
          <CardHeader className="pb-3 border-b bg-blue-50/50">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
              <Bot className="w-5 h-5 text-blue-600" /> Partner Copilot Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-2 border-b border-blue-100">
              <span className="text-sm font-semibold">Overall Status</span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">{copilotStatus.status}</Badge>
            </div>
            <div className="flex justify-between items-center p-2 border-b border-blue-100">
              <span className="text-sm font-semibold">Mode</span>
              <span className="text-sm uppercase font-mono">{copilotStatus.mode}</span>
            </div>
            <div className="flex justify-between items-center p-2 border-b border-blue-100">
              <span className="text-sm font-semibold">Provider</span>
              <span className="text-sm">{copilotStatus.provider}</span>
            </div>
            <div className="flex justify-between items-center p-2 border-b border-blue-100">
              <span className="text-sm font-semibold">Mock Fallback</span>
              {copilotStatus.fallback_active ? (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Active</Badge>
              ) : (
                <Badge className="bg-slate-100 text-slate-800 border-slate-200">Inactive</Badge>
              )}
            </div>
            <div className="flex justify-between items-center p-2 border-b border-blue-100">
              <span className="text-sm font-semibold">Routes Healthy</span>
              {copilotStatus.routes_healthy ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="flex justify-between items-center p-2 border-b border-blue-100">
              <span className="text-sm font-semibold">Active Sessions</span>
              <span className="text-sm font-bold">{copilotStatus.latest_session_count}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Feature Health</CardTitle>
          <CardDescription>Status of the core intelligence and diligence pipelines.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(status.features_health).map(([feature, health]) => (
              <div key={feature} className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-semibold">{feature}</span>
                {health === "healthy" ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Healthy
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {health}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8 border-indigo-200">
        <CardHeader className="bg-indigo-50/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" /> Workspace Migration
          </CardTitle>
          <CardDescription>
            Export your fully persistent SQLite database and documents, or import an existing workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.open(`${status.api_url.replace('/api', '')}/workspace/export`, '_blank')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-semibold text-sm transition-colors"
            >
              Export Workspace
            </button>
            
            <div className="relative">
              <input 
                type="file" 
                id="workspace-upload" 
                className="hidden" 
                accept=".zip"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  const formData = new FormData();
                  formData.append('file', file);
                  
                  try {
                    const res = await fetch(`${status.api_url.replace('/api', '')}/workspace/import`, {
                      method: 'POST',
                      body: formData,
                    });
                    if (res.ok) {
                      alert('Workspace imported successfully. Please refresh the page.');
                    } else {
                      alert('Failed to import workspace.');
                    }
                  } catch (err) {
                    alert('Error importing workspace.');
                  }
                }}
              />
              <label 
                htmlFor="workspace-upload"
                className="cursor-pointer border border-indigo-200 text-indigo-700 bg-indigo-50 px-4 py-2 rounded-md hover:bg-indigo-100 font-semibold text-sm transition-colors inline-block"
              >
                Import Workspace
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
