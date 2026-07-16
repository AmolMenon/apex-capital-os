import { ShieldAlert, Info, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  title: string;
  type?: "info" | "warning" | "destructive" | "success";
  content: string;
  recommendation?: string;
  sourceAttribution?: string;
  className?: string;
}

export function InsightCard({ title, type = "info", content, recommendation, sourceAttribution, className }: InsightCardProps) {
  const styles = {
    info: "bg-secondary text-foreground border-border",
    warning: "bg-warning/10 text-warning-foreground border-warning/20",
    destructive: "bg-destructive/10 text-destructive-foreground border-destructive/20",
    success: "bg-success/10 text-success-foreground border-success/20",
  };

  const icons = {
    info: <Info className="w-5 h-5 text-muted-foreground" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    destructive: <ShieldAlert className="w-5 h-5 text-destructive" />,
    success: <Info className="w-5 h-5 text-success" />
  };

  return (
    <div className={cn("rounded-lg border p-5 flex flex-col gap-3", styles[type], className)}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm truncate">{title}</h4>
            {sourceAttribution && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 shrink-0 opacity-70">
                {sourceAttribution}
              </span>
            )}
          </div>
          <p className="text-sm opacity-90 leading-relaxed">{content}</p>
        </div>
      </div>
      {recommendation && (
        <div className="mt-2 pt-3 border-t border-black/10 dark:border-white/10 flex items-start gap-2">
          <ArrowRight className="w-4 h-4 mt-0.5 opacity-70" />
          <div className="text-sm font-medium">
            <span className="opacity-70 mr-2">Next Step:</span>
            {recommendation}
          </div>
        </div>
      )}
    </div>
  );
}
