"use client"
import { useParams } from "next/navigation";;

import { use } from "react";
import { AssistantChat } from "@/components/assistant/AssistantChat";

export default function DealAssistantPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = useParams() as any;
  const { id } = resolvedParams;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Deal Assistant</h1>
        <p className="text-neutral-500 mt-2">
          Ask questions about IC readiness, diligence gaps, and fund math. Answers are grounded in the Deal Deal Sync and Evidence Center.
        </p>
      </div>

      <AssistantChat dealId={id} fullHeight={true} />
    </div>
  );
}
