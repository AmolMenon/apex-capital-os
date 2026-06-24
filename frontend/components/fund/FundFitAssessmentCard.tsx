import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function FundFitAssessmentCard({ assessment }: { assessment: any }) {
  if (!assessment) return null;
  
  const fitScore = assessment.thesis_fit_score;
  const isStrongFit = fitScore >= 80;
  const isGoodFit = fitScore >= 60 && fitScore < 80;
  
  return (
    <Card className="border-muted bg-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          Fund Fit Analysis
          <Badge className={
            isStrongFit ? 'bg-green-500/20 text-green-600 hover:bg-green-500/30' :
            isGoodFit ? 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30' :
            'bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30'
          }>
            {assessment.thesis_fit.verdict} ({fitScore}/100)
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="p-4 bg-muted/20 rounded-lg border-l-4 border-primary">
          <p className="text-sm font-semibold mb-1">IC Recommendation</p>
          <p className="text-lg font-medium">{assessment.recommendation}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Fund Potential</p>
            <p className="font-semibold">{assessment.fund_return_potential}</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Target Ownership</p>
            <p className="font-semibold">{(assessment.target_ownership * 100).toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Initial Check</p>
            <p className="font-semibold">₹{(assessment.initial_check_size / 10000000).toFixed(1)} Cr</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Exit Req (1x Fund)</p>
            <p className="font-semibold">₹{(assessment.required_exit_value_for_1x_fund / 10000000).toFixed(0)} Cr</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Thesis Alignment</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Sector Fit</span>
                  <span>{assessment.thesis_fit.sector_fit}/10</span>
                </div>
                <Progress value={assessment.thesis_fit.sector_fit * 10} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Stage Fit</span>
                  <span>{assessment.thesis_fit.stage_fit}/10</span>
                </div>
                <Progress value={assessment.thesis_fit.stage_fit * 10} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Ownership Feasibility</span>
                  <span>{assessment.thesis_fit.ownership_feasibility}/10</span>
                </div>
                <Progress value={assessment.thesis_fit.ownership_feasibility * 10} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Power Law Potential</span>
                  <span>{assessment.thesis_fit.power_law_potential}/10</span>
                </div>
                <Progress value={assessment.thesis_fit.power_law_potential * 10} className="h-1.5" />
              </div>
            </div>
          </div>
        </div>

        {assessment.key_constraints && assessment.key_constraints.length > 0 && (
          <div className="pt-2">
            <h4 className="text-sm font-semibold mb-2 text-yellow-600 dark:text-yellow-500">Key Constraints / What Must Be True</h4>
            <ul className="space-y-2 bg-yellow-500/5 p-3 rounded-lg border border-yellow-500/20">
              {assessment.key_constraints.map((constraint: string, idx: number) => (
                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-yellow-500">•</span> {constraint}
                </li>
              ))}
            </ul>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
