"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useInvestmentCase } from "@/context/InvestmentCaseContext"
import { InvestmentCaseService } from "@/services/investment-case"
import { Loader2, Plus, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InvestmentStatus } from "@/components/investment-case/InvestmentStatus"
import { ClaimLinkModal } from "@/components/investment-case/ClaimLinkModal"
import { ConflictLogModal } from "@/components/investment-case/ConflictLogModal"

export default function EvidencePage() {
  const params = useParams()
  const dealId = params.id as string
  const { investmentCase, isLoading: isCaseLoading } = useInvestmentCase()
  
  const [allClaims, setAllClaims] = useState<any[]>([])
  const [isLoadingClaims, setIsLoadingClaims] = useState(true)
  
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false)

  useEffect(() => {
    setIsLoadingClaims(true)
    InvestmentCaseService.getClaimInventory(dealId)
      .then(setAllClaims)
      .catch(console.error)
      .finally(() => setIsLoadingClaims(false))
  }, [dealId])

  if (isCaseLoading || isLoadingClaims) {
    return (
      <div className="flex flex-col space-y-8 animate-pulse max-w-6xl mx-auto mt-12">
        <div className="h-12 bg-muted/40 rounded-lg w-1/3"></div>
        <div className="h-12 bg-muted/40 rounded-lg w-full"></div>
        <div className="h-64 bg-muted/30 rounded-lg w-full"></div>
      </div>
    )
  }

  if (!investmentCase) return null

  // Build a lookup map of claims from canonical state
  // We need to know: Linked Assumption, Relationship, Conflict Status
  const claimMetadata: Record<number, {
    assumptionId?: number;
    assumptionStatement?: string;
    relationship?: string;
    conflicts: any[];
  }> = {}

  // Process Assumptions
  Object.values(investmentCase.investment_case_assumptions).flat().forEach(a => {
    a.claims.forEach(link => {
      if (!claimMetadata[link.claim_id]) {
        claimMetadata[link.claim_id] = { conflicts: [] }
      }
      claimMetadata[link.claim_id].assumptionId = a.id
      claimMetadata[link.claim_id].assumptionStatement = a.statement
      claimMetadata[link.claim_id].relationship = link.relationship
    })
  })

  // Process Conflicts
  investmentCase.conflicts.forEach(c => {
    [c.claim_a_id, c.claim_b_id].forEach(cid => {
      if (!claimMetadata[cid]) {
        claimMetadata[cid] = { conflicts: [] }
      }
      claimMetadata[cid].conflicts.push(c)
    })
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Evidence Registry</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Canonical record of extracted claims, their links to critical assumptions, and identified conflicts.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsConflictModalOpen(true)}>
            <AlertTriangleIcon className="w-4 h-4 mr-2" /> Log Conflict
          </Button>
          <Button onClick={() => setIsLinkModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Link Claim
          </Button>
        </div>
      </div>

      {allClaims.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground italic border rounded-md bg-card shadow-sm">
          No claims have been extracted for this investment case.
        </div>
      ) : (
        <div className="border rounded-md bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 font-semibold">Claim (Evidence)</th>
                  <th className="px-4 py-3 font-semibold">Position</th>
                  <th className="px-4 py-3 font-semibold w-1/4">Linked Assumption</th>
                  <th className="px-4 py-3 font-semibold">Conflict State</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allClaims.map(claim => {
                  const meta = claimMetadata[claim.id]
                  const hasConflicts = meta?.conflicts && meta.conflicts.length > 0
                  
                  return (
                    <tr key={claim.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-foreground max-w-sm">
                        {claim.statement}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {meta?.relationship ? (
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            meta.relationship === "SUPPORTS" ? "bg-green-100 text-green-800" :
                            meta.relationship === "CONTRADICTS" ? "bg-red-100 text-red-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {meta.relationship}
                          </span>
                        ) : (
                          <span className="bg-muted px-2 py-1 rounded text-xs font-semibold text-muted-foreground uppercase">
                            NOT YET LINKED
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground truncate max-w-xs" title={meta?.assumptionStatement}>
                        {meta?.assumptionStatement ? meta.assumptionStatement : (
                          <Button variant="link" className="p-0 h-auto text-xs text-primary" onClick={() => setIsLinkModalOpen(true)}>
                            + Link to Assumption
                          </Button>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {hasConflicts ? (
                          <div className="space-y-1">
                            {meta.conflicts.map(c => (
                              <InvestmentStatus key={c.id} status={c.status} />
                            ))}
                          </div>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {claim.document_id ? (
                          <div className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate w-24">Doc #{claim.document_id}</span>
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </div>
                        ) : "Unknown"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ClaimLinkModal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} decisionId={dealId} />
      <ConflictLogModal isOpen={isConflictModalOpen} onClose={() => setIsConflictModalOpen(false)} decisionId={dealId} />
    </div>
  )
}

function AlertTriangleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
