"use client";

import React, { useState, useEffect } from 'react';
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Target, Activity, RefreshCw, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { RedFlagEngine } from '@/components/RedFlagEngine';
import { DecisionAuditTrail, PortfolioPatternMatch, EvidenceGraphMock } from '@/components/AdvancedIntelligence';
import { api } from "@/lib/api";
import { DealRoomSkeleton } from "@/components/ui/DealRoomSkeleton";
import { TooltipHelper } from "@/components/ui/TooltipHelper";

export default function LivingThesis() {
  const { state, loading } = useGlobalDeal();
  const [thesis, setThesis] = useState<any>(null);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [assumptions, setAssumptions] = useState<any[]>([]);
  const [isLoadingThesis, setIsLoadingThesis] = useState(true);

  const deal = state?.deal;

  useEffect(() => {
    if (deal?.id) {
      fetchThesisData();
    } else if (!loading) {
      setIsLoadingThesis(false);
    }
  }, [deal?.id, loading]);

  const fetchThesisData = async () => {
    setIsLoadingThesis(true);
    try {
      const [brainRes, snapshotsRes, assumptionsRes] = await Promise.all([
        api.get(`/api/deals/${deal?.id}/brain`).catch(() => null),
        api.get(`/api/deals/${deal?.id}/thesis-snapshots`).catch(() => null),
        api.get(`/api/deals/${deal?.id}/assumptions`).catch(() => null)
      ]);
      
      if (brainRes?.thesis) setThesis(brainRes.thesis);
      if (snapshotsRes?.snapshots) setSnapshots(snapshotsRes.snapshots);
      if (assumptionsRes) setAssumptions(assumptionsRes);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingThesis(false);
    }
  };

  if (loading || isLoadingThesis) return <DealRoomSkeleton />;

  let unknowns = [];
  try {
    unknowns = JSON.parse(thesis?.unknowns || "[]");
  } catch(e) {}

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            Living Investment Thesis
          </h1>
          <p className="text-muted-foreground mt-1">Continuously evolving based on new intelligence and assumptions.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={fetchThesisData}>
             <RefreshCw className="w-4 h-4 mr-2" /> Sync Intelligence
           </Button>
           <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">Simulate Scenario</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between text-primary">
              <span className="flex items-center"><Target className="w-4 h-4 mr-2" /> Current Recommendation</span>
              <TooltipHelper content="Synthesized by the Multi-Agent orchestrator based on the current health score." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thesis?.recommendation || "Pending"}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground">
              <span className="flex items-center"><Activity className="w-4 h-4 mr-2" /> AI Conviction</span>
              <TooltipHelper content="The firmness of our recommendation. Low conviction means more diligence is needed to shift the score." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{thesis?.conviction || "Medium"}</div>
          </CardContent>
        </Card>
        
        <Card className="border-indigo-500/20 bg-indigo-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between text-indigo-500">
              <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Deal Health Score</span>
              <TooltipHelper content="Continuously updating Deal Health Score based on new information. A score above 80 indicates strong invest readiness." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-500 flex items-baseline gap-2">
              {thesis?.health_score || 50}/100
              <span className="text-xs font-normal opacity-70">
                ({thesis?.confidence}% Confidence)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-emerald-500/30">
          <CardHeader className="pb-3 border-b border-border/50 bg-emerald-500/5 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-emerald-500">
              <CheckCircle className="w-5 h-5" /> Bull Case
            </CardTitle>
            <TooltipHelper content="What must go right for this to be a venture-scale outlier." />
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm leading-relaxed text-foreground/90">
              {thesis?.bull_case || "No bull case generated yet."}
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/30">
          <CardHeader className="pb-3 border-b border-border/50 bg-red-500/5 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" /> Bear Case
            </CardTitle>
            <TooltipHelper content="The most likely reasons this startup fails or yields a sub-par return." />
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm leading-relaxed text-foreground/90">
              {thesis?.bear_case || "No bear case generated yet."}
            </p>
          </CardContent>
        </Card>
      </div>

      <RedFlagEngine dealId={deal?.id} />

      <Card>
        <CardHeader className="border-b border-border/50">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" /> Key Assumptions
            </CardTitle>
            <Badge variant="secondary">{assumptions.length} Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {assumptions.map(assumption => (
              <div key={assumption.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {assumption.status === 'Validated' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : assumption.status === 'Invalidated' ? (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{assumption.description}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                      <span className="uppercase tracking-wider">Owner: {assumption.owner || 'AI'}</span>
                      <span className="uppercase tracking-wider">Confidence: {assumption.confidence}%</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 pl-4">
                   <Badge variant="outline" className={
                     assumption.status === 'Validated' ? 'border-emerald-500/50 text-emerald-500' :
                     assumption.status === 'Invalidated' ? 'border-red-500/50 text-red-500' :
                     'border-amber-500/50 text-amber-500'
                   }>
                     {assumption.status}
                   </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {unknowns.length > 0 && (
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-3 border-b border-amber-500/20">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-500">
              <HelpCircle className="w-4 h-4" /> Unknowns / Missing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {unknowns.map((u: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2 text-amber-500/80">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                  {u}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <PortfolioPatternMatch />
          <EvidenceGraphMock />
        </div>
        <DecisionAuditTrail logs={snapshots.length > 0 ? snapshots : [
          { created_at: "2026-06-28T10:00:00Z", previous_recommendation: "Monitor", current_recommendation: "Proceed to IC", reason_changed: "Strong cohort retention data received.", confidence_change: 15, evidence_responsible: "Cohort Analysis Data Room Upload" },
          { created_at: "2026-06-25T14:30:00Z", previous_recommendation: "Pending", current_recommendation: "Monitor", reason_changed: "Initial meeting completed. Founder execution score high.", confidence_change: 20, evidence_responsible: "Founder Interview Transcript" }
        ]} />
      </div>

    </div>
  );
}
