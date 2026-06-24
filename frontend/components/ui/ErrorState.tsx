import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ErrorState({ message = "Could not load this page. Check that the backend API server is running." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center max-w-md mx-auto">
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground mb-2">System Error</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
        <Link href="/command-center">
          <Button variant="default">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
