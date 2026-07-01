"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import ResearchBriefPage from "../research/index";
import DeckIntelligencePage from "../deck/index";
import EvidenceCenterPage from "../evidence-center/index";
import PlatformDiligencePage from "../platform-diligence/index";

export default function EvaluateDealPage() {
  const { state, loading } = useGlobalDeal();

  if (loading || !state) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluate</h1>
          <p className="text-muted-foreground mt-1">
            Research, verify claims, analyze the deck, and conduct platform diligence.
          </p>
        </div>
      </div>

      <Tabs defaultValue="research" className="w-full">
        <TabsList className="grid grid-cols-4 w-[600px] mb-8">
          <TabsTrigger value="research">Market Research</TabsTrigger>
          <TabsTrigger value="deck">Deck Intelligence</TabsTrigger>
          <TabsTrigger value="evidence">Evidence Center</TabsTrigger>
          <TabsTrigger value="platform">Platform Diligence</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="focus:outline-none">
          <ResearchBriefPage />
        </TabsContent>

        <TabsContent value="deck" className="focus:outline-none">
          <DeckIntelligencePage />
        </TabsContent>

        <TabsContent value="evidence" className="focus:outline-none">
          <EvidenceCenterPage />
        </TabsContent>

        <TabsContent value="platform" className="focus:outline-none">
          <PlatformDiligencePage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
