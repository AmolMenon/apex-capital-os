"use client";

import React from 'react';
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function VerificationPage() {
  const { state, loading } = useGlobalDeal();

  if (loading || !state?.deal) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <EmptyState 
        title="Claim Verification Not Started"
        description={`The verification engine cross-references the claims made by ${state.deal.startup_name} against public records, proprietary databases, and market intelligence.`}
        primaryActionLabel="Run Claim Verification"
        onPrimaryAction={() => {}}
        icon={ShieldCheck}
      />
    </div>
  );
}
