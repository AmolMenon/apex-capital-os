"use client";

import { Activity, ArrowUpRight, Search, Clock } from "lucide-react";
import { InsightCard } from "@/components/InsightCard";
import { useEventStream } from "@/hooks/useEventStream";

export default function PortfolioPage() {
  const liveEvents = useEventStream();
  const portfolioEvents = liveEvents.filter(e => e.event_type === "PORTFOLIO_SIGNAL" || e.entity_type === "Company");

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground mt-2">Active monitoring of 24 portfolio companies.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search portfolio..." 
            className="pl-9 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-border w-64"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> Live Portfolio Signals
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolioEvents.length > 0 ? (
            portfolioEvents.slice(0, 4).map((event) => (
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
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-8 text-center text-sm text-muted-foreground border rounded-lg border-dashed">
              Listening for background intelligence...
            </div>
          )}
        </div>
      </div>

      <div className="border border-border/50 rounded-lg overflow-hidden bg-card mt-8">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/30 border-b border-border/50">
            <tr>
              <th className="px-6 py-3 font-medium text-muted-foreground">Company</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Sector</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Performance</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Latest Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            <tr className="hover:bg-secondary/20 cursor-pointer transition-colors">
              <td className="px-6 py-4 font-medium">Acme Corp</td>
              <td className="px-6 py-4 text-muted-foreground">Fintech</td>
              <td className="px-6 py-4"><span className="text-warning">On Watch</span></td>
              <td className="px-6 py-4 text-muted-foreground">Exec departure</td>
            </tr>
            <tr className="hover:bg-secondary/20 cursor-pointer transition-colors">
              <td className="px-6 py-4 font-medium">Globex</td>
              <td className="px-6 py-4 text-muted-foreground">SaaS</td>
              <td className="px-6 py-4"><span className="text-success flex items-center gap-1">Outperforming <ArrowUpRight className="w-3 h-3"/></span></td>
              <td className="px-6 py-4 text-muted-foreground">ARR +12% MoM</td>
            </tr>
            <tr className="hover:bg-secondary/20 cursor-pointer transition-colors">
              <td className="px-6 py-4 font-medium">Initech</td>
              <td className="px-6 py-4 text-muted-foreground">Hardware</td>
              <td className="px-6 py-4"><span className="text-muted-foreground">Performing</span></td>
              <td className="px-6 py-4 text-muted-foreground">Product launch on track</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
