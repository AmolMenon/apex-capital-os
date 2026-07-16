"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InsightCard } from "@/components/InsightCard";
import { AutonomousAgentStatus } from "@/components/AutonomousAgentStatus";
import { DealsService } from "@/services/deals";
import { Deal } from "@/types";
import { useEventStream } from "@/hooks/useEventStream";
import { Clock } from "lucide-react";

export default function BriefingPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const liveEvents = useEventStream();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await DealsService.getDeals();
        setDeals(data || []);
      } catch (e) {
        console.error("Failed to load deals", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-secondary rounded" />
        <div className="h-32 bg-secondary rounded" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Good Morning.</h1>
        <p className="text-muted-foreground mt-2">Here is your executive briefing for today.</p>
      </div>

      {/* Agents Working */}
      <div className="flex gap-4">
        <AutonomousAgentStatus status="working" message="Market research running on 2 new deals." />
        <AutonomousAgentStatus status="complete" message="Portfolio monitoring up to date." />
      </div>

      {/* Opinionated Insights */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Critical Insights</h2>
        <InsightCard 
          title="Similar Deal Detected"
          type="info"
          content={`One new company in your pipeline resembles "Acme Corp", which was rejected in 2024 for high customer acquisition costs.`}
          recommendation="Compare their GTM strategies to see if they solved the CAC issue."
        />
        <InsightCard 
          title="Upcoming IC Meeting"
          type="warning"
          content="You have an Investment Committee meeting tomorrow for Nova AI."
          recommendation="Review the missing diligence items on the Deal Workspace."
        />
      </div>

      {/* Pipeline Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Pipeline Action Required</h2>
          <button 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => router.push('/dashboard/deals')}
          >
            View all deals →
          </button>
        </div>
        
        {deals.length > 0 ? (
          <div className="border border-border/50 rounded-lg overflow-hidden">
            {deals.slice(0, 3).map((deal, idx) => (
              <div 
                key={deal.id} 
                className={`p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer ${idx !== 0 ? 'border-t border-border/50' : ''}`}
                onClick={() => router.push(`/dashboard/deals/${deal.id}`)}
              >
                <div>
                  <h3 className="font-medium">{deal.title || 'Unknown Deal'}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Status: {deal.status}</p>
                </div>
                <div className="text-xs font-medium text-primary px-2.5 py-1 bg-secondary rounded-md">
                  Action Needed
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground p-6 border rounded-lg text-center bg-card">
            No active deals in the pipeline.
          </div>
        )}
      </div>

      {/* Live Intelligence Feed */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-lg font-medium">Live Intelligence Feed</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {liveEvents.length > 0 ? (
            liveEvents.map((event) => (
              <div key={event.id} className="p-4 border border-border/50 rounded-lg bg-card shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{event.metadata?.headline || event.event_type}</h3>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(event.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{event.metadata?.summary}</p>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 bg-secondary text-xs rounded text-muted-foreground">
                    Source: {event.actor}
                  </span>
                  {event.metadata?.impact_assessment && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium">
                      {event.metadata.impact_assessment.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground border rounded-lg border-dashed">
              Listening for background intelligence...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
