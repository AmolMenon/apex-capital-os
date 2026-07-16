"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { EvidenceBlock } from "@/components/EvidenceBlock";
import { InsightCard } from "@/components/InsightCard";
import { AutonomousAgentStatus } from "@/components/AutonomousAgentStatus";
import { DecisionControls } from "@/components/DecisionControls";
import { useEventStream } from "@/hooks/useEventStream";
import { Clock } from "lucide-react";

const TABS = [
  "Timeline",
  "Research",
  "Founder Analysis",
  "Market Mapping",
  "Competition",
  "Financial Review",
  "Risks",
  "Missing Diligence",
  "Investment Memo"
];

export default function DealWorkspacePage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const liveEvents = useEventStream();
  
  const dealEvents = liveEvents.filter(e => 
    e.entity_type === "Company" && e.entity_id === parseInt(params.id as string)
  );

  return (
    <div className="max-w-5xl space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Nova AI Investment Case</h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-success"></div> Active</span>
            <span>Seed Round</span>
            <span>Enterprise SaaS</span>
            <span>Updated 2 hours ago</span>
          </div>
        </div>
        <div className="flex flex-col items-end justify-center">
          <DecisionControls />
        </div>
      </div>

      {/* Agents Status */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <AutonomousAgentStatus status="complete" message="Web research complete." />
        <AutonomousAgentStatus status="working" message="Analyzing updated financial model." />
      </div>

      {/* Main Workspace */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-48 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          
          {activeTab === "Timeline" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h2 className="text-xl font-medium">Live Activity Timeline</h2>
              </div>
              <div className="border-l-2 border-border/50 ml-3 space-y-8">
                {dealEvents.length > 0 ? (
                  dealEvents.map((event) => (
                    <div key={event.id} className="relative pl-6 animate-in fade-in slide-in-from-left-4 duration-300">
                      <div className="absolute w-3 h-3 bg-secondary border border-border rounded-full -left-[7px] top-1.5" />
                      <p className="text-sm font-medium">{event.metadata?.headline || event.event_type}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(event.created_at).toLocaleTimeString()}
                        </span>
                        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                          {event.actor}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{event.metadata?.summary}</p>
                    </div>
                  ))
                ) : (
                  <div className="pl-6 text-sm text-muted-foreground">
                    Listening for background intelligence...
                  </div>
                )}
                
                {/* Historical static items (for context during transition) */}
                <div className="relative pl-6 opacity-60">
                  <div className="absolute w-3 h-3 bg-secondary border border-border rounded-full -left-[7px] top-1.5" />
                  <p className="text-sm font-medium">Partner Review Requested</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Market Mapping" && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Ecosystem Map</h2>
              <InsightCard 
                title="Market Position"
                content="Nova AI positions itself in the Enterprise Data layer, competing primarily on integration speed rather than advanced LLM capabilities. This avoids direct competition with OpenAI/Anthropic."
                sourceAttribution="Automated Market Analysis"
              />
              <EvidenceBlock 
                confidence="Medium"
                lastUpdated="10 mins ago"
                reasonConfidenceChanged="Competitor 'DataScale' announced a similar integration framework, reducing Nova AI's uniqueness."
                sources={[{id: "1", title: "Slide 8: Market Architecture", type: "Pitch Deck"}]}
                missingInformation={["Need verifiable proof of average integration time compared to incumbents."]}
              />
              <div className="h-64 border rounded-lg bg-secondary/20 flex flex-col items-center justify-center text-muted-foreground mt-6 border-dashed">
                [ Interactive Ecosystem Map Visualization ]
                <span className="text-xs mt-2 opacity-50">Rendering data from market research agents</span>
              </div>
            </div>
          )}

          {activeTab === "Financial Review" && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Financial Thesis</h2>
              <InsightCard 
                title="Unit Economics Inconsistency"
                type="destructive"
                content="The financial model projects a $10B TAM by capturing 5% of mid-market SMEs. However, their proposed CAC of $4,500 means they would need $2.25B in capital to acquire that market share."
                recommendation="Challenge founder on Go-To-Market efficiency and capital requirements."
                sourceAttribution="Automated Financial Audit"
              />
              <EvidenceBlock 
                confidence="High"
                lastUpdated="1 hour ago"
                reasonConfidenceChanged="Both the raw financial model and the pitch deck explicitly state these numbers. The contradiction is mathematical."
                sources={[
                  {id: "1", title: "Financial_Model_v3.xlsx", type: "Data Room"},
                  {id: "2", title: "Slide 12: Go-To-Market", type: "Pitch Deck"}
                ]}
                conflicts={["Pitch deck claims organic growth will drive 80% of acquisition, but financial model allocates 60% of budget to paid marketing."]}
              />
            </div>
          )}
          
          {/* Fallback for other tabs */}
          {["Research", "Founder Analysis", "Competition", "Risks", "Missing Diligence", "Investment Memo"].includes(activeTab) && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">{activeTab}</h2>
              <div className="h-64 flex flex-col items-center justify-center p-6 border rounded-lg bg-card text-muted-foreground border-dashed">
                <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-4" />
                <p className="text-sm">Autonomous agents are actively compiling data for this section.</p>
                <p className="text-xs opacity-60 mt-1">Check back later or request specific research.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
