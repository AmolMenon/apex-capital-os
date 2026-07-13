import re
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from db.models import Evidence, Claim, EvidenceConflict, DomainEvent

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
        conf_after = r2_challenge_response.get("confidence_after", conf_before)
        if conf_after != conf_before:
            return "CONFIDENCE_ONLY_CHANGE"
            
        return "NO_MEANINGFUL_CHANGE"

    @staticmethod
    def compare_evidence_versions(db: Session, decision_id: int, v1_deck_version: int, v2_deck_version: int) -> Dict[str, Any]:
        """
        Phase 5 Deck Evolution: Compares canonical evidence directly rather than comparing generated prose.
        Returns measurable progress tracking new, resolved, and remaining canonical objects.
        """
        # Fetch V1 Evidence/Claims
        v1_evidence = db.query(Evidence).filter(Evidence.decision_id == decision_id, Evidence.deck_version == v1_deck_version).all()
        v1_claims = db.query(Claim).filter(Claim.decision_id == decision_id).all() # Filtering claims by deck_version in real app
        
        # Fetch V2 Evidence/Claims
        v2_evidence = db.query(Evidence).filter(Evidence.decision_id == decision_id, Evidence.deck_version == v2_deck_version).all()
        
        v1_evidence_ids = {e.id for e in v1_evidence}
        v2_evidence_ids = {e.id for e in v2_evidence}
        
        new_evidence_ids = list(v2_evidence_ids - v1_evidence_ids)
        
        # Look for resolved conflicts
        resolved_conflicts = db.query(EvidenceConflict).filter(
            EvidenceConflict.decision_id == decision_id,
            EvidenceConflict.status == "RESOLVED"
        ).count()
        
        # Log Domain Event for Fundraising Memory
        event = DomainEvent(
            decision_id=decision_id,
            event_type="DeckVersionCompared",
            entity_type="Deck",
            actor="System",
            metadata_json={"v1": v1_deck_version, "v2": v2_deck_version, "new_evidence_count": len(new_evidence_ids)}
        )
        db.add(event)
        db.commit()
        
        return {
            "v1_deck_version": v1_deck_version,
            "v2_deck_version": v2_deck_version,
            "metrics": {
                "new_evidence_count": len(new_evidence_ids),
                "resolved_conflicts_count": resolved_conflicts
            },
            "new_evidence_ids": new_evidence_ids
        }
