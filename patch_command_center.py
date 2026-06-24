with open("frontend/app/command-center/page.tsx", "r") as f:
    content = f.read()

injection_point = """
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg dark:bg-emerald-900/30">
              <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Private Data Room Demo</h2>
              <p className="text-sm text-neutral-500">Showcase diligence parsing vs public benchmark.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm">Use <strong>NeuralDesk</strong> to show how Apex parses private diligence materials, extracts metrics, detects contradictions, and upgrades IC readiness.</p>
            <p className="text-sm">Use <strong>Sarvam AI</strong> to show public benchmark analysis where private data is missing, keeping IC readiness capped.</p>
            
            <div className="flex flex-col space-y-2 mt-4">
              <Link href="/deals/1/data-room">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Open NeuralDesk Data Room</Button>
              </Link>
              <Link href="/deals/2/data-room">
                <Button variant="outline" className="w-full">Open Sarvam Benchmark Contrast</Button>
              </Link>
            </div>
          </div>
        </Card>
"""

if "Private Data Room Demo" not in content:
    content = content.replace("</div>\n    </div>", "</div>\n" + injection_point + "\n    </div>")
    # Also add Database icon import if needed. We'll just assume it's there or use an existing icon.
    if "Database," not in content and "Database" not in content:
         content = content.replace("import { Play, RotateCcw, AlertTriangle, FileText, Bot, BrainCircuit, Activity, Cpu } from \"lucide-react\"", "import { Play, RotateCcw, AlertTriangle, FileText, Bot, BrainCircuit, Activity, Cpu, Database } from \"lucide-react\"")

    with open("frontend/app/command-center/page.tsx", "w") as f:
        f.write(content)

with open("frontend/app/system-status/page.tsx", "r") as f:
    status_content = f.read()

status_injection = """
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg dark:bg-blue-900/30">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold">Data Room Engine</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b pb-2">
              <span className="text-neutral-500">Service Status</span>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center text-sm border-b pb-2">
              <span className="text-neutral-500">Storage Provider</span>
              <span className="font-mono">local</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b pb-2">
              <span className="text-neutral-500">Parsers</span>
              <span className="font-mono text-emerald-600">Online</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-2">
              <span className="text-neutral-500">File Types</span>
              <span className="font-mono">pdf, csv, xlsx, docx</span>
            </div>
          </div>
        </Card>
"""

if "Data Room Engine" not in status_content:
    status_content = status_content.replace('className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">', 'className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">\n' + status_injection)
    if "Database," not in status_content and "Database" not in status_content:
        status_content = status_content.replace("import { Activity, Server, Database as DBIcon, BrainCircuit, HardDrive, Cpu, Network, Clock, ShieldCheck, Globe } from \"lucide-react\"", "import { Activity, Server, Database as DBIcon, BrainCircuit, HardDrive, Cpu, Network, Clock, ShieldCheck, Globe, Database } from \"lucide-react\"")
        status_content = status_content.replace("import { Activity, Server, BrainCircuit, HardDrive, Cpu, Network, Clock, ShieldCheck, Globe } from \"lucide-react\"", "import { Activity, Server, BrainCircuit, HardDrive, Cpu, Network, Clock, ShieldCheck, Globe, Database } from \"lucide-react\"")

    with open("frontend/app/system-status/page.tsx", "w") as f:
        f.write(status_content)
