with open("frontend/app/compare/page.tsx", "r") as f:
    content = f.read()

import re

# Just adding a simple Agentic Research section to the compare page
injection = """
        <div className="mt-8">
          <h3 className="font-bold mb-4">Agentic Research Workflow</h3>
          <div className="grid grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border">
            <div className="font-semibold text-sm">Agents Run</div>
            <div className="text-sm">12 / 12</div>
            <div className="text-sm">12 / 12</div>
            <div className="text-sm">12 / 12</div>
            
            <div className="font-semibold text-sm">IC Readiness</div>
            <div className="text-sm text-amber-600">Diligence Required</div>
            <div className="text-sm text-red-600">Outside Mandate</div>
            <div className="text-sm text-amber-600">Diligence Required</div>
            
            <div className="font-semibold text-sm">Red Team Severity</div>
            <div className="text-sm">Medium</div>
            <div className="text-sm">Low</div>
            <div className="text-sm">Medium</div>
          </div>
        </div>
"""

if "Agentic Research Workflow" not in content:
    content = content.replace(
        '        <div className="text-xs text-muted-foreground mt-8 text-center">',
        injection + '\n        <div className="text-xs text-muted-foreground mt-8 text-center">'
    )
    with open("frontend/app/compare/page.tsx", "w") as f:
        f.write(content)
