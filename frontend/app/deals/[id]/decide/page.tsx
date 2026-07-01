"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import ICPacketPage from "../ic-packet/index";
import RiskPage from "../risk/index";
import ThesisPage from "../thesis/index";

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
        <TabsList className="grid grid-cols-3 w-[450px] mb-8">
          <TabsTrigger value="ic-packet">IC Packet</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="thesis">Investment Thesis</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
