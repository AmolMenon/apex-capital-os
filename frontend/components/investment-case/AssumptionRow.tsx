import React from "react";
import { Assumption, Conflict, DiligenceTask } from "@/types/investment-case";
import { InvestmentStatus } from "./InvestmentStatus";
import { ChevronRight } from "lucide-react";

interface AssumptionRowProps {
  assumption: Assumption;
  allConflicts: Conflict[];
  allTasks: DiligenceTask[];
  onClick: () => void;
}

export function AssumptionRow({ assumption, allConflicts, allTasks, onClick }: AssumptionRowProps) {
  const supportCount = assumption.claims.filter((c) => c.relationship === "SUPPORTS").length;
  const contradictCount = assumption.claims.filter((c) => c.relationship === "CONTRADICTS").length;

  const claimIds = assumption.claims.map((c) => c.claim_id);
  
  const relatedConflicts = allConflicts.filter(
    (c) => claimIds.includes(c.claim_a_id) || claimIds.includes(c.claim_b_id)
  );
  
  const unresolvedConflicts = relatedConflicts.filter((c) => c.status !== "RESOLVED");

  // Open diligence related to assumption or its conflicts
  const relatedConflictIds = relatedConflicts.map((c) => String(c.id));
  const openTasks = allTasks.filter(
    (t) =>
      t.status !== "COMPLETED" &&
      ((t.target_type === "Assumption" && t.target_id === String(assumption.id)) ||
        (t.target_type === "EvidenceConflict" && relatedConflictIds.includes(t.target_id)))
  );

  return (
    <div
      onClick={onClick}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors gap-4"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-relaxed truncate">{assumption.statement}</p>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs">
          {/* Evidence Balance */}
          <div className="text-muted-foreground font-medium">
            <span className={supportCount > 0 ? "text-green-700" : ""}>{supportCount} supporting</span>
            {" · "}
            <span className={contradictCount > 0 ? "text-red-700" : ""}>{contradictCount} contradicting</span>
          </div>
          
          {/* Conflict Summary */}
          {unresolvedConflicts.length > 0 ? (
            <div className="text-orange-700 font-medium bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
              {unresolvedConflicts.length} unresolved conflict{unresolvedConflicts.length > 1 ? "s" : ""}
            </div>
          ) : null}

          {/* Diligence State */}
          {openTasks.length > 0 ? (
            <div className="text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {openTasks.length} diligence open
            </div>
          ) : null}
        </div>
      </div>
      
      <div className="flex items-center gap-4 flex-shrink-0">
        <InvestmentStatus status={assumption.status} />
        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50 hidden sm:block" />
      </div>
    </div>
  );
}
