with open("backend/ai_providers/router.py", "r") as f:
    content = f.read()

# Add task routing
new_routing = """
    "research_planner_agent": "gemini",
    "search_agent": "gemini",
    "source_quality_agent": "gemini",
    "claim_extraction_agent": "gemini",
    "evidence_verification_agent": "gemini",
    "market_mapping_agent": "gemini",
    "competitor_analysis_agent": "gemini",
    "diligence_gap_agent": "gemini",
    "fund_fit_agent": "gemini",
    "red_team_agent": "claude",
    "memo_writer_agent": "gemini",
    "ic_readiness_agent": "gemini",
"""
content = content.replace('"missing_info_detection": "gemini",', '"missing_info_detection": "gemini",\n' + new_routing)

# Ensure prompt pass-through for unknown tasks so the orchestrated agent prompt passes directly
# Right now it does: f"Perform the following task: {task_type}. Context: {context}. Output valid JSON."
# We need to change `execute_task(self, task_type: str, context: str) -> Dict[str, Any]:`
# actually we can just rely on the `context` parameter from LiveAgentExecutor passing the prompt as context, 
# or change execute_task signature? Wait, `ai_router.execute_task(task_type, prompt)` is what I used in `live_agent_executor.py`.
# Wait, `execute_task(task_type, context)` means `prompt` is passed into `context`.
# The fallback in router.py is: `else: prompt = f"Perform the following task: {task_type}. Context: {context}. Output valid JSON."`
# I should update `router.py` to use the passed prompt directly if the task is an agent task.

replacement_logic = """
        elif task_type in [
            "research_planner_agent", "search_agent", "source_quality_agent", 
            "claim_extraction_agent", "evidence_verification_agent", "market_mapping_agent", 
            "competitor_analysis_agent", "diligence_gap_agent", "fund_fit_agent", 
            "red_team_agent", "memo_writer_agent", "ic_readiness_agent"
        ]:
            prompt = context
"""

content = content.replace(
    '        elif task_type == "missing_info_detection": prompt = f"{COMMON_INSTRUCTIONS}\\nIdentify missing information from: {context}"',
    '        elif task_type == "missing_info_detection": prompt = f"{COMMON_INSTRUCTIONS}\\nIdentify missing information from: {context}"' + replacement_logic
)

with open("backend/ai_providers/router.py", "w") as f:
    f.write(content)
