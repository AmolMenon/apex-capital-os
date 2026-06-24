import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FundProfileCard({ profile }: { profile: any }) {
  if (!profile) return null;
  
  return (
    <Card className="border-muted bg-card">
      <CardHeader>
        <CardTitle className="text-xl">{profile.fund_name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Fund Size</p>
            <p className="font-semibold text-lg">₹{(profile.fund_size / 10000000).toFixed(0)} Cr</p>
          </div>
          <div>
            <p className="text-muted-foreground">Target Portfolio</p>
            <p className="font-semibold text-lg">{profile.portfolio_target_min}-{profile.portfolio_target_max} companies</p>
          </div>
          <div>
            <p className="text-muted-foreground">Reserve Ratio</p>
            <p className="font-semibold text-lg">{profile.reserve_ratio_initial * 100}% / {profile.reserve_ratio_follow_on * 100}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Return Objective</p>
            <p className="font-semibold text-lg">{profile.return_objective_net_moic}x Net</p>
          </div>
        </div>
        
        <div>
          <p className="text-muted-foreground text-sm mb-2">Strategy</p>
          <p className="text-sm border-l-2 border-primary pl-3 py-1 bg-muted/20">{profile.strategy}</p>
        </div>
        
        <div>
          <p className="text-muted-foreground text-sm mb-2">Target Sectors</p>
          <div className="flex flex-wrap gap-2">
            {profile.target_sectors.map((sector: string) => (
              <Badge key={sector} variant="secondary" className="bg-primary/10 text-primary">{sector}</Badge>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-2">
          {Object.entries(profile.target_ownership).map(([stage, ownership]) => (
            <div key={stage} className="bg-muted/30 p-2 rounded-md">
              <p className="text-xs text-muted-foreground">{stage}</p>
              <p className="font-medium text-sm">Own: {ownership as string}</p>
              <p className="text-xs text-muted-foreground mt-1">Check: {profile.check_sizes[stage]}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
