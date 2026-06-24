with open("backend/agentic_workflow_engine/agent_orchestrator.py", "r") as f:
    content = f.read()

import re

# Fix AgenticResearchReport creation
replacement = """
        # Finalize Report
        final_report = AgenticResearchReport(
            public_benchmark_conclusion=state.memo_output.get("recommendation", "Unknown"),
            ic_readiness_status=state.ic_readiness_output.get("ic_readiness_status", "Unknown"),
            private_diligence_required=state.diligence_gaps.get("critical_missing_metrics", []),
            fund_fit_summary=state.fund_fit_output.get("fit_summary", "Unknown"),
            recommended_next_step=state.ic_readiness_output.get("next_steps", ["Unknown"])[0] if state.ic_readiness_output.get("next_steps") else "Unknown",
            key_findings=[]
        )
"""

content = re.sub(r'        # Finalize Report\n        final_report = AgenticResearchReport\(.*?\)', replacement, content, flags=re.DOTALL)

with open("backend/agentic_workflow_engine/agent_orchestrator.py", "w") as f:
    f.write(content)
