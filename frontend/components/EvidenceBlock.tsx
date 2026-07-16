import { CheckCircle2, ShieldAlert, AlertTriangle, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface EvidenceSource {
  id: string;
  title: string;
  url?: string;
  type: string;
}

interface EvidenceBlockProps {
  confidence: "High" | "Medium" | "Low";
  sources: EvidenceSource[];
  conflicts?: string[];
  missingInformation?: string[];
  lastUpdated?: string;
  reasonConfidenceChanged?: string;
  className?: string;
}

export function EvidenceBlock({ 
  confidence, 
  sources, 
  conflicts, 
  missingInformation, 
  lastUpdated, 
  reasonConfidenceChanged, 
  className 
}: EvidenceBlockProps) {
  const confidenceColor = {
    High: "text-success bg-success/10 border-success/20",
    Medium: "text-warning bg-warning/10 border-warning/20",
    Low: "text-destructive bg-destructive/10 border-destructive/20"
  };

  return (
    <div className={cn("rounded-lg border bg-card p-4 text-sm", className)}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
        <div>
          <h5 className="font-semibold text-foreground">Evidence Quality</h5>
          {lastUpdated && <p className="text-[10px] text-muted-foreground mt-0.5">Updated {lastUpdated}</p>}
        </div>
        <div className={cn("px-2.5 py-1 rounded-md border font-medium text-xs", confidenceColor[confidence])}>
          {confidence} Confidence
        </div>
      </div>

      <div className="space-y-4">
        {/* Reason for Change */}
        {reasonConfidenceChanged && (
          <div className="mb-4 p-3 bg-secondary/30 rounded-md border border-border/50">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Reason for Shift</span>
            <p className="text-sm text-foreground">{reasonConfidenceChanged}</p>
          </div>
        )}
        {/* Sources */}
        {sources.length > 0 && (
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Sources</div>
            <ul className="space-y-2">
              {sources.map((source) => (
                <li key={source.id} className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-foreground">{source.title}</span>
                    <span className="text-muted-foreground ml-2 text-xs">({source.type})</span>
                  </div>
                  {source.url && (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Conflicts */}
        {conflicts && conflicts.length > 0 && (
          <div>
            <div className="text-xs font-medium text-destructive uppercase tracking-wider mb-2 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Conflicting Evidence
            </div>
            <ul className="space-y-2">
              {conflicts.map((conflict, idx) => (
                <li key={idx} className="flex items-start gap-2 text-destructive">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span>{conflict}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing Info */}
        {missingInformation && missingInformation.length > 0 && (
          <div>
            <div className="text-xs font-medium text-warning uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Missing Information
            </div>
            <ul className="space-y-2">
              {missingInformation.map((info, idx) => (
                <li key={idx} className="flex items-start gap-2 text-warning-foreground">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
