with open("frontend/app/command-center/page.tsx", "r") as f:
    content = f.read()

import re

portfolio_card = """
      {/* Portfolio Intelligence Snapshot */}
      <div className="grid grid-cols-1 mb-8">
        <Card className="bg-gradient-to-r from-zinc-900 to-indigo-950 border-indigo-900/50">
          <CardHeader>
            <CardTitle className="text-xl font-light text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              Portfolio Intelligence Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Active Portfolio</p>
                <div className="text-2xl font-semibold text-white">6 Companies</div>
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Portfolio Health</p>
                <div className="text-2xl font-semibold text-emerald-400">85 / 100</div>
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Follow-On Ready</p>
                <div className="text-2xl font-semibold text-amber-400">2 Candidates</div>
              </div>
              <div className="flex items-center">
                <Link href="/portfolio" className="w-full">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Open Portfolio HQ</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
"""

# Insert imports
content = re.sub(r'import { CheckCircle2, AlertCircle, ArrowRight, ShieldAlert, FileText, Cpu, Database, Target, PlayCircle, StopCircle, RefreshCw } from "lucide-react";', 
                 'import { CheckCircle2, AlertCircle, ArrowRight, ShieldAlert, FileText, Cpu, Database, Target, PlayCircle, StopCircle, RefreshCw, PieChart } from "lucide-react";', 
                 content)

# Replace the grid start
content = content.replace('      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">', portfolio_card, 1)

with open("frontend/app/command-center/page.tsx", "w") as f:
    f.write(content)
