from typing import List, Dict, Any

class ConfidenceService:
    FORMULA_VERSION = "0.1 (PROVISIONAL, NOT EMPIRICALLY CALIBRATED)"

    @staticmethod
    def calculate_confidence(
        evidence_strength_inputs: Dict[str, Any],
        missing_information_count: int,
        critical_unknowns_count: int,
        unresolved_contradictions_count: int,
        assumption_dependency_ratio: float,
        agent_disagreement_count: int
    ) -> Dict[str, Any]:
        """
        Deterministically calculate system adjusted confidence.
        """
        # Base confidence starts at 100
        base = 100
        
        # 1. Evidence Completeness
        # Penalty for missing information (not critical)
        evidence_completeness_penalty = missing_information_count * 2
        
        # 2. Critical Unknown Penalty
        critical_unknown_penalty = critical_unknowns_count * 10
        
        # 3. Contradiction Penalty
        contradiction_penalty = unresolved_contradictions_count * 15
        
        # 4. Assumption Dependency Penalty
        # ratio 0.0 to 1.0 -> penalty up to 20
        assumption_dependency_penalty = int(assumption_dependency_ratio * 20)
        
        # 5. Agent Disagreement
        agent_disagreement_penalty = agent_disagreement_count * 5
        
        # 6. Evidence Strength
        # Let's say evidence strength is derived from provenance validity
        # For simplicity, if invalid_provenance_count > 0, we subtract
        invalid_provenance_count = evidence_strength_inputs.get("invalid_provenance_count", 0)
        evidence_strength_penalty = invalid_provenance_count * 10
        
        total_penalty = (
            evidence_completeness_penalty +
            critical_unknown_penalty +
            contradiction_penalty +
            assumption_dependency_penalty +
            agent_disagreement_penalty +
            evidence_strength_penalty
        )
        
        system_adjusted_confidence = max(0, base - total_penalty)
        
        return {
            "formula_version": ConfidenceService.FORMULA_VERSION,
            "inputs": {
                "evidence_strength_inputs": evidence_strength_inputs,
                "missing_information_count": missing_information_count,
                "critical_unknowns_count": critical_unknowns_count,
                "unresolved_contradictions_count": unresolved_contradictions_count,
                "assumption_dependency_ratio": assumption_dependency_ratio,
                "agent_disagreement_count": agent_disagreement_count
            },
            "components": {
                "base_confidence": base,
                "evidence_completeness_penalty": -evidence_completeness_penalty,
                "critical_unknown_penalty": -critical_unknown_penalty,
                "contradiction_penalty": -contradiction_penalty,
                "assumption_dependency_penalty": -assumption_dependency_penalty,
                "agent_disagreement_penalty": -agent_disagreement_penalty,
                "evidence_strength_penalty": -evidence_strength_penalty
            },
            "system_adjusted_confidence": system_adjusted_confidence
        }
