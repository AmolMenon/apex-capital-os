import os
import logging
from datetime import datetime
from typing import Dict, Any, Tuple

from .base import BaseAIProvider
from .mock_provider import MockProvider
from .gemini_provider import GeminiProvider
from .openai_provider import OpenAIProvider
from .claude_provider import ClaudeProvider
from .prompt_templates import *
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

# Default provider routing
TASK_ROUTING = {
    "fast_summary": "gemini",
    "investment_memo": "gemini",
    "market_research": "gemini",
    "competitor_research": "gemini",
    "customer_personas": "gemini",
    "deck_claim_extraction": "gemini",
    "missing_info_detection": "gemini",

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

    "diligence_plan": "gemini",
    "partner_pushback": "claude",
    "ic_recommendation": "gemini",
    "demo_script_generation": "openai",

    "platform_reddit_research": "gemini",
    "platform_review_research": "gemini",
    "platform_social_research": "gemini",
    "platform_competitor_research": "gemini",
    "platform_pain_points": "gemini",
    "platform_reputation_risks": "gemini",
    "platform_sentiment_analysis": "gemini"
}

class AIProviderRouter:
    def __init__(self):
        self.enable_real_llm = os.getenv("ENABLE_REAL_LLM", "false").lower() == "true"
        self.default_provider = os.getenv("DEFAULT_AI_PROVIDER", "mock")
        
        # Initialize providers safely
        self.providers = {"mock": MockProvider()}
        
        if self.enable_real_llm:
            gemini = GeminiProvider()
            if gemini.is_available(): self.providers["gemini"] = gemini
            
            openai = OpenAIProvider()
            if openai.is_available(): self.providers["openai"] = openai
            
            claude = ClaudeProvider()
            if claude.is_available(): self.providers["claude"] = claude

    def get_provider_status(self) -> Dict[str, Any]:
        """Returns the current status of all providers for the Settings UI."""
        return {
            "app_mode": os.getenv("APP_MODE", "mock"),
            "real_llm_enabled": self.enable_real_llm,
            "providers": {
                "mock": {"available": True},
                "gemini": {
                    "available": "gemini" in self.providers, 
                    "reason": "Active" if "gemini" in self.providers else "Missing API key or SDK"
                },
                "openai": {
                    "available": "openai" in self.providers, 
                    "reason": "Active" if "openai" in self.providers else "Missing API key or SDK"
                },
                "claude": {
                    "available": "claude" in self.providers, 
                    "reason": "Active" if "claude" in self.providers else "Missing API key or SDK"
                }
            },
            "routing": TASK_ROUTING
        }

    def _get_provider_for_task(self, task_type: str) -> BaseAIProvider:
        """Determines which provider to use, falling back to mock if necessary."""
        if not self.enable_real_llm:
            return self.providers["mock"]
            
        preferred_name = TASK_ROUTING.get(task_type, self.default_provider)
        
        # If preferred is available, use it
        if preferred_name in self.providers:
            return self.providers[preferred_name]
            
        # Fallback to gemini if available
        if "gemini" in self.providers:
            return self.providers["gemini"]
            
        # Ultimate fallback
        return self.providers["mock"]

    def _attach_metadata(self, data: Dict[str, Any], provider_used: str, fallback_used: bool, task_type: str) -> Dict[str, Any]:
        """Injects metadata into the final JSON output for transparency."""
        # Check if it's already wrapped (in case of fallback chaining)
        raw_data = data.get("data", data) if isinstance(data, dict) else data
        
        return {
            "data": raw_data,
            "metadata": {
                "provider_used": provider_used,
                "model_used": "mock" if provider_used == "mock" else os.getenv(f"{provider_used.upper()}_MODEL", "unknown"),
                "task_type": task_type,
                "mode": "real" if self.enable_real_llm and provider_used != "mock" else "mock",
                "fallback_used": fallback_used,
                "generated_at": datetime.utcnow().isoformat()
            }
        }

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=False
    )
    def _attempt_execution(self, provider: BaseAIProvider, task_type: str, prompt: str) -> Dict[str, Any]:
        return provider._safe_generate(task_type, prompt, task_type, {})

    def execute_task(self, task_type: str, context: str) -> Dict[str, Any]:
        """Executes a specific VC task by mapping it to a prompt and routing it to the correct provider."""
        
        # 1. Map task to prompt
        prompt = ""
        if task_type == "investment_memo": prompt = INVESTMENT_MEMO_PROMPT.replace("{context}", context)
        elif task_type == "market_research": prompt = MARKET_RESEARCH_PROMPT.replace("{context}", context)
        elif task_type == "competitor_research": prompt = COMPETITOR_ANALYSIS_PROMPT.replace("{context}", context)
        elif task_type == "customer_personas": prompt = CUSTOMER_PERSONA_PROMPT.replace("{context}", context)
        elif task_type == "deck_claim_extraction": prompt = DECK_CLAIM_EXTRACTION_PROMPT.replace("{context}", context)
        elif task_type == "diligence_plan": prompt = DILIGENCE_PLAN_PROMPT.replace("{context}", context)
        elif task_type == "partner_pushback": prompt = PARTNER_PUSHBACK_PROMPT.replace("{context}", context)
        elif task_type == "ic_recommendation": prompt = IC_RECOMMENDATION_PROMPT.replace("{context}", context)
        elif task_type == "conversation_analysis": prompt = CONVERSATION_ANALYSIS_PROMPT.replace("{context}", context)
        elif task_type == "fund_fit": prompt = FUND_FIT_PROMPT.replace("{context}", context)
        elif task_type == "demo_script_generation": prompt = CUSTOMER_REFERENCE_SCRIPT_PROMPT.replace("{context}", context)
        elif task_type == "platform_reddit_research": prompt = PLATFORM_REDDIT_PROMPT.replace("{context}", context)
        elif task_type == "platform_review_research": prompt = PLATFORM_REVIEW_PROMPT.replace("{context}", context)
        elif task_type == "platform_social_research": prompt = PLATFORM_SOCIAL_PROMPT.replace("{context}", context)
        elif task_type == "platform_competitor_research": prompt = PLATFORM_COMPETITOR_PROMPT.replace("{context}", context)
        elif task_type == "platform_pain_points": 
            parts = context.split("|||")
            prompt = PLATFORM_PAIN_POINT_PROMPT.replace("{context}", parts[0]).replace("{signals}", parts[1] if len(parts) > 1 else "[]")
        elif task_type == "platform_reputation_risks": 
            parts = context.split("|||")
            prompt = PLATFORM_REPUTATION_RISK_PROMPT.replace("{context}", parts[0]).replace("{signals}", parts[1] if len(parts) > 1 else "[]")
        elif task_type == "platform_sentiment_analysis": 
            parts = context.split("|||")
            prompt = PLATFORM_SENTIMENT_PROMPT.replace("{context}", parts[0]).replace("{signals}", parts[1] if len(parts) > 1 else "[]")
        elif task_type == "fast_summary": prompt = f"{COMMON_INSTRUCTIONS}\nWrite a fast 2-sentence summary of: {context}"
        elif task_type == "missing_info_detection": prompt = f"{COMMON_INSTRUCTIONS}\nIdentify missing information from: {context}"
        elif task_type in [
            "research_planner_agent", "search_agent", "source_quality_agent", 
            "claim_extraction_agent", "evidence_verification_agent", "market_mapping_agent", 
            "competitor_analysis_agent", "diligence_gap_agent", "fund_fit_agent", 
            "red_team_agent", "memo_writer_agent", "ic_readiness_agent"
        ]:
            prompt = context

        else:
            prompt = f"Perform the following task: {task_type}. Context: {context}. Output valid JSON."

        # 2. Get preferred provider
        provider = self._get_provider_for_task(task_type)
        fallback_used = provider.provider_name == "mock" and self.enable_real_llm
        
        # 3. Execute
        logger.info(f"Executing {task_type} using {provider.provider_name} (Fallback: {fallback_used})")
        
        try:
            result = self._attempt_execution(provider, task_type, prompt)
        except Exception as e:
            logger.error(f"Provider {provider.provider_name} completely failed: {e}")
            result = {}
            
        # 4. If the real provider failed and returned an empty dict, force fallback to mock
        if self.enable_real_llm and provider.provider_name != "mock" and not result:
            logger.warning(f"Provider {provider.provider_name} failed for {task_type}. Falling back to mock.")
            fallback_provider = self.providers["mock"]
            result = self._attempt_execution(fallback_provider, task_type, prompt)
            provider = fallback_provider
            fallback_used = True

        # 5. Attach Metadata
        if not result:
            result = {}
        return self._attach_metadata(result, provider.provider_name, fallback_used, task_type)

# Singleton router instance
router = AIProviderRouter()
