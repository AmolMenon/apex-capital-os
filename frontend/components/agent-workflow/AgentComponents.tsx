import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ShieldAlert, Cpu, CheckCircle, Info, ArrowRight, BrainCircuit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { format } from 'date-fns'

export function AgentWorkflowStatus({ metadata, agentsRun, onRun }: { metadata: any, agentsRun: string[], onRun?: () => void }) {
  const fallbackUsed = metadata?.fallback_used;

  return (
    <div className="space-y-4">
      {fallbackUsed && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-start gap-2 text-amber-800 text-sm">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
          <p><strong>Partial Fallback Used:</strong> Some agents used mock fallback because the live provider was unavailable or returned invalid output.</p>
        </div>
      )}
      <Card className="border-indigo-500/20 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
      <CardHeader className="pb-3 border-b bg-muted/20 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-500" />
            Agentic VC Research Workflow
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Multi-agent intelligence gathering and evaluation.</p>
        </div>
        {onRun && (
          <Button onClick={onRun} className="bg-indigo-600 hover:bg-indigo-700">Run Workflow</Button>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-md bg-white">
            <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Status</div>
            <div className="text-lg font-bold text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4"/> Completed
            </div>
          </div>
          <div className="p-4 border rounded-md bg-white">
            <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Agents Run</div>
            <div className="text-lg font-bold text-foreground">{agentsRun?.length || 0} / 12</div>
          </div>
          <div className="p-4 border rounded-md bg-white">
            <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Mode</div>
            <div className="text-lg font-bold text-foreground capitalize">{metadata?.workflow_mode || "Mock"}</div>
          </div>
          <div className="p-4 border rounded-md bg-white">
            <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Total Sources</div>
            <div className="text-lg font-bold text-foreground">{metadata?.sources_reviewed || 0}</div>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export function AgentTraceTimeline({ trace }: { trace: any[] }) {
  if (!trace || trace.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Agent Timeline</h3>
      <div className="relative border-l-2 border-indigo-100 ml-3 space-y-6">
        {trace.map((step, i) => (
          <div key={i} className="pl-6 relative">
            <div className="absolute w-4 h-4 rounded-full bg-indigo-500 left-[-9px] top-1 border-2 border-white shadow-sm"></div>
            <Card>
              <CardHeader className="py-3 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-sm">{step.agent_name}</span>
                  {step.provider_metadata && step.provider_metadata.provider_used && (
                    <Badge variant="secondary" className="ml-2 text-[10px] uppercase font-mono">
                      {step.provider_metadata.provider_used}
                    </Badge>
                  )}
                  {step.provider_metadata && step.provider_metadata.fallback_used && (
                    <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-200 bg-amber-50 uppercase font-mono">
                      Fallback
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {step.provider_metadata && step.provider_metadata.latency_ms && (
                    <span className="text-xs text-muted-foreground">{step.provider_metadata.latency_ms}ms</span>
                  )}
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {step.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-2">{step.output?.task}</p>
                <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-md font-mono text-xs overflow-auto border border-border/50">
                  {JSON.stringify(step.output?.output, null, 2)}
                </div>
                
                {step.output?.assumptions && step.output.assumptions.length > 0 && (
                  <div className="mt-3 text-xs text-amber-700 bg-amber-50 p-2 rounded flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="font-semibold">Assumptions: </span>
                      {step.output.assumptions.join(" | ")}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RedTeamCritique({ trace }: { trace: any[] }) {
  const redTeamStep = trace?.find(t => t.agent_name === "Red Team")
  if (!redTeamStep) return null
  
  const output = redTeamStep.output?.output || {}
  const objections = output.objections || []
  
  return (
    <Card className="border-red-500/30 shadow-sm overflow-hidden">
      <CardHeader className="bg-red-50 border-b border-red-500/20 pb-3">
        <CardTitle className="flex items-center gap-2 text-red-800 text-lg">
          <ShieldAlert className="w-5 h-5" />
          Red Team Critique
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b">
          <div className="p-4 text-center">
            <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Hype Risk</div>
            <Badge variant="outline" className={`font-bold ${output.hype_risk === 'High' ? 'text-red-600 border-red-200 bg-red-50' : 'text-amber-600 border-amber-200 bg-amber-50'}`}>{output.hype_risk || "Unknown"}</Badge>
          </div>
          <div className="p-4 text-center">
            <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Evidence Risk</div>
            <Badge variant="outline" className={`font-bold ${output.evidence_risk === 'High' ? 'text-red-600 border-red-200 bg-red-50' : 'text-amber-600 border-amber-200 bg-amber-50'}`}>{output.evidence_risk || "Unknown"}</Badge>
          </div>
          <div className="p-4 text-center">
            <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Confidence Score</div>
            <div className="font-bold text-lg">{redTeamStep.output?.confidence || "Unknown"}</div>
          </div>
        </div>
        <div className="p-4 bg-background/50">
          <h4 className="font-semibold text-sm mb-3">Top Objections</h4>
          <ul className="space-y-2">
            {objections.map((obj: string, i: number) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span> {obj}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
