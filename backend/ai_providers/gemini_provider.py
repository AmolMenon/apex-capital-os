import os
import logging
from typing import Dict, Any, Optional
from .base import BaseAIProvider

logger = logging.getLogger(__name__)

class GeminiProvider(BaseAIProvider):
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")
        self._is_available = bool(self.api_key)
        
        if self._is_available:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                # GenerationConfig to encourage JSON output
                self.model = genai.GenerativeModel(
                    self.model_name,
                    generation_config={"response_mime_type": "application/json"}
                )
            except ImportError:
                logger.error("google-generativeai SDK not installed. Gemini Provider unavailable.")
                self._is_available = False
            except Exception as e:
                logger.error(f"Failed to initialize Gemini model: {e}")
                self._is_available = False

    @property
    def provider_name(self) -> str:
        return "gemini"

    def is_available(self) -> bool:
        return self._is_available

    def generate_structured_output(self, task_type: str, prompt: str, schema_name: str) -> Optional[Dict[str, Any]]:
        if not self.is_available():
            logger.warning("Gemini Provider called but not available (missing key or SDK).")
            return None
            
        try:
            # We assume safe_parse_json is called by the caller or we can do it here,
            # but since Gemini has response_mime_type="application/json", it should return raw JSON text.
            response = self.model.generate_content(prompt)
            text_output = response.text
            
            from .json_parser import safe_parse_json
            parsed = safe_parse_json(text_output)
            if not parsed:
                logger.error(f"Gemini failed to return valid JSON for {task_type}. Raw text: {text_output[:100]}...")
            return parsed
            
        except Exception as e:
            logger.error(f"Gemini API error during {task_type}: {e}")
            return None
