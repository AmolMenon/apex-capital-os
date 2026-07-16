import { Activity, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutonomousAgentStatusProps {
  status: "idle" | "working" | "complete";
  message: string;
  className?: string;
}

export function AutonomousAgentStatus({ status, message, className }: AutonomousAgentStatusProps) {
  return (
    <div className={cn("flex items-center gap-3 py-2 px-3 rounded-md bg-secondary/30 border border-border/50 text-sm", className)}>
      {status === "working" && (
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
      )}
      {status === "complete" && (
        <CheckCircle2 className="w-4 h-4 text-success" />
      )}
      {status === "idle" && (
        <Activity className="w-4 h-4 text-muted-foreground" />
      )}
      <span className={cn(
        "font-medium",
        status === "working" ? "text-foreground" : "text-muted-foreground"
      )}>
        {message}
      </span>
    </div>
  );
}
