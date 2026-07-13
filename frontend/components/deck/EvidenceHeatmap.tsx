import React from "react";
import { FileText, DatabaseZap, AlertCircle, Info } from "lucide-react";

interface Chunk {
  id: string;
  text: string;
  type: "HARD_EVIDENCE" | "SOFT_EVIDENCE" | "MARKETING_CLAIM";
}

interface EvidenceHeatmapProps {
  slideId: number;
  slideTitle?: string;
}

const mockChunks: Record<number, Chunk[]> = {
  1: [
    { id: "c1", text: "Apex Capital is the leading AI platform.", type: "MARKETING_CLAIM" },
    { id: "c2", text: "We help founders raise money faster.", type: "SOFT_EVIDENCE" }
  ],
  5: [
    { id: "c3", text: "$10k MRR achieved in Q1.", type: "HARD_EVIDENCE" },
    { id: "c4", text: "Growing very quickly.", type: "MARKETING_CLAIM" },
    { id: "c5", text: "45% gross margins with 120% NRR.", type: "HARD_EVIDENCE" }
  ]
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case "HARD_EVIDENCE": 
      return { border: "border-l-success", text: "text-success", bg: "bg-success/10", icon: <DatabaseZap className="w-3.5 h-3.5" />, label: "HARD_EVIDENCE" };
    case "SOFT_EVIDENCE": 
      return { border: "border-l-warning", text: "text-warning", bg: "bg-warning/10", icon: <Info className="w-3.5 h-3.5" />, label: "SOFT_EVIDENCE" };
    case "MARKETING_CLAIM": 
      return { border: "border-l-destructive", text: "text-destructive", bg: "bg-destructive/10", icon: <AlertCircle className="w-3.5 h-3.5" />, label: "MARKETING_CLAIM" };
    default: 
      return { border: "border-l-border", text: "text-muted-foreground", bg: "bg-muted", icon: <Info className="w-3.5 h-3.5" />, label: "UNKNOWN" };
  }
};

export const EvidenceHeatmap: React.FC<EvidenceHeatmapProps> = ({ slideId, slideTitle }) => {
  const chunks = mockChunks[slideId] || [
    { id: "def1", text: "Some general slide content.", type: "SOFT_EVIDENCE" }
  ];

  return (
    <div className="flex-1 border border-border/50 rounded-lg bg-background overflow-hidden flex flex-col font-mono">
      <div className="px-4 py-2 border-b border-border/50 bg-background/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="w-3.5 h-3.5" />
          <span>slide_{slideId}.json</span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> Verified</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-warning"></span> Weak</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span> Risk</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-[#0a0a0a]">
        <div className="space-y-[1px]">
          {chunks.map((chunk, idx) => {
            const config = getTypeConfig(chunk.type);
            return (
              <div key={chunk.id} className="flex group hover:bg-white/5 px-2 py-1.5 rounded transition-colors">
                <div className="w-8 shrink-0 text-muted-foreground/30 text-xs text-right pr-4 select-none leading-relaxed">
                  {idx + 1}
                </div>
                <div className={`flex-1 pl-3 border-l-2 ${config.border} flex flex-col gap-1`}>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-[10px] font-bold ${config.text} ${config.bg} px-1.5 py-0.5 rounded-sm`}>
                      {config.icon} {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 font-sans leading-relaxed tracking-tight">{chunk.text}</p>
                </div>
              </div>
            );
          })}
          {chunks.length === 0 && (
            <div className="text-muted-foreground/50 py-8 text-xs text-center select-none">
              // No extractable claims detected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
