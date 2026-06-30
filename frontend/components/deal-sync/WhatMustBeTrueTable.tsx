import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { WhatMustBeTrue } from "@/types"

export function WhatMustBeTrueTable({ items }: { items?: WhatMustBeTrue[] }) {
  if (!items || items.length === 0) return <div>No data available.</div>

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Proven": return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
      case "Partially Supported": return "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
      case "Assumption": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Contradicted": return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[30%]">Statement</TableHead>
            <TableHead>Why It Matters</TableHead>
            <TableHead>Current Evidence</TableHead>
            <TableHead>Proof Required</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(items || []).map((item, i) => (
            <TableRow key={i} className="group">
              <TableCell className="font-medium align-top">
                {item.statement}
                <div className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
                  Owner: {item.diligence_owner}
                </div>
              </TableCell>
              <TableCell className="text-sm align-top">{item.why_it_matters}</TableCell>
              <TableCell className="text-sm align-top">
                <div className="mb-1">{item.current_evidence}</div>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className="text-[10px]">{item.evidence_source}</Badge>
                  <Badge variant="outline" className="text-[10px]">Conf: {item.confidence}</Badge>
                </div>
              </TableCell>
              <TableCell className="text-sm align-top">
                <ul className="list-disc pl-4 space-y-1">
                  {(item.required_proof || []).map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              </TableCell>
              <TableCell className="align-top">
                <Badge variant="outline" className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
