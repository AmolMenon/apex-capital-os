import re

with open("frontend/app/command-center/page.tsx", "r") as f:
    content = f.read()

# Add benchmark logic
if "const benchmarks = deals.filter" not in content:
    content = content.replace("const activeDeals = deals", "const benchmarks = deals.filter(d => d.is_public_benchmark || d.deal_type === 'real_benchmark')\n  const activeDeals = deals.filter(d => !d.is_public_benchmark && d.deal_type !== 'real_benchmark')")

benchmark_html = """
          <Card className="mb-6 border-blue-200">
            <CardHeader className="bg-blue-50/50 pb-3">
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Public Startup Benchmarks
              </CardTitle>
              <CardDescription className="text-blue-700">Source-backed public profiles for comparison.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Public Signal</TableHead>
                    <TableHead>Data Completeness</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benchmarks.slice(0, 5).map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.startup_name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{b.sector}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700">High</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-yellow-500"></span> Partial (Public Only)
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/deal/${b.id}/deal-room`}>
                          <Button variant="ghost" size="sm" className="h-8">Open <ArrowRight className="ml-2 w-3 h-3" /></Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
"""

if "Public Startup Benchmarks" not in content:
    content = content.replace("<div className=\"col-span-2 space-y-6\">", f"<div className=\"col-span-2 space-y-6\">\n{benchmark_html}")
    content = content.replace("import { AlertTriangle, Zap, MessageSquare, ArrowRight, Database } from \"lucide-react\"", "import { AlertTriangle, Zap, MessageSquare, ArrowRight, Database, ShieldCheck } from \"lucide-react\"")

with open("frontend/app/command-center/page.tsx", "w") as f:
    f.write(content)

