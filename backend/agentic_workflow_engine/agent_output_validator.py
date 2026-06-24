import json
import logging
from typing import Dict, Any, Tuple

logger = logging.getLogger(__name__)

class AgentOutputValidator:
    def parse_and_validate(self, agent_name: str, raw_output: Any) -> Tuple[bool, Dict[str, Any], str]:
        """
        Parses LLM output into JSON and validates basic schema expectations based on the agent type.
        Returns: (is_valid, parsed_json, error_reason)
        """
        try:
            if isinstance(raw_output, dict):
                parsed = raw_output
            else:
                # Attempt to extract JSON from markdown if present
                text = str(raw_output).strip()
                if text.startswith("```json"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                parsed = json.loads(text.strip())
        except Exception as e:
            logger.error(f"Failed to parse JSON for {agent_name}: {e}")
            return False, {}, f"JSON Parsing Error: {e}"

        # Basic Validation
        if not isinstance(parsed, dict):
            return False, {}, "Parsed output is not a dictionary"

        # Schema enforcement per agent
        required_keys = []
        if agent_name == "Research Planner":
            required_keys = ["key_questions", "search_plan", "expected_missing_private_metrics"]
        elif agent_name == "Claim Extraction":
            required_keys = ["extracted_claims"]
        elif agent_name == "Red Team":
            required_keys = ["hype_risk", "objections"]
        elif agent_name == "IC Readiness":
            required_keys = ["ic_readiness_status", "blockers"]

        missing_keys = [k for k in required_keys if k not in parsed]
        if missing_keys:
            return False, parsed, f"Missing required keys: {', '.join(missing_keys)}"

        return True, parsed, ""

validator = AgentOutputValidator()
