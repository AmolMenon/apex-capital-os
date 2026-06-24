with open("frontend/app/deal/[id]/layout.tsx", "r") as f:
    content = f.read()

import re

# Add Web Research to the tabs array
new_tab = '{ name: "Web Research", path: "web-research", icon: Globe },'

if "web-research" not in content:
    content = content.replace('import { Briefcase, Search, Presentation, Activity, FileText, CheckSquare, Loader2, MessageSquare } from "lucide-react"', 
                              'import { Briefcase, Search, Presentation, Activity, FileText, CheckSquare, Loader2, MessageSquare, Globe } from "lucide-react"')
    
    # Insert before Research tab or somewhere logical
    content = content.replace('{ name: "Research", path: "research", icon: Search },',
                              '{ name: "Research", path: "research", icon: Search },\n    ' + new_tab)

with open("frontend/app/deal/[id]/layout.tsx", "w") as f:
    f.write(content)
