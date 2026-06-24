import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldCheck, Info, FileSearch } from "lucide-react"

export function PublicBenchmarkBadge({ isPublic }: { isPublic?: boolean }) {
  if (!isPublic) return null
  return (
    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
      <ShieldCheck className="w-3 h-3 mr-1" />
      Public Benchmark
    </Badge>
  )
}

export function BenchmarkWarning({ isPublic }: { isPublic?: boolean }) {
  if (!isPublic) return null
  return (
    <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-800 dark:text-blue-200">Real Startup Benchmark Mode</AlertTitle>
      <AlertDescription className="text-blue-700 dark:text-blue-300">
        This is a public benchmark analysis based solely on publicly available information. 
        Private diligence data (like ARR, customer concentration, and retention) are analyst assumptions unless specifically sourced. 
        This is not an investment recommendation.
      </AlertDescription>
    </Alert>
  )
}

export function SourceConfidenceBadge({ confidence }: { confidence?: string }) {
  if (!confidence) return null
  
  const colors: Record<string, string> = {
    High: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800",
    Medium: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
    Low: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
  }
  
  const bg = colors[confidence] || "bg-muted/50 text-foreground"
  
  return (
    <Badge variant="outline" className={bg}>
      Source Confidence: {confidence}
    </Badge>
  )
}

export function SourceRegistryTable({ sources }: { sources: any[] }) {
  if (!sources || sources.length === 0) return null
  
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-sm mb-2 flex items-center">
        <FileSearch className="w-4 h-4 mr-2 text-gray-500" />
        Public Source Registry
      </h3>
      <div className="border rounded-md overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-muted/20 border-b">
            <tr>
              <th className="p-2 font-medium">Source</th>
              <th className="p-2 font-medium">Type</th>
              <th className="p-2 font-medium">Key Claims</th>
              <th className="p-2 font-medium">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sources.map((s, idx) => (
              <tr key={idx} className="bg-background/40">
                <td className="p-2 text-blue-600 dark:text-blue-400 underline">
                  <a href={s.source_url} target="_blank" rel="noreferrer">{s.source_title}</a>
                </td>
                <td className="p-2 capitalize">{s.source_type}</td>
                <td className="p-2 text-muted-foreground">
                  <ul className="list-disc pl-4">
                    {s.claims_supported.map((c: string, i: number) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-2">
                  <SourceConfidenceBadge confidence={s.confidence} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
