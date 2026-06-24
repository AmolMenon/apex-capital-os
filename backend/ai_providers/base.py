from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from .json_parser import safe_parse_json, validate_or_fallback

class BaseAIProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Returns True if the provider is configured and available."""
        pass

    @abstractmethod
    def generate_structured_output(self, task_type: str, prompt: str, schema_name: str) -> Optional[Dict[str, Any]]:
        """Core method to generate text from the LLM and return it as a structured dictionary. 
           Should handle timeouts and API errors safely returning None on failure.
        """
        pass

    def _safe_generate(self, task_type: str, prompt: str, schema_name: str, fallback_data: Any) -> Any:
        try:
            result = self.generate_structured_output(task_type, prompt, schema_name)
            if result is None:
                return {"data": fallback_data}
            # We assume generate_structured_output returns the parsed dict.
            return {"data": result}
        except Exception as e:
            return {"data": fallback_data}

    # Helper methods for standard tasks
    def generate_memo(self, prompt: str) -> Dict[str, Any]:
        return self._safe_generate("investment_memo", prompt, "memo", {})
        
    def generate_market_analysis(self, prompt: str) -> Dict[str, Any]:
        return self._safe_generate("market_research", prompt, "market", {})
        
    def generate_competitor_analysis(self, prompt: str) -> Dict[str, Any]:
        return self._safe_generate("competitor_research", prompt, "competitor", {})
        
    def generate_partner_pushback(self, prompt: str) -> Dict[str, Any]:
        return self._safe_generate("partner_pushback", prompt, "pushback", {})
        
    def generate_diligence_questions(self, prompt: str) -> Dict[str, Any]:
        return self._safe_generate("diligence_plan", prompt, "diligence", {})
        
    def generate_deck_claim_analysis(self, prompt: str) -> Dict[str, Any]:
        return self._safe_generate("deck_claim_extraction", prompt, "deck", {})
        
    def generate_ic_recommendation(self, prompt: str) -> Dict[str, Any]:
        return self._safe_generate("ic_recommendation", prompt, "ic", {})
