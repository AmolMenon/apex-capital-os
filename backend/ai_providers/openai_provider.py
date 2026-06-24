import os
import logging
from typing import Dict, Any, Optional
from .base import BaseAIProvider

logger = logging.getLogger(__name__)

class OpenAIProvider(BaseAIProvider):
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self._is_available = bool(self.api_key)
        self.client = None
        
        if self._is_available:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.api_key)
            except ImportError:
                logger.error("openai SDK not installed. OpenAI Provider unavailable.")
                self._is_available = False
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI client: {e}")
                self._is_available = False

    @property
    def provider_name(self) -> str:
        return "openai"

    def is_available(self) -> bool:
        return self._is_available

    def generate_structured_output(self, task_type: str, prompt: str, schema_name: str) -> Optional[Dict[str, Any]]:
        if not self.is_available():
            logger.warning("OpenAI Provider called but not available (missing key or SDK).")
            return None
            
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are an expert VC analyst. Output only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=int(os.getenv("MAX_LLM_TOKENS", "3000"))
            )
            
            text_output = response.choices[0].message.content
            from .json_parser import safe_parse_json
            parsed = safe_parse_json(text_output)
            if not parsed:
                 logger.error(f"OpenAI failed to return valid JSON for {task_type}.")
            return parsed
            
        except Exception as e:
            logger.error(f"OpenAI API error during {task_type}: {e}")
            return None
