from typing import List, Dict, Any

class ReadinessService:
    FORMULA_VERSION = "8.0 (READINESS_INDEX)"

    @staticmethod
    def calculate_readiness(
        evidence_count: int,
        hard_evidence_count: int,
        unresolved_contradictions_count: int,
        missing_information_count: int,
        staleness_penalty_count: int,
        resolved_assumptions_count: int
    ) -> Dict[str, Any]:
        """
        Deterministically calculate the Fundraising Readiness Index.
        NO LLM CONFIDENCE. Fully explainable.
        """
        # 1. Evidence Coverage (Max 25)
        coverage_score = min(25, evidence_count * 2)
        
        # 2. Evidence Quality (Max 35)
        quality_score = min(35, hard_evidence_count * 5)
        
        # 3. Evidence Freshness (Max 10)
        freshness_score = max(0, 10 - (staleness_penalty_count * 2))
        
        # 4. Resolved Assumptions (Max 30)
        resolution_score = min(30, resolved_assumptions_count * 5)
        
        # 5. Penalties
        contradiction_penalty = unresolved_contradictions_count * 20
        diligence_penalty = missing_information_count * 10
        
        total_score = (coverage_score + quality_score + freshness_score + resolution_score) - (contradiction_penalty + diligence_penalty)
        total_score = max(0, min(100, total_score))
        
        explanation_parts = []
        explanation_parts.append(f"Coverage: +{coverage_score}/25 based on {evidence_count} facts.")
        explanation_parts.append(f"Quality: +{quality_score}/35 based on {hard_evidence_count} hard evidence points.")
        explanation_parts.append(f"Freshness: +{freshness_score}/10.")
        explanation_parts.append(f"Resolution: +{resolution_score}/30 from {resolved_assumptions_count} resolved assumptions.")
        
        if contradiction_penalty > 0:
            explanation_parts.append(f"Penalty: -{contradiction_penalty} for {unresolved_contradictions_count} unresolved contradictions.")
        if diligence_penalty > 0:
            explanation_parts.append(f"Penalty: -{diligence_penalty} for {missing_information_count} missing diligence items.")
            
        return {
            "formula_version": ReadinessService.FORMULA_VERSION,
            "readiness_index": total_score,
            "dimensions": {
                "evidence_coverage": coverage_score,
                "evidence_quality": quality_score,
                "evidence_freshness": freshness_score,
                "resolved_assumptions": resolution_score,
                "outstanding_contradictions": unresolved_contradictions_count,
                "outstanding_diligence": missing_information_count
            },
            "explanation": " | ".join(explanation_parts)
        }
