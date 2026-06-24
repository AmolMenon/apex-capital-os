from typing import Dict, Any

class DiligenceDecisionSynthesizer:
    @staticmethod
    def synthesize(context: dict, gaps: list) -> Dict[str, Any]:
        critical_gaps = [g for g in gaps if g["severity"] == "Critical"]
        
        if context.get("readiness_level") in ["Minimal", "Basic"]:
            rec = "Needs More Information"
            readiness = "Not Ready"
            trust = 30
        elif len(critical_gaps) > 0:
            rec = "Diligence Required"
            readiness = "Not Ready"
            trust = 54
        elif context.get("readiness_level") == "Research-Backed" and not context.get("documents"):
            rec = "Benchmark Only"
            readiness = "Not Ready"
            trust = 62
        else:
            rec = "Partner Review Ready"
            readiness = "Draft Ready"
            trust = 78
            
        return {
            "recommendation": rec,
            "confidence": "Medium" if rec in ["Diligence Required", "Needs More Information"] else "High",
            "ic_readiness": readiness,
            "trust_score": trust,
            "evidence_supporting": [],
            "blockers": [g["gap"] for g in critical_gaps],
            "deterministic_gates_applied": ["Data Completeness Check"],
            "what_would_change_recommendation": "Resolving critical blockers and uploading missing docs.",
            "next_best_action": "Collect missing documents from founder" if critical_gaps else "Generate IC Packet draft"
        }
