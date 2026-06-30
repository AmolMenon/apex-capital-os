"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Play, FileText, CheckCircle, AlertTriangle, ShieldCheck, Database, RefreshCw, X, FolderOpen, ArrowRight } from "lucide-react";
import { useDeal } from "@/components/DealProvider"

export default function RunDiligencePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const deal = useDeal();
  const [readiness, setReadiness] = useState<any>(null);
  const [latestRun, setLatestRun] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runProgress, setRunProgress] = useState<any[]>([]);

  const [config, setConfig] = useState({
    include_public_research: true,
    include_uploaded_documents: true,
    include_war_room: true,
    generate_ic_packet: true,
    create_operations_tasks: true,
    mock_mode_fallback: true
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [runData] = await Promise.all([
        api.getLatestDiligenceRun(id).catch(() => null)
      ]);
      setLatestRun(runData);
      
      // Simulating readiness data since we don't have a direct endpoint yet
      setReadiness({
        readiness_level: "Documented",
        missing_basic: [],
        has_docs: true,
        has_research: true
      });
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartRun = async () => {
    try {
      setRunning(true);
      setRunProgress([]);
      
      const res = await api.runDealDiligence(id, config);
      
      // Animate steps for effect
      const mockSteps = [
        "Deal Completeness Check",
        "Document Review",
        "Evidence Mapping",
        "Public Research",
        "Diligence Gap Analysis",
        "Diligence Questions",
        "Deal Sync Summary",
        "Decision Synthesis",
        "IC Packet Draft",
        "Trust Audit",
        "Operations Tasks",
        "Final Report"
      ];
      
      for (let i = 0; i < mockSteps.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        setRunProgress(prev => [...prev, { name: mockSteps[i], status: 'completed' }]);
      }
      
      setLatestRun(res);
      router.push(`/deals/${id}/diligence-runs/${res.run_id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start diligence run");
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Run Diligence</h1>
          <p className="text-neutral-500 mt-2">Convert messy startup information into an evidence-backed diligence workflow.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-neutral-800">Deal Snapshot</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-neutral-500">Company</span>
              <span className="font-medium text-neutral-900">{deal?.company_name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-neutral-500">Sector</span>
              <span className="font-medium text-neutral-900">{deal?.sector || "Unknown"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-neutral-500">Readiness Level</span>
              <span className="font-medium text-blue-600">{readiness?.readiness_level || "Minimal"}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-neutral-800">Run Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Include Public Research</span>
              <Switch checked={config.include_public_research} onCheckedChange={(v) => setConfig({...config, include_public_research: v})} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Include Uploaded Documents</span>
              <Switch checked={config.include_uploaded_documents} onCheckedChange={(v) => setConfig({...config, include_uploaded_documents: v})} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Generate IC Packet</span>
              <Switch checked={config.generate_ic_packet} onCheckedChange={(v) => setConfig({...config, generate_ic_packet: v})} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Create Operations Tasks</span>
              <Switch checked={config.create_operations_tasks} onCheckedChange={(v) => setConfig({...config, create_operations_tasks: v})} />
            </div>
          </div>
        </Card>
      </div>

      {latestRun && (
        <Card className="p-6 border-emerald-200 bg-emerald-50/30">
          <h3 className="text-sm font-semibold text-emerald-800 mb-2">Previous Run Found</h3>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Status: <Badge variant="outline">{latestRun.status}</Badge> • 
              Recommendation: <span className="font-medium">{latestRun.final_recommendation}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push(`/deals/${id}/diligence-runs/${latestRun.run_id}`)}>View Last Report</Button>
          </div>
        </Card>
      )}

      <Card className="p-8 text-center border-2 border-emerald-100 bg-white">
        <Play className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Ready to Run</h3>
        <p className="text-neutral-500 max-w-md mx-auto mb-8">
          Apex will synthesize all available evidence, run 12 analytical steps, and produce a unified Diligence Report and IC state.
        </p>
        
        {running ? (
          <div className="space-y-4 max-w-md mx-auto text-left">
            {runProgress.map((step, i) => (
              <div key={i} className="flex items-center text-sm font-medium text-emerald-700">
                <CheckCircle className="w-4 h-4 mr-2" /> {step.name}
              </div>
            ))}
            <div className="flex items-center text-sm font-medium text-neutral-500 animate-pulse">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing next step...
            </div>
          </div>
        ) : (
          <Button onClick={handleStartRun} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6 w-full max-w-sm">
            <Play className="w-5 h-5 mr-2" /> Start Diligence Run
          </Button>
        )}
      </Card>
    </div>
  );
}
