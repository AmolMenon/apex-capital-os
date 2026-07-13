with open("frontend/app/deals/[id]/data-room/page.tsx", "r") as f:
    content = f.read()

import_statement = 'import EvidenceGraph from "@/components/data-room/EvidenceGraph"\n'
if "EvidenceGraph" not in content:
    content = content.replace('import { Upload, FileText, AlertTriangle, CheckCircle, BrainCircuit, Play, Loader2, ArrowRight } from "lucide-react"', 'import { Upload, FileText, AlertTriangle, CheckCircle, BrainCircuit, Play, Loader2, ArrowRight } from "lucide-react"\n' + import_statement)

    injection = """
      <div className="mt-8">
        <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center">
          <BrainCircuit className="w-6 h-6 mr-2 text-emerald-600" />
          Evidence Provenance Graph
        </h3>
        <Card className="bg-neutral-50/50 dark:bg-neutral-900/50">
          <EvidenceGraph dealId={id} />
        </Card>
      </div>
"""
    content = content.replace('</div>\n    </div>\n  );\n}', '</div>\n' + injection + '    </div>\n  );\n}')

    with open("frontend/app/deals/[id]/data-room/page.tsx", "w") as f:
        f.write(content)
