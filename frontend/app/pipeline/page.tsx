"use client";

import React, { useState, useEffect } from 'react';
import { useGlobalPortfolio } from "@/components/GlobalPortfolioProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Skeleton } from "@/components/ui/skeleton";
import { calculateDealHealth } from "@/lib/deal-logic";
import { Search, Plus, Filter, LayoutGrid, List, AlertCircle, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { TooltipHelper } from "@/components/ui/TooltipHelper";
import { Deal } from "@/types";

const COLUMNS = [
  "New",
  "Research",
  "Partner Review",
  "Due Diligence",
  "Investment Committee",
  "Approved",
  "Passed"
];

// Mock properties to enrich the UI since backend doesn't support these yet
const getMockEnrichment = (deal: Deal) => {
  const isHighPriority = deal.id % 3 === 0;
  const isUrgent = deal.id % 5 === 0;
  const owners = ["Alex (GP)", "Sarah (Principal)", "David (Analyst)"];
  const owner = owners[deal.id % owners.length];
  const daysInStage = (deal.id * 3) % 14;
  return { isHighPriority, isUrgent, owner, daysInStage };
};

export default function KanbanPipeline() {
  const { deals, loading, updateDealStage } = useGlobalPortfolio();
  const [localDeals, setLocalDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState("");

  // Sync with global state
  useEffect(() => {
    if (!loading) {
      setLocalDeals(deals);
    }
  }, [deals, loading]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic UI update
    const dealId = parseInt(draggableId.replace('deal-', ''));
    const targetColumn = destination.droppableId;
    
    setLocalDeals(prev => prev.map(d => 
      d.id === dealId ? { ...d, status: targetColumn } : d
    ));

    // Call API (Global context)
    try {
      await updateDealStage(dealId.toString(), targetColumn);
    } catch (e) {
      // Revert on error
      setLocalDeals(deals);
      console.error("Failed to update deal stage", e);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6 bg-muted/10 h-full">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="flex gap-6 overflow-hidden h-[calc(100vh-200px)]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col w-80 shrink-0 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredDeals = localDeals.filter(d => 
    d.startup_name.toLowerCase().includes(search.toLowerCase()) || 
    (d.sector && d.sector.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-muted/10">
      
import { PipelineCharts } from "@/components/dashboard/PipelineCharts";

// ... existing code ...

export default function KanbanPipeline() {
  const { deals, loading, updateDealStage } = useGlobalPortfolio();
  const [localDeals, setLocalDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"board" | "dashboard">("board");

  // Sync with global state
// ...

  return (
    <div className="flex flex-col h-full bg-muted/10">
      
      {/* Header & Controls */}
      <div className="px-6 py-6 border-b bg-background shadow-sm z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deal CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage the investment pipeline from sourcing to IC.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-muted p-1 rounded-md flex">
            <button 
              onClick={() => setViewMode("board")}
              className={`px-3 py-1 text-sm rounded-sm font-medium ${viewMode === 'board' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Board
            </button>
            <button 
              onClick={() => setViewMode("dashboard")}
              className={`px-3 py-1 text-sm rounded-sm font-medium ${viewMode === 'dashboard' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Dashboard
            </button>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search companies, sectors..." 
              className="pl-9 bg-muted/50 border-border/50" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="hidden md:flex shadow-sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Link href="/deals/new">
            <Button className="shadow-sm"><Plus className="w-4 h-4 mr-2" /> New Deal</Button>
          </Link>
        </div>
      </div>

      {viewMode === "dashboard" ? (
        <div className="p-6 overflow-y-auto">
          <PipelineCharts deals={localDeals} />
        </div>
      ) : (
        <>
          {/* Pipeline Funnel Dashboard */}
          <div className="px-6 pt-6 pb-2">
            <div className="bg-background rounded-xl border border-border/50 shadow-sm p-4 flex items-center justify-between">
              {[
                { label: "Sourced", columns: ["New", "Research"], color: "bg-blue-500" },
                { label: "Diligence", columns: ["Partner Review", "Due Diligence"], color: "bg-indigo-500" },
                { label: "Committee", columns: ["Investment Committee"], color: "bg-amber-500" },
                { label: "Portfolio", columns: ["Approved"], color: "bg-emerald-500" },
              ].map((stage, i, arr) => {
                const count = localDeals.filter(d => stage.columns.includes(d.status || 'New')).length;
                return (
                  <React.Fragment key={stage.label}>
                    <div className="flex-1 flex flex-col items-center text-center group">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{stage.label}</span>
                      <div className={`w-12 h-12 rounded-full ${stage.color}/10 border border-${stage.color}/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform`}>
                        <span className={`text-lg font-bold text-${stage.color.replace('bg-', '')}`}>{count}</span>
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex-shrink-0 text-muted-foreground/30">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 pt-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start">
            {COLUMNS.map(column => {
              const columnDeals = filteredDeals.filter(d => (d.status || 'New') === column);
              
              return (
                <div key={column} className="flex flex-col w-[320px] shrink-0 h-full">
                  
                  {/* Column Header */}
                  <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-semibold text-[13px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      {column} 
                      <span className="flex h-5 items-center rounded-full bg-muted px-2 text-xs font-medium text-foreground">
                        {columnDeals.length}
                      </span>
                    </h3>
                  </div>
                  
                  {/* Droppable Area */}
                  <Droppable droppableId={column}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 rounded-xl transition-colors duration-200 overflow-y-auto min-h-[150px] p-2 -mx-2 space-y-3 ${
                          snapshot.isDraggingOver ? 'bg-primary/5 border border-primary/20 border-dashed' : 'bg-transparent'
                        }`}
                      >
                        {columnDeals.map((deal, index) => {
                          const health = calculateDealHealth(deal);
                          const { isHighPriority, isUrgent, owner, daysInStage } = getMockEnrichment(deal);

                          return (
                            <Draggable key={deal.id} draggableId={`deal-${deal.id}`} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-card rounded-lg border p-4 shadow-sm group hover:border-primary/40 transition-all ${
                                    snapshot.isDragging ? 'shadow-xl scale-105 border-primary/50 rotate-2' : 'border-border/50'
                                  }`}
                                  style={{...provided.draggableProps.style}}
                                >
                                  {/* Top badges */}
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex gap-1.5 flex-wrap">
                                      {deal.sector && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground">{deal.sector}</Badge>}
                                      {isUrgent && <Badge variant="destructive" className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-600 border-0 dark:text-red-400">Urgent</Badge>}
                                    </div>
                                    <div className="text-[10px] font-medium text-muted-foreground flex items-center">
                                      <Clock className="w-3 h-3 mr-1" /> {daysInStage}d
                                    </div>
                                  </div>

                                  {/* Core Info */}
                                  <Link href={`/deals/${deal.id}/deal-room`} className="block group-hover:text-primary transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="w-8 h-8 rounded bg-gradient-to-br from-muted to-muted/50 border flex items-center justify-center font-bold text-sm text-foreground">
                                        {deal.startup_name.charAt(0)}
                                      </div>
                                      <h4 className="font-bold text-sm leading-tight">{deal.startup_name}</h4>
                                    </div>
                                  </Link>
                                  
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                                    {deal.description || "A stealth startup operating in the technology sector with strong founders."}
                                  </p>

                                  {/* Footer: Owner and Score */}
                                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                                        {owner.charAt(0)}
                                      </div>
                                      <span className="text-[10px] font-medium text-muted-foreground">{owner.split(' ')[0]}</span>
                                    </div>
                                    
                                    <div className="flex items-center">
                                      <TooltipHelper content={`This deal scored ${health.score}/100. Factors: Team pedigree, market traction, and deal dynamics. The AI considers this a ${health.color === 'emerald' ? 'strong' : health.color === 'amber' ? 'moderate' : 'risky'} prospect.`}>
                                        <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                          health.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                          health.color === 'amber' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                          'bg-destructive/10 text-destructive'
                                        }`}>
                                          <CheckCircle2 className="w-3 h-3" />
                                          {health.score}
                                        </div>
                                      </TooltipHelper>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
        </DragDropContext>
      </div>
      </>
      )}
    </div>
  );
}
