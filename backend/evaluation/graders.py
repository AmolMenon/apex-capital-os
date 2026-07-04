import json
from typing import List, Dict, Any
from services.llm_provider import LLMProvider
from core.config import settings

class SemanticGrader:
    """
    Grades extraction and reasoning outputs against golden datasets.
    Provides deterministic scoring where possible, and delegates to a decoupled LLM-as-a-Judge for semantic scoring.
    """
    
    @staticmethod
    def evaluate_with_llm(system_prompt: str, user_prompt: str, schema: dict) -> Dict[str, Any]:
        """
        Uses the dedicated grading LLM model to evaluate semantic metrics.
        """
        # In a real environment, LLMProvider would read settings.APEX_GRADER_MODEL
        result, _ = LLMProvider.generate_structured(system_prompt, user_prompt, schema, model_name=settings.APEX_GRADER_MODEL)
        return result

    @staticmethod
    def grade_semantic_dimensions(expected_risks: List[str], expected_reasoning: List[str], agent_perspectives: List[Dict[str, Any]], synthesis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Uses an LLM Judge to evaluate Reasoning Coverage, Risk Materiality, Agent Diversity, Disagreement Quality, and Recommendation Coherence.
        """
        system_prompt = """
        You are an expert AI evaluator. You are grading the output of a multi-agent decision system against a Golden Benchmark.
        You must evaluate:
        1. Reasoning Coverage (0-1.0): How much of the expected reasoning was captured?
        2. Risk Recall (0-1.0): How many of the expected risks were identified and material?
        3. Agent Diversity (0-1.0): Did agents genuinely disagree and focus on different evidence/risks? (If they just used different words to agree, score 0).
        4. Disagreement Quality (0-1.0): Were disagreements substantial and logical?
        5. Recommendation Coherence (0-1.0): Is the final synthesis logically coherent?
        """
        
        user_prompt = f"""
        Golden Expected Risks: {json.dumps(expected_risks)}
        Golden Expected Reasoning: {json.dumps(expected_reasoning)}
        
        Actual Agent Perspectives: {json.dumps(agent_perspectives)}
        Actual Synthesis: {json.dumps(synthesis)}
        """
        
        schema = {
            "type": "object",
            "properties": {
                "reasoning_coverage": {"type": "number"},
                "risk_recall": {"type": "number"},
                "agent_diversity": {"type": "number"},
                "disagreement_quality": {"type": "number"},
                "recommendation_coherence": {"type": "number"},
                "grader_rationale": {"type": "string"},
                "expected_elements_found": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "expected_elements_missed": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "unsupported_elements_identified": {
                    "type": "array",
                    "items": {"type": "string"}
                }
            },
            "required": ["reasoning_coverage", "risk_recall", "agent_diversity", "disagreement_quality", "recommendation_coherence", "grader_rationale", "expected_elements_found", "expected_elements_missed", "unsupported_elements_identified"]
        }
        
        # Test mode fallback
        if settings.APEX_LLM_MODE == "test":
            return {
                "reasoning_coverage": 0.2,
                "risk_recall": 0.1,
                "agent_diversity": 0.0, # Test mode returns static schemas, no diversity
                "disagreement_quality": 0.0,
                "recommendation_coherence": 1.0,
                "grader_rationale": "TEST STUB OUTPUT",
                "expected_elements_found": ["TEST STUB OUTPUT"],
                "expected_elements_missed": ["TEST STUB OUTPUT"],
                "unsupported_elements_identified": ["TEST STUB OUTPUT"]
            }
            
        return SemanticGrader.evaluate_with_llm(system_prompt, user_prompt, schema)
