"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AgentWorkflowStatus, AgentTraceTimeline, RedTeamCritique } from "@/components/agent-workflow/AgentComponents"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle2, Loader2 } from "lucide-react"

export function AgentWorkflowClientWrapper({ dealId, initialWorkflow }: { dealId: string, initialWorkflow: any }) {
  const [isRunning, setIsRunning] = useState(false)
  const router = useRouter()

  const handleRun = async () => {
    setIsRunning(true)
    try {
      const baseUrl = "http://127.0.0.1:8000"
      await fetch(`${baseUrl}/agent-workflow/deals/${dealId}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setIsRunning(false)
    }
  }

  if (isRunning) {
    return (
      <Card>
        <CardContent className="p-12 text-center flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Running Agentic Workflow</h3>
          <p className="text-muted-foreground">Please wait while our 12 specialist AI agents evaluate this startup...</p>
        </CardContent>
      </Card>
    )
  }

  if (!initialWorkflow) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">No Agentic Workflow Found</h3>
          <p className="text-muted-foreground mb-4">Run the multi-agent workflow to evaluate this deal.</p>
          <button 
            onClick={handleRun}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Run Full Workflow
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <AgentWorkflowStatus 
        metadata={initialWorkflow.metadata} 
        agentsRun={initialWorkflow.agents_run} 
        onRun={handleRun}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <AgentTraceTimeline trace={initialWorkflow.trace} />
        </div>
        
        <div className="space-y-6">
          <RedTeamCritique trace={initialWorkflow.trace} />
          
          <Card>
            <CardHeader className="bg-slate-50 border-b pb-3">
              <CardTitle className="text-lg">Agentic Research Report</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Public Benchmark Conclusion</h4>
                <p className="font-medium">{initialWorkflow.final_report?.public_benchmark_conclusion}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">IC Readiness Status</h4>
                <p className="text-sm">{initialWorkflow.final_report?.ic_readiness_status}</p>
              </div>
              {initialWorkflow.final_report?.private_diligence_required && initialWorkflow.final_report.private_diligence_required.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Missing Private Metrics</h4>
                  <ul className="text-sm space-y-1">
                    {initialWorkflow.final_report.private_diligence_required.map((m: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-amber-500"/> {m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
