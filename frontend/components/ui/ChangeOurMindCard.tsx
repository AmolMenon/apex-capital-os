import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleArrowUp, CircleArrowDown, CircleX } from "lucide-react"

interface ChangeOurMindCardProps {
  upgradeTriggers: string[]
  downgradeTriggers: string[]
  passTriggers: string[]
}

export function ChangeOurMindCard({ upgradeTriggers, downgradeTriggers, passTriggers }: ChangeOurMindCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-muted/30 pb-3 border-b">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">What Would Change Our Mind?</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <CircleArrowUp className="w-5 h-5" />
              <h4 className="font-semibold text-sm">Upgrade Case</h4>
            </div>
            <ul className="space-y-3">
              {upgradeTriggers.map((t, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-emerald-500/50 mt-0.5">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <CircleArrowDown className="w-5 h-5" />
              <h4 className="font-semibold text-sm">Downgrade Case</h4>
            </div>
            <ul className="space-y-3">
              {downgradeTriggers.map((t, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-amber-500/50 mt-0.5">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 space-y-4 bg-destructive/5">
            <div className="flex items-center gap-2 text-destructive">
              <CircleX className="w-5 h-5" />
              <h4 className="font-semibold text-sm">Pass Conditions</h4>
            </div>
            <ul className="space-y-3">
              {passTriggers.map((t, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-destructive/50 mt-0.5">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
