import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  description?: string
  trend?: string
  trendDirection?: "up" | "down" | "neutral"
  className?: string
  valueClassName?: string
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  trendDirection,
  className,
  valueClassName 
}: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground opacity-70" />}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold text-foreground tracking-tight", valueClassName)}>
          {value}
        </div>
        {(description || trend) && (
          <div className="flex items-center text-xs mt-1">
            {trend && (
              <span className={cn(
                "mr-2 font-medium",
                trendDirection === "up" ? "text-emerald-500" :
                trendDirection === "down" ? "text-rose-500" : "text-muted-foreground"
              )}>
                {trend}
              </span>
            )}
            {description && <span className="text-muted-foreground">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
