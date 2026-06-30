"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, CheckCircle, AlertTriangle, ShieldCheck, Database, RefreshCw, X, FolderOpen, Target, Eye, ListTodo, Activity } from "lucide-react";

export default function DiligenceRunReportPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;
  const runId = params.run_id as string;
  
  const [run, setRun] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [dealId, runId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getDiligenceRun(dealId, runId);
      setRun(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;
  }

  if (!run) {
    return <div className="text-center p-12">Run not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <Badge className="mb-2 bg-neutral-100 text-neutral-600 border-neutral-200">Run ID: {run.run_id}</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Diligence Report: {run.company_name}</h1>
          <p className="text-neutral-500 mt-2">Diligence workflow output. Not an investment decision.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.push(`/deals/${dealId}/run-diligence`)}>
            <RefreshCw className="w-4 h-4 mr-2" /> Re-run
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-emerald-800">
            <Target className="w-5 h-5 mr-2" /> Final Decision State
          </h3>
          <div className="text-4xl font-bold text-neutral-900 mb-2">{run.final_recommendation}</div>
          <div className="flex space-x-4 mb-6">
            <Badge variant="outline" className={run.ic_readiness === "Not Ready" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}>
              IC Readiness: {run.ic_readiness}
            </Badge>
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
              Confidence: {run.evidence_confidence}
            </Badge>
          </div>
          
          <h4 className="text-sm font-semibold text-neutral-700 mb-2">Next Best Action</h4>
          <p className="text-sm text-neutral-600 mb-4">{run.next_actions[0] || "None"}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-purple-800">
            <ShieldCheck className="w-5 h-5 mr-2" /> Trust Audit
          </h3>
          <div className="text-3xl font-bold text-neutral-900 mb-2">{run.trust_score}<span className="text-lg text-neutral-400">/100</span></div>
          <p className="text-sm text-neutral-500 mb-4">Higher score indicates verified evidence. Lower score indicates reliance on founder claims or missing data.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-amber-200 bg-amber-50/30">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-amber-800">
            <AlertTriangle className="w-5 h-5 mr-2" /> Critical Blockers & Missing Info
          </h3>
          {run.critical_blockers.length === 0 ? (
            <p className="text-sm text-neutral-500">No critical blockers identified.</p>
          ) : (
            <ul className="space-y-2">
              {run.critical_blockers.map((b: string, i: number) => (
                <li key={i} className="flex items-start text-sm text-amber-900 bg-amber-100/50 p-2 rounded border border-amber-200">
                  <span className="font-medium">{b}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6 border-blue-200 bg-blue-50/30">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
            <ListTodo className="w-5 h-5 mr-2" /> Operations Tasks Created
          </h3>
          <p className="text-sm text-blue-900 mb-2">Generated {run.missing_information.length} tasks from missing diligence gaps.</p>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            {run.missing_information.slice(0, 5).map((gap: string, i: number) => (
              <li key={i}>Collect: {gap.replace('Missing', '')}</li>
            ))}
            {run.missing_information.length > 5 && <li>...and {run.missing_information.length - 5} more</li>}
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" /> Run Details & Modules Updated
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-center">
          <div className="p-4 border rounded-lg bg-neutral-50">
            <Database className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
            <div className="font-semibold text-neutral-700">Evidence Center</div>
            <div className="text-neutral-500 text-xs mt-1">Updated</div>
          </div>
          <div className="p-4 border rounded-lg bg-neutral-50">
            <Eye className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
            <div className="font-semibold text-neutral-700">Deal Sync</div>
            <div className="text-neutral-500 text-xs mt-1">Summary Generated</div>
          </div>
          <div className="p-4 border rounded-lg bg-neutral-50">
            <Target className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
            <div className="font-semibold text-neutral-700">Decision Engine</div>
            <div className="text-neutral-500 text-xs mt-1">State Updated</div>
          </div>
          <div className="p-4 border rounded-lg bg-neutral-50">
            <FileText className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
            <div className="font-semibold text-neutral-700">IC Packet</div>
            <div className="text-neutral-500 text-xs mt-1">Draft Appended</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
