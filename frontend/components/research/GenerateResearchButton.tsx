"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function GenerateResearchButton({ dealId }: { dealId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/research/${dealId}`, {
        method: "POST"
      });
      if (res.ok) {
        router.refresh();
      } else {
        console.error("Failed to generate research");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleGenerate} disabled={loading} variant="default">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {loading ? "Generating..." : "Generate Research Brief"}
    </Button>
  );
}
