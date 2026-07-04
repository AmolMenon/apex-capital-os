import sys
import os
import time

# Add backend dir to path for imports if run directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from db.database import SessionLocal, engine
from db.models import Base, Decision, DecisionSubject, DomainPack, ReasoningAgent, Document, Chunk, Claim, ReasoningRun
from core.config import settings
from evaluation.datasets import GOLDEN_CASES
from evaluation.graders import SemanticGrader
from evaluation.metrics import EvaluationMetrics
from evaluation.reports import ReportGenerator
from services.ingestion_service import IngestionService
from services.extraction_service import ExtractionService
from reasoning_engine.engine import UniversalReasoningEngine

class EvaluationHarness:
    def __init__(self):
        # We use the test database for evaluations
        self.db = SessionLocal()
        
    def _seed_environment(self):
        # Clear existing test data
        self.db.query(ReasoningRun).delete()
        self.db.query(Claim).delete()
        self.db.query(Chunk).delete()
        self.db.query(Document).delete()
        self.db.query(Decision).delete()
        self.db.query(DecisionSubject).delete()
        self.db.query(ReasoningAgent).delete()
        self.db.query(DomainPack).delete()
        self.db.commit()
        
        # Seed domain packs and agents
        packs = {
            "Venture Capital": {"id": "vc_pack", "name": "Venture Capital"},
            "Corporate Strategy": {"id": "cs_pack", "name": "Corporate Strategy"},
            "Operations": {"id": "op_pack", "name": "Operations"}
        }
        
        for p in packs.values():
            self.db.add(DomainPack(id=p["id"], name=p["name"], config_json="{}"))
            
        self.db.commit()
        
        agents = [
            ReasoningAgent(id="ag_1", domain_pack_id="vc_pack", name="Financial Analyst", system_prompt="Analyze financials", capabilities_json="{}"),
            ReasoningAgent(id="ag_2", domain_pack_id="vc_pack", name="Risk Assessor", system_prompt="Assess risk", capabilities_json="{}"),
            ReasoningAgent(id="ag_3", domain_pack_id="cs_pack", name="Strategist", system_prompt="Analyze strategy", capabilities_json="{}"),
            ReasoningAgent(id="ag_4", domain_pack_id="op_pack", name="Operator", system_prompt="Analyze operations", capabilities_json="{}")
        ]
        for a in agents:
            self.db.add(a)
            
        self.db.commit()
        return packs

    def run_evaluations(self):
        print(f"Starting Evaluation Harness in {settings.APEX_LLM_MODE.upper()} mode...")
        packs = self._seed_environment()
        
        results = {
            "execution_mode": settings.APEX_LLM_MODE,
            "total_cases": 0,
            "domains": set(),
            "avg_precision": 0.0,
            "avg_recall": 0.0,
            "avg_unsupported_rate": 0.0,
            "traceability_pass_rate": 0.0,
            "total_claims_checked": 0,
            "orphaned_claims": 0,
            "avg_reasoning_coverage": 0.0,
            "avg_risk_recall": 0.0,
            "avg_agent_diversity": 0.0,
            "avg_confidence": 0.0,
            "schema_compliance_rate": 0.0,
            "failures": []
        }
        
        engine_service = UniversalReasoningEngine(db=self.db)
        
        for case in GOLDEN_CASES:
            try:
                print(f"Running Case: {case['id']} ({case['domain']})")
                results["domains"].add(case["domain"])
                results["total_cases"] += 1
                
                # 1. Create Subject & Decision
                subject = DecisionSubject(name=f"Subject for {case['id']}", metadata_json="{}")
                self.db.add(subject)
                self.db.commit()
                
                pack_id = packs[case['domain']]["id"]
                decision = Decision(title=case['decision_context'], subject_id=subject.id, domain_pack_id=pack_id)
                self.db.add(decision)
                self.db.commit()
                
                # 2. Ingest Evidence
                # For test simulation, write the strings to temporary files and ingest them
                doc_ids = []
                for idx, ev_text in enumerate(case["evidence_documents"]):
                    file_path = f"/tmp/eval_{case['id']}_{idx}.txt"
                    with open(file_path, "w") as f:
                        f.write(ev_text)
                        
                    doc = IngestionService.ingest_document(self.db, decision.id, file_path, f"eval_{case['id']}_{idx}.txt", "txt")
                    doc_ids.append(doc.id)
                    
                # 3. Extract Claims
                claims = []
                for doc_id in doc_ids:
                    doc_record = self.db.query(Document).filter(Document.id == doc_id).first()
                    for chunk in doc_record.chunks:
                        extracted = ExtractionService.extract_claims_from_chunk(self.db, decision.id, chunk.id, chunk.content)
                        claims.extend(extracted)
                    
                # Grade Claims
                claim_grades = SemanticGrader.grade_claims(case["known_facts"], case["known_assumptions"], [{"statement": c.statement} for c in claims])
                results["avg_precision"] += claim_grades["precision"]
                results["avg_recall"] += claim_grades["recall"]
                results["avg_unsupported_rate"] += claim_grades["unsupported_claim_rate"]
                
                # 4. Reason & Synthesize
                reasoning_output = engine_service.evaluate_decision(decision.id)
                
                # Grade Reasoning
                reasoning_grades = SemanticGrader.grade_reasoning(
                    case["expected_reasoning"], 
                    case["expected_concerns"], 
                    reasoning_output.get("agent_perspectives", [])
                )
                
                results["avg_reasoning_coverage"] += reasoning_grades["reasoning_coverage"]
                results["avg_risk_recall"] += reasoning_grades["risk_recall"]
                results["avg_agent_diversity"] += reasoning_grades["agent_diversity"]
                
                # Synthesis Metrics
                synthesis = reasoning_output.get("synthesis", {})
                results["avg_confidence"] += synthesis.get("confidence", 0)
                
                # Check strict schema compliance
                has_all_fields = all(k in synthesis for k in [
                    "recommendation", "confidence", "summary", 
                    "supporting_claim_ids", "contradicting_claim_ids", "assumption_ids",
                    "key_risks", "missing_information", "agent_disagreements", "memory_objects_used"
                ])
                if has_all_fields:
                    results["schema_compliance_rate"] += 1
                    
                # 5. Traceability Check
                trace_result = EvaluationMetrics.validate_traceability(self.db, synthesis)
                if trace_result["is_valid"]:
                    results["traceability_pass_rate"] += 1
                
                results["total_claims_checked"] += trace_result["claims_checked"]
                
            except Exception as e:
                results["failures"].append({"case_id": case["id"], "error": str(e)})
                
        # Average the results
        n = max(results["total_cases"], 1)
        results["avg_precision"] /= n
        results["avg_recall"] /= n
        results["avg_unsupported_rate"] /= n
        results["avg_reasoning_coverage"] /= n
        results["avg_risk_recall"] /= n
        results["avg_agent_diversity"] /= n
        results["avg_confidence"] /= n
        results["schema_compliance_rate"] /= n
        results["traceability_pass_rate"] /= n
        
        # Write report
        ReportGenerator.generate_baseline_report(results, "/Users/AmolMenon/.gemini/antigravity/brain/3ba9b9a1-79b1-4bfc-a515-272ee57ab145/EVALUATION_BASELINE.md")
        print("Evaluation complete. Report generated.")
        
if __name__ == "__main__":
    harness = EvaluationHarness()
    harness.run_evaluations()
