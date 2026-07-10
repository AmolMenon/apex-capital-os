import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InvestmentCaseService } from "@/services/investment-case";
import { useInvestmentCase } from "@/context/InvestmentCaseContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ConflictLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisionId: string;
}

export function ConflictLogModal({ isOpen, onClose, decisionId }: ConflictLogModalProps) {
  const { refreshInvestmentCase } = useInvestmentCase();
  const [allClaims, setAllClaims] = useState<any[]>([]);
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);
  
  const [claimAId, setClaimAId] = useState<string>("");
  const [claimBId, setClaimBId] = useState<string>("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingClaims(true);
      InvestmentCaseService.getClaimInventory(decisionId)
        .then(setAllClaims)
        .catch(() => setError("Failed to load claims inventory"))
        .finally(() => setIsLoadingClaims(false));
    } else {
      setClaimAId("");
      setClaimBId("");
      setError(null);
    }
  }, [isOpen, decisionId]);

  const handleSubmit = async () => {
    if (!claimAId || !claimBId) {
      setError("Please select two distinct claims.");
      return;
    }
    if (claimAId === claimBId) {
      setError("Claim A and Claim B cannot be the same.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await InvestmentCaseService.logConflict(
        decisionId,
        parseInt(claimAId, 10),
        parseInt(claimBId, 10)
      );
      await refreshInvestmentCase();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to log conflict");
    } finally {
      setIsSubmitting(false);
    }
  };

  const claimAObj = allClaims.find((c) => String(c.id) === claimAId);
  const claimBObj = allClaims.find((c) => String(c.id) === claimBId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log Evidence Conflict</DialogTitle>
          <DialogDescription>
            Flag two extracted claims belonging to this deal that appear to contradict each other.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-orange-700">Claim A</label>
              <Select value={claimAId} onValueChange={setClaimAId} disabled={isSubmitting || isLoadingClaims}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Claim A..." />
                </SelectTrigger>
                <SelectContent>
                  {allClaims.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)} disabled={String(c.id) === claimBId}>
                      [#{c.id}] {c.statement.substring(0, 50)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {claimAObj && (
                <div className="mt-2 p-3 bg-muted/30 border rounded text-sm text-foreground">
                  {claimAObj.statement}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-orange-700">Claim B</label>
              <Select value={claimBId} onValueChange={setClaimBId} disabled={isSubmitting || isLoadingClaims}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Claim B..." />
                </SelectTrigger>
                <SelectContent>
                  {allClaims.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)} disabled={String(c.id) === claimAId}>
                      [#{c.id}] {c.statement.substring(0, 50)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {claimBObj && (
                <div className="mt-2 p-3 bg-muted/30 border rounded text-sm text-foreground">
                  {claimBObj.statement}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Log Conflict
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
