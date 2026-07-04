# backend/reasoning_engine/integrity_policy.py

class IntegrityPolicy:
    POLICY_VERSION = "v1.0.0"
    
    @staticmethod
    def evaluate_envelope_status(hard_conflicts: list, critical_assumptions: list, unresolved_signals: list) -> dict:
        """
        Deterministically evaluates the overall integrity status based on the envelope's contents.
        Returns:
            {
                "integrity_status": "CLEAR" | "CONDITIONAL" | "BLOCKED_PENDING_REVIEW" | "CRITICAL_REVIEW_REQUIRED",
                "mandatory_human_review": bool,
                "blocking_conditions": list[str]
            }
        """
        blocking_conditions = []
        status = "CLEAR"
        mandatory_review = False
        
        has_critical = False
        has_high = False
        has_medium = False
        
        for c in hard_conflicts:
            if c.get("severity") == "CRITICAL":
                has_critical = True
                blocking_conditions.append(f"CRITICAL: Unresolved evidence conflict between claims {c.get('claim_a_id')} and {c.get('claim_b_id')}")
            elif c.get("severity") == "HIGH":
                has_high = True
                blocking_conditions.append(f"HIGH: Unresolved evidence conflict between claims {c.get('claim_a_id')} and {c.get('claim_b_id')}")
            elif c.get("severity") == "MEDIUM":
                has_medium = True
                
        for a in critical_assumptions:
            # assumptions in the envelope are unverified
            severity = a.get("severity", "HIGH")
            if severity == "CRITICAL":
                has_critical = True
                blocking_conditions.append(f"CRITICAL: Unverified material assumption {a.get('assumption_id')}")
            elif severity == "HIGH":
                has_high = True
                blocking_conditions.append(f"HIGH: Unverified material assumption {a.get('assumption_id')}")
            elif severity == "MEDIUM":
                has_medium = True
                
        for s in unresolved_signals:
            if s.get("severity") == "CRITICAL":
                has_critical = True
                blocking_conditions.append(f"CRITICAL: Unresolved signal {s.get('signal_id')}")
            elif s.get("severity") == "HIGH":
                has_high = True
                blocking_conditions.append(f"HIGH: Unresolved signal {s.get('signal_id')}")
            elif s.get("severity") == "MEDIUM":
                has_medium = True

        if has_critical:
            status = "CRITICAL_REVIEW_REQUIRED"
            mandatory_review = True
        elif has_high:
            status = "BLOCKED_PENDING_REVIEW"
            mandatory_review = True
        elif has_medium:
            status = "CONDITIONAL"
            mandatory_review = False
        else:
            status = "CLEAR"
            mandatory_review = False
            
        return {
            "integrity_status": status,
            "mandatory_human_review": mandatory_review,
            "blocking_conditions": blocking_conditions
        }
