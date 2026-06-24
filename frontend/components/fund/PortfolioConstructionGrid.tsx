import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function PortfolioConstructionGrid({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <Card className="border-muted bg-card h-full">
      <CardHeader>
        <CardTitle className="text-xl">Portfolio Construction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground text-sm">Active Deals</p>
            <p className="font-semibold text-2xl">{data.active_pipeline_count}</p>
          </div>
          <div className="p-3 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground text-sm">Avg Apex Score</p>
            <p className="font-semibold text-2xl">{data.average_apex_score.toFixed(0)}</p>
          </div>
          <div className="p-3 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground text-sm">Avg IC Readiness</p>
            <p className="font-semibold text-2xl">{data.average_ic_readiness.toFixed(0)}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Deals by Sector</h4>
          <div className="space-y-3">
            {Object.entries(data.deals_by_sector).map(([sector, count]) => (
              <div key={sector}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{sector}</span>
                  <span className="font-medium">{count as number}</span>
                </div>
                <Progress value={((count as number) / data.active_pipeline_count) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-3">Deals by Stage</h4>
          <div className="space-y-3">
            {Object.entries(data.deals_by_stage).map(([stage, count]) => (
              <div key={stage}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{stage}</span>
                  <span className="font-medium">{count as number}</span>
                </div>
                <Progress value={((count as number) / data.active_pipeline_count) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
