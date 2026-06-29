"use client";

import React, { useState } from 'react';
import { useGlobalPortfolio } from "@/components/GlobalPortfolioProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Scale, Plus, X } from "lucide-react";
import { calculateDealHealth } from "@/lib/deal-logic";

export default function ComparePage() {
  const { deals, loading } = useGlobalPortfolio();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // Initialize with top 3 non-passed deals if empty and deals loaded
  React.useEffect(() => {
    if (deals.length > 0 && selectedIds.length === 0) {
      const topDeals = deals.filter(d => d.status !== 'Passed').slice(0, 3).map(d => d.id);
      setSelectedIds(topDeals);
    }
  }, [deals]);

  if (loading) return <div className="p-12 text-center animate-pulse">Loading Deals...</div>;

  const activeDeals = deals.filter(d => selectedIds.includes(d.id));
  const availableDeals = deals.filter(d => !selectedIds.includes(d.id));

  const toggleDeal = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  return (
    <div className="flex-1 p-8 pt-6 space-y-8 pb-20 bg-muted/10 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Deal Comparison</h1>
          <p className="text-muted-foreground mt-1">Cross-evaluating priority opportunities</p>
        </div>
        <Button variant="outline" onClick={() => setIsSelecting(!isSelecting)}>
          {isSelecting ? "Done Selecting" : "Modify Selection"}
        </Button>
      </div>

      {isSelecting && (
        <Card className="bg-muted/30 border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Select deals to compare (Max 4)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {deals.map(d => {
                const isSelected = selectedIds.includes(d.id);
                return (
                  <Badge 
                    key={d.id} 
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1 px-3"
                    onClick={() => toggleDeal(d.id)}
                  >
                    {d.startup_name} {isSelected && <X className="w-3 h-3 ml-2" />}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {activeDeals.length > 0 ? (
        <>
          <div className="bg-primary/5 border border-primary/20 rounded-md p-6 shadow-sm">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-2"><Scale className="w-5 h-5" /> AI Partner Synthesis</h3>
            <p className="text-sm font-serif leading-relaxed text-foreground/90">
              Based on the selected subset, <strong>{activeDeals[0]?.startup_name}</strong> presents the highest probability of power-law returns due to its team and market size. However, {activeDeals[1] ? <strong>{activeDeals[1].startup_name}</strong> : 'the others'} may offer a shorter time to liquidity. 
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-6 min-w-max">
              <div className="w-48 space-y-4 pt-[72px] shrink-0">
                <div className="h-20 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">Recommendation</div>
                <div className="h-16 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">Apex Score</div>
                <div className="h-16 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">Confidence</div>
                <div className="h-16 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">Stage</div>
                <div className="h-24 flex items-center font-bold text-sm text-muted-foreground uppercase tracking-wider border-b">Main Risk</div>
              </div>

              {activeDeals.map(d => {
                const health = calculateDealHealth(d);
                const score = d.analysis?.explainable_score?.confidence_score || health.score || '--';
                const confidence = d.analysis?.explainable_score?.confidence || 'Medium';
                const mainRisk = health.mainBlocker || d.analysis?.risks?.[0]?.description || "Unvalidated GTM";

                return (
                  <Card key={d.id} className="w-80 shrink-0 relative flex flex-col">
                    <CardHeader className="border-b bg-card pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-bold truncate pr-4">{d.startup_name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{d.sector}</p>
                        </div>
                        {isSelecting && (
                          <Button variant="ghost" size="icon" className="h-6 w-6 -mt-2 -mr-2" onClick={() => toggleDeal(d.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                      <div className="h-20 p-4 border-b flex items-center justify-center">
                        <Badge variant={health.recommendation.includes("IC Ready") || health.recommendation.includes("Approved") ? "default" : "secondary"}>{health.recommendation}</Badge>
                      </div>
                      <div className="h-16 p-4 border-b flex items-center justify-center text-2xl font-bold">
                        {score}
                      </div>
                      <div className="h-16 p-4 border-b flex items-center justify-center font-semibold text-primary">
                        {confidence}
                      </div>
                      <div className="h-16 p-4 border-b flex items-center justify-center font-medium">
                        {d.stage}
                      </div>
                      <div className="h-24 p-4 border-b flex items-center justify-center text-sm text-center text-muted-foreground">
                        {mainRisk}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="p-12 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
          No deals selected for comparison.
        </div>
      )}
    </div>
  );
}
