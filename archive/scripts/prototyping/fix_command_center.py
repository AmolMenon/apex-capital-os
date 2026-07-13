with open("frontend/app/command-center/page.tsx", "r") as f:
    content = f.read()

import re

injection = """
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Cpu className="w-5 h-5 text-indigo-500"/> Agentic Research Queue</h3>
          <div className="rounded-md border bg-card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="p-3 font-medium">Company</th>
                  <th className="p-3 font-medium">Workflow Status</th>
                  <th className="p-3 font-medium">Agents Run</th>
                  <th className="p-3 font-medium">IC Readiness</th>
                  <th className="p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pipelines?.Review?.map((d: any, i: number) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="p-3 font-medium">{d.name}</td>
                    <td className="p-3"><Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Completed</Badge></td>
                    <td className="p-3 text-muted-foreground">12 / 12</td>
                    <td className="p-3"><span className="text-xs font-semibold">{d.recommendation || "Not IC-ready"}</span></td>
                    <td className="p-3">
                      <a href={`/deal/${d.id}/agent-workflow`} className="text-indigo-600 hover:underline flex items-center gap-1 text-xs">
                        Open Trace <ArrowRight className="w-3 h-3"/>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
"""

if "Agentic Research Queue" not in content:
    content = content.replace(
        'import { Search, Briefcase, Activity, CheckCircle2, AlertTriangle, ArrowRight, XCircle, Globe } from "lucide-react"',
        'import { Search, Briefcase, Activity, CheckCircle2, AlertTriangle, ArrowRight, XCircle, Globe, Cpu } from "lucide-react"'
    )
    content = content.replace(
        '      </div>\n    </div>\n  )\n}\n',
        injection + '      </div>\n    </div>\n  )\n}\n'
    )
    with open("frontend/app/command-center/page.tsx", "w") as f:
        f.write(content)
