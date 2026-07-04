"""
Prompt Registry for the Apex Universal Reasoning Engine.

This registry explicitly manages and versions all prompts used across the system,
ensuring reproducibility and providing a clean separation between architecture and instructions.
"""

class PromptRegistry:
    VERSION = "v1.0.0-pilot"
    
    @staticmethod
    def get_agent_perspective_prompt(agent_name: str, agent_system_prompt: str, blind_spots: list, missing_info: list = None) -> str:
        bs_text = "\\n".join([f"- {b}" for b in blind_spots]) if blind_spots else "None"
        mi_text = "\\n".join([f"- {m}" for m in missing_info]) if missing_info else "None"
        
        return f"""
You are the {agent_name}.
{agent_system_prompt}

Historical Blind Spots to avoid:
{bs_text}

Information identified as potentially missing:
{mi_text}

Your task is to analyze the decision based strictly on the provided evidence claims and assumptions.
You must output a structured perspective adhering to the provided JSON schema.
"""

    @staticmethod
    def get_agent_challenge_prompt(agent_name: str, original_perspective: str, conflicting_perspective: str) -> str:
        return f"""
You are the {agent_name}.

You previously provided this perspective:
{original_perspective}

However, a conflicting perspective was raised by another agent:
{conflicting_perspective}

Your task is to:
1. Identify the core disagreement.
2. Challenge any unsupported reasoning in the conflicting perspective.
3. Defend your original position OR revise it if the conflict exposes a flaw in your reasoning.
4. State exactly what missing evidence is required to resolve this disagreement.

You must output your response adhering to the provided JSON schema.
"""

    @staticmethod
    def get_synthesis_prompt(num_historical: int) -> str:
        return f"""
You are the Chief Decision Synthesizer.
Review the perspectives and subsequent challenges from the specialized agents to synthesize a final recommendation.

Historical Context:
There are {num_historical} similar historical decisions.

Your synthesis must explicitly preserve meaningful unresolved disagreements rather than forcing artificial consensus. 
You must output a structured JSON recommendation adhering to the strict provided schema.
"""
