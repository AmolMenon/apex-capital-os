import os
import logging
from typing import Dict, Any, Optional
from .base import BaseAIProvider

logger = logging.getLogger(__name__)

class ClaudeProvider(BaseAIProvider):
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        self.model_name = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-latest")
        self._is_available = bool(self.api_key)
        self.client = None
        
        if self._is_available:
            try:
                from anthropic import Anthropic
                self.client = Anthropic(api_key=self.api_key)
            except ImportError:
                logger.error("anthropic SDK not installed. Claude Provider unavailable.")
                self._is_available = False
            except Exception as e:
                logger.error(f"Failed to initialize Anthropic client: {e}")
                self._is_available = False

    @property
    def provider_name(self) -> str:
        return "claude"

    def is_available(self) -> bool:
        return self._is_available

    def generate_structured_output(self, task_type: str, prompt: str, schema_name: str) -> Optional[Dict[str, Any]]:
        if not self.is_available():
            logger.warning("Claude Provider called but not available (missing key or SDK).")
            return None
            
        try:
            # Claude 3.5 Sonnet is very good at following formatting instructions
            # but we explicitly remind it to output ONLY JSON
            system_prompt = "You are an expert VC analyst. Output ONLY valid JSON, with no markdown formatting around it, and no conversational text before or after."
            
            response = self.client.messages.create(
                model=self.model_name,
                max_tokens=int(os.getenv("MAX_LLM_TOKENS", "3000")),
                temperature=0.2,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            text_output = response.content[0].text
            from .json_parser import safe_parse_json
            parsed = safe_parse_json(text_output)
            if not parsed:
                 logger.error(f"Claude failed to return valid JSON for {task_type}.")
            return parsed
            
        except Exception as e:
            logger.error(f"Anthropic API error during {task_type}: {e}")
            return None
