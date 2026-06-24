"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function MarketRadarPage() {
  const [radar, setRadar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const r = await api.getMarketRadar();
        setRadar(r);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const r = await api.refreshMarketRadar();
      setRadar(r);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading Market Radar...</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Market Radar</h1>
          <p className="text-zinc-400">Tracking funding, hiring, and regulatory signals across active theses.</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="bg-indigo-600 hover:bg-indigo-700 text-white border-0"
        >
          {refreshing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Scan Public Signals
        </Button>
      </div>

      <div className="space-y-6">
        {radar.map(signal => (
          <Card key={signal.signal_id} className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-medium text-zinc-100">{signal.signal_title}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">{signal.market}</Badge>
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">{signal.signal_type}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-500 mb-1">Source: <span className="text-zinc-400">{signal.source}</span></p>
                  <p className="text-sm text-zinc-500">Confidence: <span className="text-emerald-400">{signal.confidence}</span></p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="text-sm font-medium text-zinc-300 mb-2">Analyst Interpretation</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/50 p-4 rounded border border-zinc-800">
                    {signal.analyst_interpretation}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-300 mb-2">Next Action</h4>
                  <p className="text-sm text-emerald-400 leading-relaxed bg-zinc-950/50 p-4 rounded border border-zinc-800">
                    {signal.next_action}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800 flex gap-2 items-center text-sm">
                <span className="text-zinc-500">Companies Mentioned:</span>
                {signal.companies_mentioned.map((c: string) => (
                  <Badge key={c} variant="outline" className="border-zinc-700 bg-zinc-800 text-zinc-300">{c}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
