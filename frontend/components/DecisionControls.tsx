import { useState } from "react";
import { Check, X, Search, MessageSquareWarning } from "lucide-react";

export function DecisionControls() {
  const [challengeMode, setChallengeMode] = useState(false);
  const [challengeText, setChallengeText] = useState("");

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeText.trim()) return;
    console.log("Challenge submitted:", challengeText);
    setChallengeMode(false);
    setChallengeText("");
    // In a real app, this would dispatch an event to the EventBus
  };

  return (
    <div className="flex flex-col gap-3">
      {challengeMode ? (
        <form onSubmit={handleChallengeSubmit} className="flex flex-col gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50 animate-in fade-in zoom-in-95 duration-200">
          <label className="text-sm font-medium text-foreground">Challenge AI Assumption</label>
          <textarea
            autoFocus
            value={challengeText}
            onChange={(e) => setChallengeText(e.target.value)}
            placeholder="e.g. The CAC assumption seems too low for this market. Re-evaluate."
            className="w-full text-sm p-2 rounded border bg-card focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px]"
          />
          <div className="flex items-center gap-2 mt-1 justify-end">
            <button 
              type="button" 
              onClick={() => setChallengeMode(false)}
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Submit Challenge
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-success text-success-foreground font-medium rounded-md text-sm hover:bg-success/90 transition-colors shadow-sm">
            <Check className="w-4 h-4" /> Approve
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium rounded-md text-sm transition-colors border border-destructive/20">
            <X className="w-4 h-4" /> Reject
          </button>
          <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
          <button 
            onClick={() => setChallengeMode(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-md text-sm transition-colors"
          >
            <MessageSquareWarning className="w-4 h-4" /> Challenge AI
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-md text-sm transition-colors">
            <Search className="w-4 h-4" /> Request Research
          </button>
        </div>
      )}
    </div>
  );
}
