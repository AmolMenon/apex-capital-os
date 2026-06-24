import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
  const bgClass = ""

  if (status.toLowerCase().includes("invest") || status.toLowerCase().includes("verified") || status.toLowerCase().includes("complete")) {
    variant = "default"
  } else if (status.toLowerCase().includes("watch") || status.toLowerCase().includes("progress")) {
    variant = "secondary"
  } else if (status.toLowerCase().includes("pass") || status.toLowerCase().includes("high") || status.toLowerCase().includes("critical") || status.toLowerCase().includes("block")) {
    variant = "destructive"
  }

  return (
    <Badge variant={variant} className={cn("whitespace-nowrap font-medium", bgClass, className)}>
      {status}
    </Badge>
  )
}
