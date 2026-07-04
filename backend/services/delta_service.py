import re
from typing import Dict, Any

class DeltaService:
    @staticmethod
    def normalize_text(text: str) -> str:
        """Removes punctuation, extra spaces, and lowercases for basic semantic matching."""
        if not text: return ""
        text = str(text).lower()
        text = re.sub(r'[^\w\s]', '', text)
        return re.sub(r'\s+', ' ', text).strip()

    @staticmethod
    def is_semantic_equivalent(a: str, b: str) -> bool:
        """Returns True if normalized versions of a and b match exactly."""
        return DeltaService.normalize_text(a) == DeltaService.normalize_text(b)

    @staticmethod
    def list_difference(list_a, list_b) -> list:
        """Returns items in list_a that are not semantically equivalent to anything in list_b."""
        if not list_a: return []
        if isinstance(list_a, str): list_a = [list_a]
        if isinstance(list_b, str): list_b = [list_b]
        if not list_b: return list(list_a)
        diff = []
        for a in list_a:
            if not any(DeltaService.is_semantic_equivalent(a, b) for b in list_b):
                diff.append(a)
        return diff

    @staticmethod
    def classify_delta(r1_perspective: Dict[str, Any], r2_challenge_response: Dict[str, Any]) -> str:
        """
        Calculates the classification of the deliberation delta between R1 and R2 outputs.
        """
        # If the challenge response is incoherent or missing
        if not r2_challenge_response or not isinstance(r2_challenge_response, dict):
            return "QUALITY_DEGRADATION"

        # Check for quality degradation: dropping material elements or adding unsupported assertions
        # (For this MVP, if confidence drops to 0 or it lacks required fields without justification)
        if "revised_position" not in r2_challenge_response:
            return "QUALITY_DEGRADATION"

        # Structural changes
        # Normally we'd track claim_ids/assumption_ids changes in R2 if the prompt returned them.
        # But R2 challenge_response currently returns:
        # ["identified_disagreement", "challenge_to_unsupported_claims", "revised_position", 
        #  "confidence_before", "confidence_after", "evidence_required_to_resolve", "key_risks" (if added), "conditions_that_would_change_position" (if added)]
        
        new_risks = DeltaService.list_difference(
            r2_challenge_response.get("key_risks", []),
            r1_perspective.get("key_risks", [])
        )
        
        new_missing_info = DeltaService.list_difference(
            r2_challenge_response.get("evidence_required_to_resolve", []),
            r1_perspective.get("missing_information", [])
            # Also checking single string evidence_required_to_resolve vs list
        )
        
        if isinstance(r2_challenge_response.get("evidence_required_to_resolve"), str):
            req = r2_challenge_response.get("evidence_required_to_resolve")
            if req and not any(DeltaService.is_semantic_equivalent(req, m) for m in r1_perspective.get("missing_information", [])):
                new_missing_info.append(req)
                
        new_conditions = DeltaService.list_difference(
            r2_challenge_response.get("conditions_that_would_change_position", []),
            r1_perspective.get("conditions_that_would_change_position", [])
        )
        
        # Check position change
        position_changed = False
        r1_pos = r1_perspective.get("position", "")
        r2_pos = r2_challenge_response.get("revised_position", "")
        if r1_pos and r2_pos and not DeltaService.is_semantic_equivalent(r1_pos, r2_pos):
            position_changed = True
            
        # Is there any substantive change?
        has_substantive = bool(new_risks) or bool(new_missing_info) or bool(new_conditions) or position_changed
        
        # In this implementation, if identified_disagreement or challenge_to_unsupported_claims are substantial:
        challenge_unsupported = r2_challenge_response.get("challenge_to_unsupported_claims", "")
        if challenge_unsupported and len(challenge_unsupported.split()) > 5:
            # simple heuristic: if they explicitly challenged something with substance
            has_substantive = True
            
        if has_substantive:
            return "SUBSTANTIVE_VALUE_ADDED"
            
        # Confidence change?
        conf_before = r1_perspective.get("confidence", 0)
        # R2 has confidence_before and confidence_after. 
        # We check if confidence_after is different from conf_before.
        conf_after = r2_challenge_response.get("confidence_after", conf_before)
        if conf_after != conf_before:
            return "CONFIDENCE_ONLY_CHANGE"
            
        return "NO_MEANINGFUL_CHANGE"
