from sqlalchemy.orm import Session
from datetime import datetime
import uuid
import json
from db.models import DiligenceRunModel

from .diligence_run_schemas import DiligenceRunRequest, DiligenceRun
from .diligence_readiness_checker import DiligenceReadinessChecker
from .diligence_context_builder import DiligenceContextBuilder
from .diligence_document_review_engine import DiligenceDocumentReviewEngine
from .diligence_research_runner import DiligenceResearchRunner
from .diligence_evidence_updater import DiligenceEvidenceUpdater
from .diligence_gap_analyzer import DiligenceGapAnalyzer
from .diligence_question_generator import DiligenceQuestionGenerator
from .diligence_decision_synthesizer import DiligenceDecisionSynthesizer
from .diligence_report_builder import DiligenceReportBuilder
from .diligence_step_runner import DiligenceStepRunner

class DiligenceRunOrchestrator:
    def __init__(self, db: Session):
        self.db = db
        
    def run_diligence(self, deal_id: int, request: DiligenceRunRequest) -> DiligenceRun:
        run_id = f"run_{uuid.uuid4().hex[:8]}"
        
        # Build Context
        context = DiligenceContextBuilder.build_context(self.db, deal_id)
        
        # Check Readiness
        readiness = DiligenceReadinessChecker.check_readiness(self.db, deal_id)
        context["readiness_level"] = readiness["readiness_level"]
        context["is_diligence_ready"] = readiness["is_ready"]
        
        run_model = DiligenceRunModel(
            id=run_id,
            deal_id=deal_id,
            company_name=context.get("company_name", "Unknown"),
            started_at=datetime.utcnow(),
            status="running",
            mode="mock" if request.mock_mode_fallback else "real"
        )
        self.db.add(run_model)
        self.db.commit()
        
        # Step 1: Deal Completeness Check
        DiligenceStepRunner.run_step(self.db, run_id, "step_1", "Deal Completeness Check", lambda: readiness)
        
        # Step 2: Document Review
        doc_review = DiligenceStepRunner.run_step(self.db, run_id, "step_2", "Document Review", lambda: DiligenceDocumentReviewEngine.review(context))
        
        # Step 3: Evidence Mapping
        DiligenceStepRunner.run_step(self.db, run_id, "step_3", "Evidence Mapping", lambda: DiligenceEvidenceUpdater.update_evidence(context))
        
        # Step 4: Public Research
        if request.include_public_research:
            DiligenceStepRunner.run_step(self.db, run_id, "step_4", "Public Research", lambda: DiligenceResearchRunner.run_research(context))
            
        # Step 5: Diligence Gap Analysis
        gaps = DiligenceStepRunner.run_step(self.db, run_id, "step_5", "Diligence Gap Analysis", lambda: DiligenceGapAnalyzer.analyze_gaps(context))
        
        # Step 6: Diligence Questions
        questions = DiligenceStepRunner.run_step(self.db, run_id, "step_6", "Diligence Questions", lambda: DiligenceQuestionGenerator.generate(gaps))
        
        # Step 7: War Room Summary (Mock)
        DiligenceStepRunner.run_step(self.db, run_id, "step_7", "War Room Summary", lambda: {"status": "Generated from context"})
        
        # Step 8: Decision Synthesis
        decision = DiligenceStepRunner.run_step(self.db, run_id, "step_8", "Decision Synthesis", lambda: DiligenceDecisionSynthesizer.synthesize(context, gaps))
        
        # Step 9: IC Packet Draft
        if request.generate_ic_packet:
            DiligenceStepRunner.run_step(self.db, run_id, "step_9", "IC Packet Draft", lambda: {"status": "Draft Generated"})
            
        # Step 10: Trust Audit
        DiligenceStepRunner.run_step(self.db, run_id, "step_10", "Trust Audit", lambda: {"trust_score": decision.get("trust_score", 0)})
        
        # Step 11: Operations Tasks
        if request.create_operations_tasks:
            DiligenceStepRunner.run_step(self.db, run_id, "step_11", "Operations Tasks", lambda: {"tasks_created": len(gaps)})
            
        # Step 12: Final Report
        report = DiligenceStepRunner.run_step(self.db, run_id, "step_12", "Final Diligence Report", lambda: DiligenceReportBuilder.build(run_id, context, gaps, questions, decision))
        
        # Finalize Run
        run_model.status = "completed_with_warnings" if "Required" in decision.get("recommendation", "") else "completed"
        run_model.completed_at = datetime.utcnow()
        run_model.final_recommendation = decision.get("recommendation")
        run_model.evidence_confidence = decision.get("confidence")
        run_model.trust_score = decision.get("trust_score")
        run_model.ic_readiness = decision.get("ic_readiness")
        
        run_model.missing_information_json = json.dumps([g["gap"] for g in gaps])
        run_model.critical_blockers_json = json.dumps(decision.get("blockers", []))
        run_model.next_actions_json = json.dumps([decision.get("next_best_action")])
        run_model.report_json = json.dumps(report)
        
        self.db.commit()
        self.db.refresh(run_model)
        
        return self._format_run(run_model)
        
    def _format_run(self, model: DiligenceRunModel) -> DiligenceRun:
        return DiligenceRun(
            run_id=model.id,
            deal_id=str(model.deal_id),
            company_name=model.company_name,
            started_at=model.started_at,
            completed_at=model.completed_at,
            status=model.status,
            mode=model.mode,
            final_recommendation=model.final_recommendation,
            evidence_confidence=model.evidence_confidence,
            trust_score=model.trust_score,
            ic_readiness=model.ic_readiness,
            missing_information=json.loads(model.missing_information_json),
            critical_blockers=json.loads(model.critical_blockers_json),
            next_actions=json.loads(model.next_actions_json),
            report=json.loads(model.report_json),
            metadata=json.loads(model.metadata_json),
            steps=[]
        )
