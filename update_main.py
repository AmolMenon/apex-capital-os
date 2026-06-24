with open("backend/main.py", "r") as f:
    content = f.read()

import re

injection = """
        from backend.agentic_workflow_engine.agent_orchestrator import orchestrator
        agent_workflow = await orchestrator.get_latest_workflow(str(deal_id))
        if agent_workflow:
            deal_dict["agent_workflow"] = agent_workflow.dict()
"""

if "agent_workflow = await orchestrator.get_latest_workflow(" not in content:
    # Inject before decision generation
    content = content.replace(
        "decision = generate_decision_output(deal_dict)",
        injection + "\n        decision = generate_decision_output(deal_dict)"
    )
    with open("backend/main.py", "w") as f:
        f.write(content)
