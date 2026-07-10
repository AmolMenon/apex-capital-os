"use client"

import React from "react"
import { useInvestmentCase } from "@/context/InvestmentCaseContext"
import { Loader2, CheckCircle, XCircle, HelpCircle, ArrowRight, ExternalLink } from "lucide-react"
import { InvestmentStatus } from "@/components/investment-case/InvestmentStatus"
import Link from "next/link"

export default function OverviewPage({ params }: { params: { id: string } }) {
  const { investmentCase, isLoading, error } = useInvestmentCase()

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-8 animate-pulse max-w-5xl mx-auto mt-12">
        <div className="h-24 bg-muted/40 rounded-lg w-full"></div>
        <div className="h-64 bg-muted/30 rounded-lg w-full"></div>
      </div>
    )
  }

  if (error || !investmentCase) {
    return (
      <div className="flex h-[400px] items-center justify-center text-red-500">
        Failed to load connected investment case.
      </div>
    )
  }

  const { investment_case_assumptions, conflicts, diligence, decision_integrity, analytical_recommendation, human_decision } = investmentCase

  const allAssumptions = Object.values(investment_case_assumptions).flat()

  // Deterministic Ordering: Backend order (ID ascending)
  const whyInvest = allAssumptions.filter(a => a.status === "Verified").sort((a,b) => a.id - b.id)
  const invalidated = allAssumptions.filter(a => a.status === "Invalidated").sort((a,b) => a.id - b.id)
  const confirmedContradictions = conflicts.filter(c => c.status === "CONFIRMED_CONTRADICTION").sort((a,b) => a.id - b.id)
  const unverified = allAssumptions.filter(a => a.status === "Unverified").sort((a,b) => a.id - b.id)
  const openConflicts = conflicts.filter(c => c.status !== "RESOLVED" && c.status !== "CONFIRMED_CONTRADICTION").sort((a,b) => a.id - b.id)
  const openTasks = diligence.tasks.filter(t => t.status !== "COMPLETED").sort((a,b) => a.id - b.id)

  const numSupported = whyInvest.length
  const numInvalidated = invalidated.length

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* Top Level Recommendation */}
      <div className="bg-card border-b pb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Current Recommendation</h2>
            <div className="text-2xl font-bold text-foreground">
              {analytical_recommendation?.value || "Awaiting Further Analysis"}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Status: {analytical_recommendation?.status || "Draft"}</p>
          </div>
          <div className="text-left md:text-right">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Decision Integrity</h2>
            <InvestmentStatus status={decision_integrity?.status} className="mt-1" />
          </div>
          {human_decision && human_decision.value && (
            <div className="text-left md:text-right">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Human Decision</h2>
              <div className="text-lg font-bold text-primary">{human_decision.value}</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        
        {/* WHY INVEST? */}
        <section>
          <h3 className="text-sm font-bold flex items-center gap-2 text-green-800 uppercase tracking-wider border-b pb-2 mb-4">
            <CheckCircle className="w-4 h-4" /> Why Invest?
          </h3>
          <div className="space-y-3">
            {whyInvest.length > 0 ? (
              whyInvest.map(a => (
                <div key={`inv-${a.id}`} className="text-sm text-foreground flex items-start gap-2 leading-relaxed">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>{a.statement}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">No verified critical assumptions.</p>
            )}
          </div>
        </section>

        {/* WHY NOT INVEST? */}
        <section>
          <h3 className="text-sm font-bold flex items-center gap-2 text-red-800 uppercase tracking-wider border-b pb-2 mb-4">
            <XCircle className="w-4 h-4" /> Why Not Invest?
          </h3>
          <div className="space-y-3">
            {invalidated.map(a => (
              <div key={`not-${a.id}`} className="text-sm text-foreground flex items-start gap-2 leading-relaxed">
                <span className="text-red-600 mt-0.5">•</span>
                <span>[Invalidated] {a.statement}</span>
              </div>
            ))}
            {confirmedContradictions.map(c => (
              <div key={`con-${c.id}`} className="text-sm text-foreground flex items-start gap-2 leading-relaxed">
                <span className="text-red-600 mt-0.5">•</span>
                <span>[Confirmed Contradiction] Conflict #{c.id}</span>
              </div>
            ))}
            {invalidated.length === 0 && confirmedContradictions.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No critical risks confirmed.</p>
            )}
          </div>
        </section>

        {/* CRITICAL UNKNOWNS */}
        <section>
          <h3 className="text-sm font-bold flex items-center gap-2 text-orange-800 uppercase tracking-wider border-b pb-2 mb-4">
            <HelpCircle className="w-4 h-4" /> Critical Unknowns
          </h3>
          <div className="space-y-3">
            {unverified.map(a => (
              <div key={`unk-${a.id}`} className="text-sm text-foreground flex items-start gap-2 leading-relaxed">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>[Unverified] {a.statement}</span>
              </div>
            ))}
            {openConflicts.map(c => (
              <div key={`opc-${c.id}`} className="text-sm text-foreground flex items-start gap-2 leading-relaxed">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>[Open Conflict] Conflict #{c.id} between claims {c.claim_a_id} and {c.claim_b_id}</span>
              </div>
            ))}
            {unverified.length === 0 && openConflicts.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No major unknowns identified.</p>
            )}
          </div>
        </section>

        {/* WHAT SHOULD WE DO NEXT? */}
        <section>
          <h3 className="text-sm font-bold flex items-center gap-2 text-blue-800 uppercase tracking-wider border-b pb-2 mb-4">
            <ArrowRight className="w-4 h-4" /> Next Actions
          </h3>
          <div className="space-y-3">
            {openTasks.map(t => (
              <div key={`tsk-${t.id}`} className="text-sm text-foreground flex items-start gap-2 leading-relaxed">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Complete Diligence Task #{t.id} (Target: {t.target_type} #{t.target_id})</span>
              </div>
            ))}
            {openTasks.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No open diligence tasks.</p>
            )}
          </div>
        </section>

      </div>

      {/* CURRENT REASONING STATE SUMMARY */}
      <div className="pt-8 mt-8 border-t">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Current Reasoning State</h3>
        <div className="flex flex-wrap gap-6 text-sm">
          <Link href={`/deals/${params.id}/thesis`} className="flex items-center gap-2 hover:text-primary transition-colors text-muted-foreground">
            <span className="font-semibold text-foreground">{allAssumptions.length}</span> Assumptions
            <span className="text-xs opacity-70">({numSupported} supported · {numInvalidated} invalidated)</span>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </Link>
          
          <Link href={`/deals/${params.id}/evidence`} className="flex items-center gap-2 hover:text-primary transition-colors text-muted-foreground">
            <span className="font-semibold text-foreground">{openConflicts.length}</span> Unresolved Conflicts
            <ExternalLink className="w-3 h-3 opacity-50" />
          </Link>
          
          <Link href={`/deals/${params.id}/diligence`} className="flex items-center gap-2 hover:text-primary transition-colors text-muted-foreground">
            <span className="font-semibold text-foreground">{openTasks.length}</span> Open Diligence
            <span className="text-xs opacity-70">({diligence.tasks.length - openTasks.length} completed)</span>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </Link>
        </div>
      </div>

    </div>
  )
}
