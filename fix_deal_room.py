with open("frontend/app/deal/[id]/deal-room/page.tsx", "r") as f:
    content = f.read()

import re

injection = """
            {deal.agent_workflow && deal.agent_workflow.final_report && (
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800 mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4"/> Agentic Research Report
                </h4>
                <p className="text-sm font-medium leading-snug text-indigo-900">{deal.agent_workflow.final_report.public_benchmark_conclusion}</p>
                <div className="mt-2 text-xs text-indigo-700 flex gap-4">
                  <span>Agents Run: <span className="font-bold">{deal.agent_workflow.agents_run?.length || 0}/12</span></span>
                  <span>IC Status: <span className="font-bold">{deal.agent_workflow.final_report.ic_readiness_status}</span></span>
                </div>
              </div>
            )}
"""

if "Agentic Research Report" not in content:
    content = content.replace(
        'import { Target, AlertTriangle, Sparkles, Globe } from "lucide-react"',
        'import { Target, AlertTriangle, Sparkles, Globe, Cpu } from "lucide-react"'
    )
    content = content.replace(
        '{webResearch && webResearch.vc_synthesis && (',
        injection + '\n            {webResearch && webResearch.vc_synthesis && ('
    )
    with open("frontend/app/deal/[id]/deal-room/page.tsx", "w") as f:
        f.write(content)
