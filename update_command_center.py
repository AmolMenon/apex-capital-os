import os

path = 'frontend/app/command-center/page.tsx'
if os.path.exists(path):
    with open(path, 'r') as f:
        content = f.read()

    # ensure imports
    if 'OperationsPanel' not in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('import ') and 'lucide-react' not in line:
                lines.insert(i, 'import { OperationsPanel } from "@/components/OperationsPanel";')
                content = '\n'.join(lines)
                break
    
    insertion = """
      <div className="mt-8">
        <OperationsPanel entityType="fund" entityId="apex_fund" />
      </div>
"""
    if "OperationsPanel" not in content.split("mt-8")[0] and "OperationsPanel" in content:
        # We imported it but haven't inserted the component
        idx = content.find('</div>\n    </div>\n  )')
        if idx != -1:
            content = content[:idx] + insertion + content[idx:]
            with open(path, 'w') as f:
                f.write(content)
            print("Command Center updated.")
