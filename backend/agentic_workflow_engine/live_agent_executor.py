import json
import logging
from typing import Dict, Any
from datetime import datetime

from ai_providers.router import router as ai_router
from agentic_workflow_engine.agent_output_validator import validator as agent_validator
from agentic_workflow_engine.agent_prompt_templates import get_agent_prompt

logger = logging.getLogger(__name__)

class LiveAgentExecutor:
    def execute_agent(
        self,
        agent_name: str,
        task_type: str,
        state_json: str,
        sources: str,
        fallback_output: dict,
        deal_id: str,
        run_id: str
    ) -> Dict[str, Any]:
        
        start_time = datetime.utcnow()
        
        # 1. Generate Prompt
        prompt = get_agent_prompt(agent_name, state_json, sources)
        
        # 2. Call AI Provider Router
        try:
            raw_response = ai_router.execute_task(task_type, prompt)
            
            # The router returns {"data": raw_output, "metadata": {...}}
            if not raw_response or "data" not in raw_response:
                raise ValueError("Empty or invalid response from AI Provider Router")
            
            raw_data = raw_response["data"]
            provider_meta = raw_response.get("metadata", {})
            
        except Exception as e:
            logger.error(f"AI Provider Router failed for {agent_name}: {e}")
            return self._build_fallback(agent_name, fallback_output, f"Router Error: {e}", start_time)

        # 3. Parse and Validate
        is_valid, parsed_json, error_reason = agent_validator.parse_and_validate(agent_name, raw_data)
        
        if not is_valid:
            logger.warning(f"Agent {agent_name} output validation failed: {error_reason}. Falling back.")
            return self._build_fallback(agent_name, fallback_output, error_reason, start_time)

        
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


    def _build_fallback(self, agent_name: str, fallback_output: dict, reason: str, start_time: datetime) -> Dict[str, Any]:
        latency_ms = int((datetime.utcnow() - start_time).total_seconds() * 1000)
        
        # fallback_output usually has a structure like {"output": {...}} based on MOCK_WORKFLOW_FIXTURES
        # so we extract the nested output if it exists
        output_data = fallback_output.get("output", fallback_output)
        
        return {
            "status": "Completed_with_Fallback",
            "output": output_data,
            "provider_metadata": {
                "provider_used": "mock",
                "model_used": "mock",
                "task_type": "fallback",
                "mode": "mock",
                "fallback_used": True
            },
            "fallback_used": True,
            "fallback_reason": reason,
            "latency_ms": latency_ms,
            "error_message": reason
        }

live_agent_executor = LiveAgentExecutor()
