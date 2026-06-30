"use client";

import React from 'react';
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { EmptyState } from "@/components/ui/EmptyState";
import { Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';

export default function DealPortfolioPage() {
  const { state, loading } = useGlobalDeal();

  if (loading || !state?.deal) {
    return <Skeleton className="h-96 w-full" />;
  }

  // Determine if it's already in the portfolio
  const isPortfolio = state.deal.status === "Approved" || state.deal.stage === "Portfolio";

  if (!isPortfolio) {
    return (
      <div className="max-w-3xl mx-auto mt-12">
        <EmptyState 
          title="Not in Portfolio"
          description={`${state.deal.startup_name} is currently in the ${state.deal.status} stage. Portfolio tracking unlocks once the IC approves the deal.`}
          primaryActionLabel="Go to Deal Room"
          onPrimaryAction={() => {
            window.location.href = `/deals/${state.deal.id}/deal-room`;
          }}
          icon={Database}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <EmptyState 
        title="Portfolio Intelligence Setup"
        description={`Configure data connectors (Stripe, Plaid, Quickbooks) to begin autonomous tracking of ${state.deal.startup_name}.`}
        primaryActionLabel="Connect Data Sources"
        onPrimaryAction={() => {}}
        icon={Database}
      />
    </div>
  );
}
