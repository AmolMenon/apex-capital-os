import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "ai"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80": variant === "default",
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "border-transparent bg-rose-500/15 text-rose-600 dark:text-rose-400": variant === "destructive",
          "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400": variant === "success",
          "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400": variant === "warning",
          "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400": variant === "ai",
          "text-foreground border-border/50": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
