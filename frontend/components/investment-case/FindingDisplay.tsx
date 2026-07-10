import React from "react";
import { Finding } from "@/types/investment-case";
import { InvestmentStatus } from "./InvestmentStatus";
import { FileText } from "lucide-react";

interface FindingDisplayProps {
  finding: Finding;
}

export function FindingDisplay({ finding }: FindingDisplayProps) {
  return (
    <div className="bg-muted/30 border rounded-md p-4 mt-2">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">Finding #{finding.id}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {finding.resolution_effect && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Resolution Effect:</span>
            <InvestmentStatus status={finding.resolution_effect} />
          </div>
        )}
        {finding.assumption_effect && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assumption Effect:</span>
            <InvestmentStatus status={finding.assumption_effect} />
          </div>
        )}
      </div>
    </div>
  );
}
