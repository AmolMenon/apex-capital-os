"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DealsService } from "@/services/deals";
import { Deal } from "@/types";

export default function DealsPipelinePage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Deals Pipeline</h1>
          <p className="text-muted-foreground mt-2">Active deals in evaluation.</p>
        </div>
        <button 
          onClick={() => router.push('/onboarding')}
          className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md text-sm hover:bg-primary/90 transition-colors"
        >
          New Deal
        </button>
      </div>

      <div className="border border-border/50 rounded-lg overflow-hidden bg-card">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground animate-pulse">Loading pipeline...</div>
        ) : deals.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-3 font-medium text-muted-foreground">Company</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {deals.map(deal => (
                <tr 
                  key={deal.id} 
                  className="hover:bg-secondary/20 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/deals/${deal.id}`)}
                >
                  <td className="px-6 py-4 font-medium">{deal.title || 'Unknown Deal'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-secondary text-foreground text-xs font-medium">
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">Today</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            No active deals. Click "New Deal" to upload a pitch deck.
          </div>
        )}
      </div>
    </div>
  );
}
