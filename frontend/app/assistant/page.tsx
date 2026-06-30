"use client";

import { AssistantChat } from "@/components/assistant/AssistantChat";

export default function CrossDealAssistantPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Cross-Deal Assistant</h1>
        <p className="text-neutral-500 mt-2">
          Ask questions across the entire active pipeline. Compare startups, evaluate benchmark gaps, and find the most IC-ready deals.
        </p>
      </div>

      <AssistantChat crossDeal={true} fullHeight={true} />
    </div>
  );
}
