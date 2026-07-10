"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { DealsService } from "@/services/deals"
import { Deal } from "@/types"
import { Button } from "@/components/ui/button"
import { Activity, Plus, FileText, BarChart, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function DealsPipeline() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    DealsService.getDeals()
      .then((data) => setDeals(data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground p-12">
        <Activity className="w-8 h-8 animate-pulse text-primary mb-4" />
        <p className="font-medium">Loading Pipeline...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Deal Pipeline</h1>
          <p className="text-muted-foreground text-lg mt-1">All active evaluation workflows</p>
        </div>
        <Link href="/deals/new">
          <Button className="font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Deal
          </Button>
        </Link>
      </div>

      {deals.length === 0 ? (
        <Card className="border-dashed bg-muted/30">
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">Pipeline Empty</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              No active deals found. Create a new deal to begin.
            </p>
            <Link href="/deals/new">
              <Button>Add Deal</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase tracking-wider text-xs border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Deal Name</th>
                <th className="px-6 py-4 font-semibold">Stage</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {deals.map(deal => (
                <tr key={deal.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-base">
                    {deal.startup_name || `Deal ${deal.id}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-semibold">
                      {deal.stage || "Review"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="font-medium text-emerald-600">Active</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/deals/${deal.id}`}>
                      <Button variant="ghost" size="sm" className="font-bold">
                        Open <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
