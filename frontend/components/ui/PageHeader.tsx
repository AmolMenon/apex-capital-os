import { Badge } from "@/components/ui/badge"

export function PageHeader({ 
  title, 
  subtitle, 
  badge 
}: { 
  title: string, 
  subtitle?: string, 
  badge?: string 
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {badge && <Badge variant="secondary" className="font-mono">{badge}</Badge>}
        </div>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
