with open("backend/agentic_workflow_engine/agent_orchestrator.py", "r") as f:
    content = f.read()

import re

# Fix metadata creation
replacement = """
            "metadata": {
                "provider_used": "Mixed",
                "fallback_used": has_fallback,
                "sources_reviewed": len(state.source_registry),
                "claims_verified": len(state.verified_facts),
                "assumptions_created": len(state.assumptions),
                "unknown_metrics": len(state.unknown_metrics),
                "created_at": datetime.utcnow().isoformat(),
                "completed_at": datetime.utcnow().isoformat()
            }
"""

content = re.sub(r'            "metadata": \{\n                "started_at": datetime\.utcnow\(\)\.isoformat\(\),\n                "completed_at": datetime\.utcnow\(\)\.isoformat\(\),\n                "fallback_used": has_fallback,\n                "sources_reviewed": len\(state\.source_registry\)\n            \}', replacement, content, flags=re.DOTALL)

with open("backend/agentic_workflow_engine/agent_orchestrator.py", "w") as f:
    f.write(content)
