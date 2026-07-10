"use client"

import React, { useState, useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { DealsService } from "@/services/deals"
import { InvestmentCaseProvider } from "@/context/InvestmentCaseContext"

export default function DealWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const dealId = params.id as string
  const [deal, setDeal] = useState<any>(null)
  
  useEffect(() => {
    DealsService.getDeal(dealId).then(setDeal).catch(console.error)
  }, [dealId])

  const subjectName = deal?.subject?.name || deal?.title || deal?.name || "Loading..."
  const metadata = deal?.subject?.metadata_json ? JSON.parse(deal.subject.metadata_json) : {}

  const navItems = [
    { name: "Overview", path: "" },
    { name: "Thesis", path: "/thesis" },
    { name: "Evidence", path: "/evidence" },
    { name: "Diligence", path: "/diligence" },
    { name: "IC Workspace", path: "/ic" }
  ]

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 bg-background text-foreground">
      
      {/* Persistent Deal Header */}
      <header className="flex flex-col gap-6 px-6 py-6 border-b bg-card">
        <div className="flex justify-between items-start w-full">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">{subjectName}</h1>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Sector</span>
              <span className="text-sm font-semibold">{metadata.sector || "Enterprise AI"}</span>
              <span className="text-muted-foreground/30">|</span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Stage</span>
              <span className="text-sm font-semibold">{metadata.stage || "Series A"}</span>
              <span className="text-muted-foreground/30">|</span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Round</span>
              <span className="text-sm font-semibold">{metadata.round_size || "$15M"}</span>
            </div>
          </div>
        </div>
        
        {/* Deal Navigation Tabs */}
        <div className="flex justify-start w-full border-b">
          <nav className="flex space-x-6">
            {navItems.map((item) => {
              const href = `/deals/${dealId}${item.path}`
              const isActive = pathname === href || (item.path !== "" && pathname.startsWith(href))
              return (
                <Link
                  key={item.name}
                  href={href}
                  className={`py-3 text-sm font-medium transition-all border-b-2 ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
        <InvestmentCaseProvider decisionId={dealId}>
          {children}
        </InvestmentCaseProvider>
      </main>
      
    </div>
  )
}
