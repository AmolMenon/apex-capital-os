import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FundReturnSimulation({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <Card className="border-muted bg-card h-full">
      <CardHeader>
        <CardTitle className="text-xl">Fund Return Simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Expected MOIC</p>
            <p className="text-3xl font-bold text-primary">{data.expected_fund_moic.toFixed(2)}x</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Expected TVPI</p>
            <p className="text-xl font-semibold">₹{(data.expected_total_value / 10000000).toFixed(0)} Cr</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Projected Outcomes ({data.portfolio_size} Deals)</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Fund Returners (&gt;50x)</span>
              <Badge variant="default" className="bg-green-500/20 text-green-600 border-none">{data.expected_winners} deals</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Breakouts (10-30x)</span>
              <span className="font-medium">{data.expected_breakouts} deals</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Good Exits (3-5x)</span>
              <span className="font-medium">{data.expected_good_exits} deals</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Small/No Return (1x)</span>
              <span className="font-medium">{data.expected_small_exits} deals</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Write-offs (0x)</span>
              <span className="font-medium text-red-500/70">{data.expected_write_offs} deals</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground italic">
            * Simulation based on current portfolio composition and Power Law probability distributions. Actual returns will vary.
          </p>
        </div>
        
      </CardContent>
    </Card>
  );
}
