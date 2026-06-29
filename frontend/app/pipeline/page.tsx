"use client";

import React, { useState } from 'react';
import { useGlobalPortfolio } from "@/components/GlobalPortfolioProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateDealHealth } from "@/lib/deal-logic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLUMNS = [
  "New",
  "Research",
  "Partner Review",
  "Due Diligence",
  "Investment Committee",
  "Approved",
  "Passed"
];

export default function KanbanPipeline() {
  const { deals, loading, updateDealStage } = useGlobalPortfolio();
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  if (loading) {
    return <div className="p-12 text-center animate-pulse">Loading Deal Pipeline...</div>;
  }

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDealId(dealId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    if (!draggedDealId) return;
    
    // Find the deal to check if the status is actually changing
    const deal = deals.find(d => d.id.toString() === draggedDealId);
    if (deal && deal.status !== targetColumn) {
      await updateDealStage(draggedDealId, targetColumn);
    }
    
    setDraggedDealId(null);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Deal Pipeline</h1>
          <p className="text-muted-foreground mt-1">Drag and drop to update stages and trigger autonomous workflows.</p>
        </div>
        <Link href="/deals/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            Add New Deal
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {COLUMNS.map(column => {
            const columnDeals = deals.filter(d => (d.status || 'New') === column);
            
            return (
              <div 
                key={column}
                className="w-80 bg-muted/30 rounded-lg border border-border/50 flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column)}
              >
                <div className="p-3 border-b border-border/50 bg-muted/50 rounded-t-lg flex justify-between items-center">
                  <h3 className="font-semibold text-sm">{column}</h3>
                  <Badge variant="secondary" className="text-xs">{columnDeals.length}</Badge>
                </div>
                
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {columnDeals.map(deal => {
                    const health = calculateDealHealth(deal);
                    const score = deal.analysis?.explainable_score?.confidence_score || health.score || 0;
                    
                    return (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id.toString())}
                        className={`bg-card border rounded-md shadow-sm p-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors ${draggedDealId === deal.id.toString() ? 'opacity-50' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/deals/${deal.id}/deal-room`} className="font-bold hover:underline">
                            {deal.startup_name}
                          </Link>
                          <span className={`text-xs font-bold ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {score}/100
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">
                          {deal.sector} &bull; {deal.stage}
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-muted-foreground truncate max-w-[150px]" title={health.mainBlocker}>
                             {health.mainBlocker || "No blockers"}
                           </span>
                           <Link href={`/deals/${deal.id}/deal-room`} className="text-primary hover:text-primary/80">
                             <ArrowRight className="w-4 h-4" />
                           </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
