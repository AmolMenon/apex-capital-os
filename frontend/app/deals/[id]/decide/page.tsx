"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import ICPacketPage from "../ic-packet/index";
import RiskPage from "../risk/index";
import ThesisPage from "../thesis/index";
import { ScenarioSimulator } from "@/components/ui/ScenarioSimulator";

export default function DecideDealPage() {
  const { state, loading } = useGlobalDeal();

  if (loading || !state) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decide</h1>
          <p className="text-muted-foreground mt-1">
            Investment Thesis, Risk Assessment, and IC Packet.
          </p>
        </div>
      </div>

      <Tabs defaultValue="ic-packet" className="w-full">
        <TabsList className="grid grid-cols-4 w-[550px] mb-8">
          <TabsTrigger value="ic-packet">IC Packet</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="thesis">Investment Thesis</TabsTrigger>
          <TabsTrigger value="scenarios">Simulations</TabsTrigger>
        </TabsList>

        <TabsContent value="ic-packet" className="focus:outline-none">
          <ICPacketPage />
        </TabsContent>

        <TabsContent value="risk" className="focus:outline-none">
          <RiskPage />
        </TabsContent>

        <TabsContent value="thesis" className="focus:outline-none">
          <ThesisPage />
        </TabsContent>

        <TabsContent value="scenarios" className="focus:outline-none mt-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Scenario Simulations</h2>
            <p className="text-sm text-muted-foreground">Stress test assumptions to see projected returns.</p>
          </div>
          <ScenarioSimulator 
            baseArr={state.deal.arr || 1200000} 
            baseValuation={state.deal.valuation || 15000000} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
