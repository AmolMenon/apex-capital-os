with open("backend/agentic_workflow_engine/live_agent_executor.py", "r") as f:
    content = f.read()

import re

# Update LiveAgentExecutor success return to wrap parsed_json in an AgentOutput structure
replacement = """
        # 4. Success - Attach metadata
        latency_ms = int((datetime.utcnow() - start_time).total_seconds() * 1000)
        
        agent_output = {
            "agent_name": agent_name,
            "task": task_type,
            "input_summary": "Processed via Live LLM",
            "output": parsed_json,
            "confidence": "High",
            "sources_used": [],
            "assumptions": parsed_json.get("assumptions", []),
            "unknowns": parsed_json.get("expected_missing_private_metrics", []) + parsed_json.get("unknown_metrics", []),
            "next_actions": [],
            "metadata": provider_meta
        }
        
        return {
            "status": "Completed",
            "output": agent_output,
            "provider_metadata": provider_meta,
            "fallback_used": provider_meta.get("fallback_used", False) or provider_meta.get("mode") == "mock",
            "fallback_reason": "Router fell back to mock" if provider_meta.get("mode") == "mock" else None,
            "latency_ms": latency_ms,
            "error_message": None
        }
"""

content = re.sub(r'# 4\. Success - Attach metadata.*?return \{.*?"error_message": None\n        \}', replacement, content, flags=re.DOTALL)

with open("backend/agentic_workflow_engine/live_agent_executor.py", "w") as f:
    f.write(content)
