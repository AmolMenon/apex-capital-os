import React from "react";
import { Assumption, Conflict, DiligenceTask, Finding, ClaimLink } from "@/types/investment-case";
import { InvestmentStatus } from "./InvestmentStatus";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { FileText, AlertTriangle, HelpCircle, CornerDownRight } from "lucide-react";

interface AssumptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assumption: Assumption | null;
  allConflicts: Conflict[];
  allTasks: DiligenceTask[];
  allFindings: Finding[];
}

export function AssumptionDrawer({ isOpen, onClose, assumption, allConflicts, allTasks, allFindings }: AssumptionDrawerProps) {
  if (!assumption) return null;

  const supports = assumption.claims.filter((c) => c.relationship === "SUPPORTS");
  const contradicts = assumption.claims.filter((c) => c.relationship === "CONTRADICTS");
  const contexts = assumption.claims.filter((c) => c.relationship === "CONTEXT");

  const claimIds = assumption.claims.map((c) => c.claim_id);
  
  const relatedConflicts = allConflicts.filter(
    (c) => claimIds.includes(c.claim_a_id) || claimIds.includes(c.claim_b_id)
  );

  const relatedConflictIds = relatedConflicts.map((c) => String(c.id));
  
  const relatedTasks = allTasks.filter(
    (t) =>
      (t.target_type === "Assumption" && t.target_id === String(assumption.id)) ||
      (t.target_type === "EvidenceConflict" && relatedConflictIds.includes(t.target_id))
  );

  const taskIds = relatedTasks.map(t => t.id);
  const relatedFindings = allFindings.filter(f => taskIds.includes(f.task_id));

  const unresolvedConflictsCount = relatedConflicts.filter(c => c.status !== "RESOLVED").length;
  const completedFindingsCount = relatedFindings.length;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-card p-0 border-l border-border">
        <div className="p-6 border-b border-border bg-muted/20">
          <SheetHeader>
            <SheetTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-2">Assumption</SheetTitle>
            <SheetDescription className="text-lg font-bold text-foreground leading-snug">
              {assumption.statement}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Current State</h4>
            <div className="flex items-center gap-3">
              <InvestmentStatus status={assumption.status} className="text-sm px-3 py-1" />
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Why This State?</h4>
            <div className="text-sm text-foreground space-y-2 bg-background p-3 rounded-md border">
              {supports.length > 0 && <p className="text-green-700">✓ {supports.length} supporting claim{supports.length > 1 ? "s" : ""} linked.</p>}
              {contradicts.length > 0 && <p className="text-red-700">✗ {contradicts.length} contradictory claim{contradicts.length > 1 ? "s" : ""} linked.</p>}
              {unresolvedConflictsCount > 0 && <p className="text-orange-700">⚠ {unresolvedConflictsCount} active evidence conflict{unresolvedConflictsCount > 1 ? "s" : ""} unresolved.</p>}
              {completedFindingsCount > 0 && <p className="text-blue-700">ℹ {completedFindingsCount} completed diligence finding{completedFindingsCount > 1 ? "s" : ""} recorded.</p>}
              {supports.length === 0 && contradicts.length === 0 && unresolvedConflictsCount === 0 && completedFindingsCount === 0 && (
                <p className="text-muted-foreground italic">No evidence or diligence currently linked to this assumption.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* EVIDENCE COVERAGE */}
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4" /> Evidence Coverage
            </h3>
            
            <div className="space-y-4">
              {supports.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-green-700 mb-2 uppercase">Supporting Claims</h4>
                  <ul className="space-y-2">
                    {supports.map(c => (
                      <li key={c.claim_id} className="text-sm bg-background p-3 rounded border border-green-100 flex items-start gap-2 shadow-sm">
                        <CornerDownRight className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                        <div>
                          <span className="font-medium">Claim ID: {c.claim_id}</span>
                          <p className="text-xs text-muted-foreground mt-1">Provenance attached in evidence registry.</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {contradicts.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-red-700 mb-2 uppercase">Contradictory Claims</h4>
                  <ul className="space-y-2">
                    {contradicts.map(c => (
                      <li key={c.claim_id} className="text-sm bg-background p-3 rounded border border-red-100 flex items-start gap-2 shadow-sm">
                        <CornerDownRight className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                        <div>
                          <span className="font-medium">Claim ID: {c.claim_id}</span>
                          <p className="text-xs text-muted-foreground mt-1">Provenance attached in evidence registry.</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {supports.length === 0 && contradicts.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No evidence claims are linked.</p>
              )}
            </div>
          </div>

          {/* ACTIVE CONFLICTS */}
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4" /> Active Conflicts
            </h3>
            {relatedConflicts.length > 0 ? (
              <div className="space-y-3">
                {relatedConflicts.map(c => (
                  <div key={c.id} className="border p-3 rounded-md text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Conflict #{c.id}</span>
                      <InvestmentStatus status={c.status} />
                    </div>
                    <p className="text-muted-foreground text-xs">Claims {c.claim_a_id} vs {c.claim_b_id}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No related conflicts.</p>
            )}
          </div>

          {/* DILIGENCE */}
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4" /> Diligence & Findings
            </h3>
            {relatedTasks.length > 0 ? (
              <div className="space-y-4">
                {relatedTasks.map(t => {
                  const taskFindings = relatedFindings.filter(f => f.task_id === t.id);
                  return (
                    <div key={t.id} className="border p-3 rounded-md text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Task #{t.id}</span>
                        <InvestmentStatus status={t.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">Target: {t.target_type} #{t.target_id}</p>
                      
                      {taskFindings.map(f => (
                        <div key={f.id} className="mt-2 pt-2 border-t border-dashed">
                          <p className="text-xs font-semibold mb-1">Finding #{f.id}</p>
                          <div className="flex gap-2">
                            {f.resolution_effect && <InvestmentStatus status={f.resolution_effect} />}
                            {f.assumption_effect && <InvestmentStatus status={f.assumption_effect} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No diligence questions generated yet.</p>
            )}
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
