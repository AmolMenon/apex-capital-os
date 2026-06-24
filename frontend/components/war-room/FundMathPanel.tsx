import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ValuationSensitivity, OwnershipScenario, FundReturnScenario } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, PieChart, TrendingUp, DollarSign, Calculator } from "lucide-react"

export function FundMathPanel({ 
  valuationSensitivity, 
  ownershipScenarios, 
  fundReturnScenarios 
}: { 
  valuationSensitivity?: ValuationSensitivity, 
  ownershipScenarios?: OwnershipScenario[], 
  fundReturnScenarios?: FundReturnScenario[] 
}) {
  if (!valuationSensitivity) return <div>No fund math available.</div>

  const formatCurrency = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`
    return `$${val.toLocaleString()}`
  }

  const formatPercent = (val: number) => `${val.toFixed(1)}%`

  return (
    <div className="space-y-8">
      
      {valuationSensitivity.warnings && valuationSensitivity.warnings.length > 0 && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-amber-800 dark:text-amber-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Valuation & Ownership Warnings
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 pb-4">
            <ul className="list-disc pl-5 space-y-1 text-sm text-amber-900 dark:text-amber-200">
              {(valuationSensitivity.warnings || []).map((w, i) => <li key={i}>{w}</li>)}
              {ownershipScenarios?.[0]?.warnings?.map((w, i) => <li key={`ow-${i}`}>{w}</li>)}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" /> Assumed Entry Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(valuationSensitivity.assumed_entry_valuation)}</div>
            <div className="text-xs text-muted-foreground mt-1">Latest known: {valuationSensitivity.latest_known_valuation}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground flex items-center gap-1"><PieChart className="h-3 w-3" /> Target Ownership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatPercent(valuationSensitivity.target_ownership)}</div>
            <div className="text-xs text-muted-foreground mt-1">Cheque size: {formatCurrency(valuationSensitivity.cheque_size)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Expected Dilution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{valuationSensitivity.dilution_assumptions}</div>
            <div className="text-xs text-muted-foreground mt-1">Before exit</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground flex items-center gap-1"><Calculator className="h-3 w-3" /> Required Exit for 1x Fund</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {fundReturnScenarios && fundReturnScenarios.length > 0 ? formatCurrency(fundReturnScenarios[0].required_exit_for_1x) : formatCurrency(valuationSensitivity.required_exit_value)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Based on {ownershipScenarios?.[0]?.fund_size ? formatCurrency(ownershipScenarios[0].fund_size) : "fund"} size</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Valuation Sensitivity Scenarios</CardTitle>
          <CardDescription>How exit valuation impacts fund return</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Scenario</TableHead>
                  <TableHead className="text-right">Entry Val</TableHead>
                  <TableHead className="text-right">Exit Val</TableHead>
                  <TableHead className="text-right">Entry Own %</TableHead>
                  <TableHead className="text-right">Exit Own %</TableHead>
                  <TableHead className="text-right">Proceeds</TableHead>
                  <TableHead className="text-right">Fund Multiple</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(valuationSensitivity.scenarios || []).map((s, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold">{s.scenario_name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(s.entry_valuation)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(s.exit_valuation)}</TableCell>
                    <TableCell className="text-right">{formatPercent(s.ownership_at_entry)}</TableCell>
                    <TableCell className="text-right">{formatPercent(s.ownership_at_exit)}</TableCell>
                    <TableCell className="text-right text-green-600 dark:text-green-400 font-medium">{formatCurrency(s.fund_return)}</TableCell>
                    <TableCell className="text-right">{s.fund_multiple_contribution.toFixed(2)}x</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
