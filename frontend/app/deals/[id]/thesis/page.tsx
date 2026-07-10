"use client"

import React, { useState } from "react"
import { useInvestmentCase } from "@/context/InvestmentCaseContext"
import { Assumption } from "@/types/investment-case"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { InvestmentStatus } from "@/components/investment-case/InvestmentStatus"
import { AssumptionRow } from "@/components/investment-case/AssumptionRow"
import { AssumptionDrawer } from "@/components/investment-case/AssumptionDrawer"

export default function ThesisPage() {
  const { investmentCase, isLoading, error } = useInvestmentCase()
  const [selectedAssumption, setSelectedAssumption] = useState<Assumption | null>(null)

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-8 animate-pulse max-w-5xl mx-auto mt-12">
        <div className="h-12 bg-muted/40 rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-muted/30 rounded-lg w-full"></div>
          <div className="h-24 bg-muted/30 rounded-lg w-full"></div>
          <div className="h-24 bg-muted/30 rounded-lg w-full"></div>
        </div>
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

  const {
    analytical_recommendation,
    decision_integrity,
    investment_case_assumptions,
    conflicts,
    diligence
  } = investmentCase

  const categories = Object.keys(investment_case_assumptions || {})

  // Compute critical risks and unknowns
  const allAssumptions = Object.values(investment_case_assumptions).flat()
  const invalidated = allAssumptions.filter(a => a.status === "Invalidated")
  const unverified = allAssumptions.filter(a => a.status === "Unverified")
  
  const confirmedContradictions = conflicts.filter(c => c.status === "CONFIRMED_CONTRADICTION")
  const unresolvedConflicts = conflicts.filter(c => c.status !== "RESOLVED")
  
  const openTasks = diligence.tasks.filter(t => t.status !== "COMPLETED")

  const blockers = decision_integrity?.blocking_conditions || []

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* CURRENT INVESTMENT POSITION */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">
          Current Investment Position
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-muted/30">
            <CardHeader className="py-4">
              <CardTitle className="text-sm text-muted-foreground">System Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {analytical_recommendation?.value || "TBD"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Status: {analytical_recommendation?.status || "Draft"}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/30">
            <CardHeader className="py-4">
              <CardTitle className="text-sm text-muted-foreground">Decision Integrity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <InvestmentStatus status={decision_integrity?.status} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader className="py-4">
              <CardTitle className="text-sm text-muted-foreground">Unresolved Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-orange-600">
                {unresolvedConflicts.length} Conflicts
              </div>
              <p className="text-xs text-muted-foreground mt-1">{openTasks.length} Open Diligence Tasks</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CRITICAL RISKS & UNKNOWNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-red-700 border-b border-red-200 pb-2">
            Critical Risks
          </h2>
          <div className="space-y-2 text-sm">
            {blockers.map((b, i) => (
              <p key={`blocker-${i}`} className="text-red-600 font-medium">• {b.description || b.message || b}</p>
            ))}
            {invalidated.map(a => (
              <p key={`inv-${a.id}`} className="text-red-600">• Invalidated: {a.statement}</p>
            ))}
            {confirmedContradictions.map(c => (
              <p key={`contr-${c.id}`} className="text-red-600">• Confirmed Contradiction #{c.id}</p>
            ))}
            {blockers.length === 0 && invalidated.length === 0 && confirmedContradictions.length === 0 && (
              <p className="text-muted-foreground italic">No confirmed critical risks found in reasoning state.</p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-700 border-b border-orange-200 pb-2">
            Critical Unknowns
          </h2>
          <div className="space-y-2 text-sm">
            {unverified.map(a => (
              <p key={`unv-${a.id}`} className="text-orange-600">• Unverified: {a.statement}</p>
            ))}
            {unresolvedConflicts.map(c => (
              <p key={`unc-${c.id}`} className="text-orange-600">• Unresolved Conflict #{c.id}</p>
            ))}
            {unverified.length === 0 && unresolvedConflicts.length === 0 && (
              <p className="text-muted-foreground italic">No major unknowns identified.</p>
            )}
          </div>
        </section>
      </div>

      {/* INVESTMENT CASE BY DOMAIN */}
      <section className="space-y-6 pt-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">
          Investment Case By Domain
        </h2>
        
        {categories.length === 0 && (
          <p className="text-muted-foreground italic">No critical assumptions have been recorded for this investment case.</p>
        )}

        {categories.map((category) => (
          <div key={category} className="border rounded-md bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{category}</h3>
            </div>
            <div className="divide-y divide-border">
              {investment_case_assumptions[category].map(assumption => (
                <AssumptionRow
                  key={assumption.id}
                  assumption={assumption}
                  allConflicts={conflicts}
                  allTasks={diligence.tasks}
                  onClick={() => setSelectedAssumption(assumption)}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <AssumptionDrawer
        isOpen={selectedAssumption !== null}
        onClose={() => setSelectedAssumption(null)}
        assumption={selectedAssumption}
        allConflicts={conflicts}
        allTasks={diligence.tasks}
        allFindings={diligence.findings}
      />
    </div>
  )
}
