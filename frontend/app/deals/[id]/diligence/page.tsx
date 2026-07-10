"use client"

import React, { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { useInvestmentCase } from "@/context/InvestmentCaseContext"
import { InvestmentCaseService } from "@/services/investment-case"
import { Loader2, Play, CheckCircle2, Clock, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InvestmentStatus } from "@/components/investment-case/InvestmentStatus"
import { FindingDisplay } from "@/components/investment-case/FindingDisplay"

export default function DiligencePage() {
  const params = useParams()
  const dealId = params.id as string
  const { investmentCase, isLoading, error, refreshInvestmentCase } = useInvestmentCase()
  
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evalError, setEvalError] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-8 animate-pulse max-w-4xl mx-auto mt-12">
        <div className="h-12 bg-muted/40 rounded-lg w-1/3"></div>
        <div className="h-40 bg-muted/30 rounded-lg w-full"></div>
        <div className="h-40 bg-muted/30 rounded-lg w-full"></div>
      </div>
    )
  }

  if (error || !investmentCase) {
    return (
      <div className="flex h-[400px] items-center justify-center text-red-500">
        Failed to load investment case.
      </div>
    )
  }

  const { tasks, findings } = investmentCase.diligence

  const pendingTasks = tasks.filter(t => t.status === "PENDING")
  const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS")
  const completedTasks = tasks.filter(t => t.status === "COMPLETED" || t.status === "FAILED")

  const [pollAttempts, setPollAttempts] = useState(0)
  const MAX_POLL_ATTEMPTS = 15 // 15 attempts * 2s = 30s
  const pollTimer = useRef<NodeJS.Timeout | null>(null)

  const startPolling = () => {
    if (pollTimer.current) clearInterval(pollTimer.current)
    setPollAttempts(0)
    
    pollTimer.current = setInterval(async () => {
      try {
        setPollAttempts(prev => prev + 1)
        const res = await InvestmentCaseService.getDiligenceStatus(dealId)
        
        if (res.status === "COMPLETED") {
          if (pollTimer.current) clearInterval(pollTimer.current)
          await refreshInvestmentCase()
          setIsEvaluating(false)
        } else if (res.status === "FAILED") {
          if (pollTimer.current) clearInterval(pollTimer.current)
          setEvalError("Analysis failed. Please try again.")
          setIsEvaluating(false)
        }
      } catch (err) {
        // Continue polling on error unless we hit the limit
      }
    }, 2000)
  }

  useEffect(() => {
    if (pollAttempts >= MAX_POLL_ATTEMPTS) {
      if (pollTimer.current) clearInterval(pollTimer.current)
      setEvalError("Analysis is taking longer than expected. Please check back later.")
      setIsEvaluating(false)
    }
  }, [pollAttempts])

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current)
    }
  }, [])

  const handleEvaluate = async () => {
    try {
      setIsEvaluating(true)
      setEvalError(null)
      await InvestmentCaseService.runDiligenceAnalysis(dealId)
      await refreshInvestmentCase()
      setIsEvaluating(false)
    } catch (err: any) {
      const status = err.response?.status
      if (status === 504 || status === 409 || status === 503) {
        // Ambiguous timeout or conflict, switch to polling
        startPolling()
      } else {
        setEvalError(err.response?.data?.detail || err.message || "Evaluation failed.")
        setIsEvaluating(false)
      }
    }
  }

  const renderTask = (t: any) => {
    const taskFindings = findings.filter(f => f.task_id === t.id)
    
    // Attempt to reconstruct "Why this matters" from the target
    let triggerReason = `Triggered by ${t.target_type} #${t.target_id}`
    if (t.target_type === "EvidenceConflict") {
      triggerReason = `Triggered by an unresolved evidence conflict`
    } else if (t.target_type === "Assumption") {
      triggerReason = `Triggered to verify an investment case assumption`
    }

    return (
      <div key={t.id} className="border rounded-md bg-card shadow-sm p-4 mb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-base font-semibold text-foreground">Task #{t.id}</h3>
            <p className="text-sm text-muted-foreground mt-1">Why this matters: {triggerReason}</p>
          </div>
          <InvestmentStatus status={t.status} />
        </div>
        
        {taskFindings.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Findings</h4>
            <div className="space-y-3">
              {taskFindings.map(f => (
                <FindingDisplay key={f.id} finding={f} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Diligence Workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and resolve diligence questions triggered by evidence conflicts and unverified assumptions.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button onClick={handleEvaluate} disabled={isEvaluating} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2 fill-current" />}
            {isEvaluating ? "Evaluating..." : "Run Diligence Analysis"}
          </Button>
          {evalError && <span className="text-xs text-red-500 max-w-[200px] text-right">{evalError}</span>}
        </div>
      </div>

      {isEvaluating && (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex flex-col items-center justify-center text-blue-800 space-y-2 py-8 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
          <p className="font-bold">Diligence analysis is running.</p>
          <p className="text-sm">This may take a moment while evidence conflicts and assumptions are being reviewed.</p>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground italic border rounded-md bg-card shadow-sm">
          No active diligence questions are linked to the current investment case.
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* PENDING / OPEN */}
          <section>
            <h2 className="text-sm font-bold flex items-center gap-2 mb-4 uppercase tracking-wider text-muted-foreground">
              <HelpCircle className="w-4 h-4 text-orange-500" /> Open Questions ({pendingTasks.length})
            </h2>
            {pendingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No open questions.</p>
            ) : (
              <div className="space-y-4">
                {pendingTasks.map(renderTask)}
              </div>
            )}
          </section>

          {/* IN PROGRESS */}
          {inProgressTasks.length > 0 && (
            <section>
              <h2 className="text-sm font-bold flex items-center gap-2 mb-4 uppercase tracking-wider text-muted-foreground">
                <Clock className="w-4 h-4 text-blue-500" /> In Progress ({inProgressTasks.length})
              </h2>
              <div className="space-y-4">
                {inProgressTasks.map(renderTask)}
              </div>
            </section>
          )}

          {/* COMPLETED */}
          <section>
            <h2 className="text-sm font-bold flex items-center gap-2 mb-4 uppercase tracking-wider text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Completed ({completedTasks.length})
            </h2>
            {completedTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No completed questions.</p>
            ) : (
              <div className="space-y-4 opacity-80">
                {completedTasks.map(renderTask)}
              </div>
            )}
          </section>

        </div>
      )}
    </div>
  )
}
