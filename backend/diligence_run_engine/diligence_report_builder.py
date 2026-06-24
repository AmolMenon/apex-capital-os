class DiligenceReportBuilder:
    @staticmethod
    def build(run_id: str, context: dict, gaps: list, questions: list, decision: dict) -> dict:
        return {
            "run_id": run_id,
            "company_name": context.get("company_name"),
            "input_completeness": context.get("readiness_level"),
            "documents_reviewed": len(context.get("documents", [])),
            "evidence_summary": f"Extracted {len(context.get('evidence_claims', []))} claims.",
            "diligence_gaps": gaps,
            "questions_generated": questions,
            "decision_state": decision.get("recommendation"),
            "trust_audit": f"Trust Score: {decision.get('trust_score')}/100",
            "next_actions": decision.get("next_best_action")
        }
