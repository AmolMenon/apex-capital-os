import json
from db.models import ChallengeTask
from services.llm_provider import LLMProvider, BaseLLMProvider
from reasoning_engine.prompts import PromptRegistry

class TargetedChallengeEngine:
    @staticmethod
    def execute_challenge(db, challenge_task: ChallengeTask, original_perspective: dict, relevant_context: dict, llm_provider: BaseLLMProvider = None) -> dict:
        """
        Executes a targeted challenge based on the task type without invoking a full agent persona debate.
        """
        system_prompt = f"You are a specialized AI designed to execute a targeted {challenge_task.challenge_mode} challenge on a specific element of a decision."
        
        user_prompt = f"""
        TARGET TYPE: {challenge_task.target_type}
        TARGET ID: {challenge_task.target_id}
        WHY IT IS MATERIAL: {challenge_task.why_material}
        
        CHALLENGE QUESTION:
        {challenge_task.challenge_question}
        
        ORIGINAL PERSPECTIVE CONTEXT:
        {json.dumps(original_perspective, indent=2)}
        
        RELEVANT CONTEXT (EVIDENCE/ASSUMPTIONS):
        {json.dumps(relevant_context, indent=2)}
        
        Execute the challenge and respond according to the schema.
        """
        
        schema = {
            "type": "object",
            "properties": {
                "target_id": {"type": "string"},
                "original_position": {"type": "string"},
                "challenge_findings": {"type": "string"},
                "new_evidence_relationships": {"type": "array", "items": {"type": "string"}},
                "resolution_effect": {
                    "type": "string",
                    "enum": ["SUPPORTS_CLAIM_A", "SUPPORTS_CLAIM_B", "RECONCILES_BOTH", "INSUFFICIENT_EVIDENCE", "CONFLICT_REMAINS"]
                },
                "assumption_effect": {
                    "type": "string",
                    "enum": ["SUPPORTS", "WEAKENS", "INVALIDATES", "NO_CHANGE"]
                },
                "strength": {
                    "type": "string",
                    "enum": ["LIMITED", "MATERIAL", "DECISION_CRITICAL"]
                },
                "position_before": {"type": "string"},
                "position_after": {"type": "string"},
                "confidence_before": {"type": "integer"},
                "confidence_after": {"type": "integer"},
                "conditions_for_reversal": {"type": "array", "items": {"type": "string"}},
                "unresolved_questions": {"type": "array", "items": {"type": "string"}},
                "recommended_action": {"type": "string"},
                "supporting_claim_ids": {"type": "array", "items": {"type": "integer"}},
                "contradicting_claim_ids": {"type": "array", "items": {"type": "integer"}}
            },
            "required": ["target_id", "challenge_findings", "position_after", "confidence_after"]
        }
        
        provider = llm_provider or LLMProvider()
        response, tokens = provider.generate_structured(system_prompt, user_prompt, schema)
        
        from db.models import ChallengeFinding
        from services.orchestrator_service import InvestmentCaseOrchestrator
        
        # Save to task
        challenge_task.challenge_findings_json = json.dumps(response)
        challenge_task.status = "COMPLETED"
        
        finding = ChallengeFinding(
            decision_id=challenge_task.decision_id,
            challenge_task_id=challenge_task.id,
            position_before=response.get("position_before"),
            position_after=response.get("position_after"),
            resolution_effect=response.get("resolution_effect"),
            assumption_effect=response.get("assumption_effect"),
            strength=response.get("strength"),
            recommendation_impact=response.get("recommended_action")
        )
        from sqlalchemy.exc import IntegrityError
        
        try:
            with db.begin_nested():
                db.add(finding)
                db.flush()
        except IntegrityError:
            db.rollback()
            # The finding already exists, fetch it
            finding = db.query(ChallengeFinding).filter_by(challenge_task_id=challenge_task.id).first()

        db.commit()
        db.refresh(finding)
        
        InvestmentCaseOrchestrator.apply_finding(db, finding.id)
        
        return response, tokens
