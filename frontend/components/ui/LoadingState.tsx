import { Loader2, BrainCircuit } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function LoadingState({ message = "AI is assembling intelligence..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
          <BrainCircuit className="w-10 h-10 text-primary relative animate-bounce" />
        </div>
        <p className="text-lg font-semibold tracking-tight animate-pulse bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">{message}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl opacity-50">
        <Card className="border-primary/10">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <Card className="border-primary/10 md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
