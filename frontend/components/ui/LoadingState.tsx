import { Loader2 } from "lucide-react"

export function LoadingState({ message = "Loading investment workflow..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground font-medium animate-pulse">{message}</p>
    </div>
  )
}
