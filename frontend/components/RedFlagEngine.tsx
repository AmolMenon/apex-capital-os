import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldAlert, Flag } from "lucide-react";

interface RedFlag {
  id: number;
  severity: string;
  confidence: number;
  reason: string;
  evidence: string;
  suggested_diligence: string;
}

export function RedFlagEngine({ dealId }: { dealId: number }) {
  const [flags, setFlags] = useState<RedFlag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dealId) {
      fetchFlags();
    }
  }, [dealId]);

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/deals/${dealId}/red-flags`);
      if (res.ok) {
        setFlags(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse h-32 bg-red-500/5 rounded-lg border border-red-500/20"></div>;
  
  if (flags.length === 0) return null;

  return (
    <Card className="border-red-500/30">
      <CardHeader className="pb-3 border-b border-border/50 bg-red-500/5">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-red-500">
            <ShieldAlert className="w-5 h-5" /> Devil's Advocate: Active Red Flags
          </CardTitle>
          <Badge variant="destructive">{flags.length} Critical Risks</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {flags.map((flag, index) => (
            <div key={index} className="p-4 bg-muted/10 hover:bg-muted/30 transition-colors">
              <div className="flex items-start gap-3">
                <Flag className={`w-5 h-5 shrink-0 mt-0.5 ${flag.severity === 'High' ? 'text-red-500' : 'text-amber-500'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{flag.reason}</h4>
                    <Badge variant="outline" className={flag.severity === 'High' ? 'border-red-500/50 text-red-500' : 'border-amber-500/50 text-amber-500'}>
                      {flag.severity} Severity ({flag.confidence}% Conf.)
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    <strong>Evidence:</strong> {flag.evidence}
                  </p>
                  <div className="bg-background border border-border/50 p-2 rounded text-xs">
                    <span className="font-semibold text-primary">Suggested Action:</span> {flag.suggested_diligence}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
