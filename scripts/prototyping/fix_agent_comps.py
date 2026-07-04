with open("frontend/components/agent-workflow/AgentComponents.tsx", "r") as f:
    content = f.read()

import re

# Close the div
content = content.replace(
    '        </div>\n      </CardContent>\n    </Card>\n  )\n}\n\nexport function AgentTraceTimeline',
    '        </div>\n      </CardContent>\n    </Card>\n    </div>\n  )\n}\n\nexport function AgentTraceTimeline'
)

with open("frontend/components/agent-workflow/AgentComponents.tsx", "w") as f:
    f.write(content)
