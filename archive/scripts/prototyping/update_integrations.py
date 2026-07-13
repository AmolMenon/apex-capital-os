import os

def insert_import(content, import_statement):
    if import_statement in content:
        return content
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if line.startswith('import ') and 'lucide-react' not in line:
            lines.insert(i, import_statement)
            return '\n'.join(lines)
    # If no imports found, put at top
    lines.insert(1, import_statement)
    return '\n'.join(lines)

def append_to_top_of_div(content, target_class, insertion):
    if insertion in content:
        return content
    # Find the first matching div and insert right after
    idx = content.find(target_class)
    if idx == -1:
        return content
    
    end_of_div = content.find('>', idx) + 1
    return content[:end_of_div] + '\n' + insertion + content[end_of_div:]

# 1. Update Deal Room
path = 'frontend/app/deals/[id]/deal-room/page.tsx'
if os.path.exists(path):
    with open(path, 'r') as f:
        content = f.read()
    content = insert_import(content, 'import { OperationsPanel } from "@/components/OperationsPanel";')
    content = append_to_top_of_div(content, 'className="space-y-6"', '      <OperationsPanel entityType="deal" entityId={deal.id.toString()} />')
    with open(path, 'w') as f:
        f.write(content)

# 2. Update Data Room
path = 'frontend/app/deals/[id]/data-room/page.tsx'
if os.path.exists(path):
    with open(path, 'r') as f:
        content = f.read()
    content = insert_import(content, 'import { OperationsPanel } from "@/components/OperationsPanel";')
    content = append_to_top_of_div(content, 'className="p-8 max-w-7xl mx-auto space-y-8"', '      <OperationsPanel entityType="deal" entityId={resolvedParams.id} />')
    with open(path, 'w') as f:
        f.write(content)

# 3. Update War Room
path = 'frontend/app/deals/[id]/war-room/page.tsx'
if os.path.exists(path):
    with open(path, 'r') as f:
        content = f.read()
    content = insert_import(content, 'import { OperationsPanel } from "@/components/OperationsPanel";')
    content = append_to_top_of_div(content, 'className="p-6 space-y-6"', '      <OperationsPanel entityType="deal" entityId={resolvedParams.id} />')
    with open(path, 'w') as f:
        f.write(content)

# 4. Update Portfolio HQ
path = 'frontend/app/portfolio/page.tsx'
if os.path.exists(path):
    with open(path, 'r') as f:
        content = f.read()
    content = insert_import(content, 'import { OperationsPanel } from "@/components/OperationsPanel";')
    content = append_to_top_of_div(content, 'className="p-8 space-y-6"', '      <OperationsPanel entityType="fund" entityId="apex_fund" />')
    with open(path, 'w') as f:
        f.write(content)

# 5. Update GP Cockpit (Fund OS)
path = 'frontend/app/fund-os/page.tsx'
if os.path.exists(path):
    with open(path, 'r') as f:
        content = f.read()
    content = insert_import(content, 'import { OperationsPanel } from "@/components/OperationsPanel";')
    content = append_to_top_of_div(content, 'className="p-8 space-y-6"', '      <OperationsPanel entityType="fund" entityId="apex_fund" />')
    with open(path, 'w') as f:
        f.write(content)

print("Integrations updated.")
