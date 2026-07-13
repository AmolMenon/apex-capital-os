with open("frontend/app/deal/[id]/layout.tsx", "r") as f:
    content = f.read()

import re

if "{ name: 'Agent Workflow', href: `/deal/${params.id}/agent-workflow` }," not in content:
    content = content.replace(
        "{ name: 'Web Research', href: `/deal/${params.id}/web-research` },",
        "{ name: 'Web Research', href: `/deal/${params.id}/web-research` },\n    { name: 'Agent Workflow', href: `/deal/${params.id}/agent-workflow` },"
    )
    with open("frontend/app/deal/[id]/layout.tsx", "w") as f:
        f.write(content)
