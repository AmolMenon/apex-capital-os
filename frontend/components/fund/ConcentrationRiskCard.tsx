import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function ConcentrationRiskCard({ data }: { data: any }) {
  if (!data) return null;
  
  const isHighRisk = data.concentration_risk_score > 60;
  const isMediumRisk = data.concentration_risk_score > 30 && !isHighRisk;
  
  return (
    <Card className={`border-muted bg-card h-full ${isHighRisk ? 'border-red-500/50' : ''}`}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          Concentration Risk
          <span className={`text-sm px-2 py-1 rounded-full font-medium ${
            isHighRisk ? 'bg-red-500/20 text-red-600' :
            isMediumRisk ? 'bg-yellow-500/20 text-yellow-600' :
            'bg-green-500/20 text-green-600'
          }`}>
            Score: {data.concentration_risk_score}/100
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {data.major_warnings.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-1.5 text-red-500">
              <AlertCircle className="w-4 h-4" /> Portfolio Warnings
            </h4>
            <ul className="space-y-1.5">
              {data.major_warnings.map((warn: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2 items-start">
                  <span className="text-red-500 mt-1">•</span> {warn}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-3 bg-green-500/10 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-700 dark:text-green-400">Portfolio is well-diversified across sectors and stages.</span>
          </div>
        )}

        {data.suggested_actions.length > 0 && (
          <div className="pt-2">
            <h4 className="text-sm font-semibold mb-2">Recommended Actions</h4>
            <div className="bg-muted/30 p-3 rounded-lg space-y-2">
              {data.suggested_actions.map((action: string, i: number) => (
                <p key={i} className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">Action:</span> {action}
                </p>
              ))}
            </div>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
}
