"use client";

import React, { useState, useEffect } from "react";
import { Bot, X, ExternalLink, MessageSquare } from "lucide-react";
import { CopilotChat } from "./CopilotChat";
import { usePathname, useRouter } from "next/navigation";

export function GlobalCopilotBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Extract dealId if we are on a deal page
  const match = pathname.match(/\/deals\/(\d+)/);
  const dealId = match ? match[1] : undefined;
  
  // Don't show if we are already on the full copilot page
  if (pathname.includes("/copilot")) return null;

  return (
    <>
      {/* Floating Button / Bar */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-transform"
          >
            <Bot className="w-5 h-5" />
            <span className="font-medium text-sm hidden sm:inline-block">Ask Apex</span>
          </button>
        </div>
      )}

      {/* Expanded Modal / Drawer (Always mounted to preserve state) */}
      <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-[400px] z-50 transition-all duration-200 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <div className="flex items-center space-x-2 text-neutral-900 dark:text-white">
              <Bot className="w-4 h-4" />
              <span className="font-semibold text-sm">
                {dealId ? "Ask Apex (Deal Context)" : "Ask Apex (Fund Context)"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (dealId) {
                    router.push(`/deals/${dealId}/copilot`);
                  } else {
                    router.push(`/copilot`);
                  }
                }}
                className="p-1.5 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md"
                title="Open Full Page"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="h-[450px]">
            <CopilotChat dealId={dealId} crossDeal={!dealId} />
          </div>
        </div>
      </div>
    </>
  );
}
