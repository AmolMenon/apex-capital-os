"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import DiligencePage from "../diligence/index";
import DealStructuringPage from "../deal-structuring/index";

export default function ExecuteDealPage() {
  const { state, loading } = useGlobalDeal();

  if (loading || !state) {
    return <div className="p-12 animate-pulse">Loading Execute Module...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Execute</h1>
          <p className="text-muted-foreground mt-1">
            Deep Diligence Runs and Deal Structuring.
          </p>
        </div>
      </div>

      <Tabs defaultValue="diligence" className="w-full">
        <TabsList className="grid grid-cols-2 w-[350px] mb-8">
          <TabsTrigger value="diligence">Diligence Tracking</TabsTrigger>
          <TabsTrigger value="structuring">Deal Structuring</TabsTrigger>
        </TabsList>

        <TabsContent value="diligence" className="focus:outline-none">
          <DiligencePage />
        </TabsContent>

        <TabsContent value="structuring" className="focus:outline-none">
          <DealStructuringPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
