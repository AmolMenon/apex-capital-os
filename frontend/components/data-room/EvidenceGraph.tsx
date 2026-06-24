"use client"

import React, { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Loader2, FileText, Database, ShieldCheck } from "lucide-react"

interface Node {
  id: string;
  label: string;
  group: string;
  confidence?: string;
}

interface Edge {
  from: string;
  to: string;
  label: string;
}

export default function EvidenceGraph({ dealId }: { dealId: string | number }) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGraph() {
      try {
        const data = await api.getPrivateEvidenceGraph(dealId);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGraph();
  }, [dealId]);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (nodes.length === 0) {
    return <div className="text-center p-8 text-neutral-500">No evidence graph generated. Upload documents first.</div>;
  }

  const documentNodes = nodes.filter(n => n.group === "document");
  const evidenceNodes = nodes.filter(n => n.group === "private_evidence");

  // Fixed dimensions for easy SVG alignment
  const docHeight = 80;
  const evHeight = 80;
  const gap = 24;

  return (
    <div className="p-6 overflow-x-auto bg-neutral-50/50 dark:bg-neutral-950/50 rounded-xl border border-border">
      <div className="min-w-[800px] flex justify-between relative" style={{ minHeight: Math.max(documentNodes.length, evidenceNodes.length) * (docHeight + gap) + 100 }}>
        
        {/* SVG Overlay for Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {edges.map((e, idx) => {
            const fromIdx = documentNodes.findIndex(n => n.id === e.from);
            const toIdx = evidenceNodes.findIndex(n => n.id === e.to);
            if(fromIdx === -1 || toIdx === -1) return null;
            
            // X coordinates: doc ends at 320px width (approx), evidence starts at calc(100% - 350px)
            const startX = 300;
            const endX = 500;
            const startY = 40 + fromIdx * (docHeight + gap) + docHeight / 2;
            const endY = 40 + toIdx * (evHeight + gap) + evHeight / 2;
            
            return (
              <path 
                key={idx}
                d={`M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-emerald-500/30 dark:text-emerald-500/20"
              />
            )
          })}
        </svg>

        {/* Documents Column */}
        <div className="w-[300px] relative z-10" style={{ paddingTop: 40 }}>
          <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-6 flex items-center gap-2"><Database className="w-4 h-4"/> Source Entities</h4>
          <div className="flex flex-col relative" style={{ gap: gap }}>
            {documentNodes.map((doc, idx) => (
              <Card key={doc.id} className="p-4 border-l-4 border-l-blue-500 shadow-md relative" style={{ height: docHeight }}>
                <div className="flex items-center space-x-3 h-full">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-md">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-sm line-clamp-2">{doc.label}</span>
                </div>
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-neutral-900" />
              </Card>
            ))}
          </div>
        </div>

        {/* Evidence Column */}
        <div className="w-[350px] relative z-10" style={{ paddingTop: 40 }}>
          <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-6 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Extracted Knowledge</h4>
          <div className="flex flex-col relative" style={{ gap: gap }}>
            {evidenceNodes.map((ev, idx) => (
              <Card key={ev.id} className="p-4 border-l-4 border-l-emerald-500 shadow-md relative" style={{ height: evHeight }}>
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900" />
                <div className="flex flex-col h-full justify-center">
                  <span className="font-medium text-sm line-clamp-2">{ev.label}</span>
                  <div className="mt-2 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full inline-block self-start border border-emerald-200 dark:border-emerald-800">
                    {ev.confidence || "HIGH"} CONFIDENCE
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
