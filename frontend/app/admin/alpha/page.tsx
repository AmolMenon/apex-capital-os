"use client";

import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { analytics } from "@/lib/analytics";

interface Metrics {
  activeUsers: number;
  reviewsGenerated: number;
  averageReviewTimeMs: number;
  actionsCompleted: number;
  feedbackVolume: number;
  errors: number;
  mostCommonDropoff: string;
}

export default function AdminAlphaPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analytics.page("Admin Alpha Dashboard");
    
    // In a real app this would have a hard auth check before rendering
    if (process.env.NODE_ENV === "production") {
      // Mocked auth gate
      const p = prompt("Enter Admin Password:");
      if (p !== "alpha-admin") {
        window.location.href = "/";
        return;
      }
    }

    const fetchMetrics = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/admin/alpha/metrics");
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        } else {
          console.error("Failed to fetch admin metrics");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading Alpha metrics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      
      <main className="max-w-6xl mx-auto py-12 px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Alpha Launch Metrics</h1>
          <p className="text-slate-600">Read-only view powered by DomainEvents.</p>
        </div>

        {metrics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard title="Active Users" value={metrics.activeUsers} />
            <MetricCard title="Reviews Generated" value={metrics.reviewsGenerated} />
            <MetricCard title="Avg Review Time" value={`${(metrics.averageReviewTimeMs / 1000).toFixed(1)}s`} />
            <MetricCard title="Actions Completed" value={metrics.actionsCompleted} />
            <MetricCard title="Feedback Received" value={metrics.feedbackVolume} />
            <MetricCard title="Recent Errors" value={metrics.errors} error={metrics.errors > 0} />
            <MetricCard title="Most Common Drop-off" value={metrics.mostCommonDropoff} />
          </div>
        ) : (
          <div className="bg-red-50 p-6 rounded-lg text-red-700">
            Failed to load metrics. Ensure backend is running.
          </div>
        )}
      </main>
    </div>
  );
}

function MetricCard({ title, value, error = false }: { title: string; value: string | number; error?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border p-6 ${error ? 'border-red-200' : 'border-slate-200'}`}>
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</h3>
      <p className={`text-4xl font-bold ${error ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
    </div>
  );
}
