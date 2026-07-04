import os
import sys
import json
import uuid
import time
import argparse
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.config import settings
from db.database import Base, SessionLocal
import database.crud as crud
from db.models import Claim, ProvenanceType, ReasoningRun
from evaluation.datasets import GOLDEN_CASES
from reasoning_engine.engine import UniversalReasoningEngine
from services.ingestion_service import IngestionService
from services.extraction_service import ExtractionService
from evaluation.metrics import EvaluationMetrics
from evaluation.graders import SemanticGrader

PILOT_CASES = ["VC_01", "CS_03", "OPS_08"]

def setup_test_db(resume_id: str = None):
    engine = create_engine(settings.TEST_DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    return engine

def seed_domain_packs(db: Session):
    from db.models import DomainPack, ReasoningAgent
    for case_id in PILOT_CASES:
        case = next((c for c in GOLDEN_CASES if c["id"] == case_id), None)
        if not case: continue
        dp_id = case.get("domain_pack_id", case["domain"].replace(" ", "_").lower())
        case["domain_pack_id"] = dp_id
        if not crud.get_domain_pack(db, dp_id):
            dp = DomainPack(id=dp_id, name=dp_id.replace("_", " ").title(), description="Seeded for eval")
            db.add(dp)
            agent1 = ReasoningAgent(id=f"{dp_id}_agent1", domain_pack_id=dp_id, name="Strategy Analyst", system_prompt="Focus on strategic alignment.")
            agent2 = ReasoningAgent(id=f"{dp_id}_agent2", domain_pack_id=dp_id, name="Risk Assessor", system_prompt="Focus on identifying vulnerabilities.")
            db.add(agent1)
            db.add(agent2)
            db.commit()

def seed_controlled_claims(db: Session, decision_id: int, case: dict):
    for fact in case.get("known_facts", []):
        claim = Claim(
            decision_id=decision_id,
            statement=fact,
            provenance_type=ProvenanceType.SOURCE_FACT.value,
            confidence=100,
            verification_status="Gold"
        )
        db.add(claim)
    for assumption in case.get("known_assumptions", []):
        claim = Claim(
            decision_id=decision_id,
            statement=assumption,
            provenance_type=ProvenanceType.ASSUMPTION.value,
            confidence=100,
            verification_status="Gold"
        )
        db.add(claim)
    db.commit()

def execute_run(db: Session, engine: UniversalReasoningEngine, case: dict, path: str, topology: str, evaluation_run_id: str, is_smoke: bool = False):
    case_id = case["id"]
    
    # Cost controls
    run_record = db.query(ReasoningRun).filter_by(
        evaluation_run_id=evaluation_run_id, 
        case_id=case_id, 
        evaluation_path=path, 
        execution_topology=topology
    ).first()
    
    if run_record and run_record.stage_status == "GRADING_COMPLETE":
        print(f"Skipping {case_id} {path} {topology}, already complete.")
        return json.loads(run_record.output_json) if run_record.output_json else None

    # Check pilot cost
    total_cost = sum([r.accumulated_cost for r in db.query(ReasoningRun).filter_by(evaluation_run_id=evaluation_run_id).all()])
    if total_cost >= settings.MAX_COST_PER_PILOT:
        print(f"ERROR: Max pilot cost {settings.MAX_COST_PER_PILOT} reached. Aborting.")
        sys.exit(1)
        
    case_cost = sum([r.accumulated_cost for r in db.query(ReasoningRun).filter_by(evaluation_run_id=evaluation_run_id, case_id=case_id).all()])
    if case_cost >= settings.MAX_COST_PER_CASE:
        print(f"ERROR: Max case cost {settings.MAX_COST_PER_CASE} reached for {case_id}. Aborting.")
        sys.exit(1)

    if not run_record:
        from db.models import DecisionSubject, Decision
        subject = DecisionSubject(name=f"Subject {case_id}")
        db.add(subject)
        db.commit()
        decision = Decision(subject_id=subject.id, domain_pack_id=case["domain_pack_id"], title=f"Eval {case_id} {path} {topology}")
        db.add(decision)
        db.commit()
        
        run_record = ReasoningRun(
            decision_id=decision.id,
            evaluation_run_id=evaluation_run_id,
            case_id=case_id,
            domain_pack_id=case["domain_pack_id"],
            execution_mode=settings.APEX_LLM_MODE,
            evaluation_path=path,
            execution_topology=topology,
            provider=settings.APEX_REASONING_PROVIDER,
            model=settings.APEX_REASONING_MODEL,
            stage_status="STARTED"
        )
        db.add(run_record)
        db.commit()
    else:
        decision = db.query(Decision).filter_by(id=run_record.decision_id).first()
        
    # Startup Report
    from db.models import Chunk, Document
    ev_count = db.query(Document).filter_by(decision_id=decision.id).count()
    chunk_count = db.query(Chunk).join(Document).filter(Document.decision_id == decision.id).count()
    claim_count = db.query(Claim).filter_by(decision_id=decision.id).count()
    print("\n--- DATABASE STARTUP REPORT ---")
    print(f"DATABASE PATH: {settings.TEST_DATABASE_URL}")
    print(f"EVALUATION RUN ID: {evaluation_run_id}")
    print(f"DECISION ID: {decision.id}")
    print(f"EXISTING EVIDENCE COUNT FOR DECISION: {ev_count}")
    print(f"EXISTING CHUNK COUNT FOR DECISION: {chunk_count}")
    print(f"EXISTING CLAIM COUNT FOR DECISION: {claim_count}")
    print("-------------------------------\n")

    t0 = time.time()
    
    if run_record.stage_status == "STARTED":
        if path == "A_FULL_PIPELINE":
            doc_text = "\n\n".join(case.get("evidence_documents", []))
            temp_path = f"/tmp/{case_id}_temp.txt"
            with open(temp_path, "w") as f:
                f.write(doc_text)
            doc = IngestionService.ingest_document(db, decision.id, temp_path, f"{case_id}.txt", "txt")
            os.remove(temp_path)
            run_record.stage_status = "INGESTION_COMPLETE"
            db.commit()
            
            from db.models import Chunk
            chunks = db.query(Chunk).filter(Chunk.document_id == doc.id).all()
            for chunk in chunks:
                ExtractionService.extract_claims_from_chunk(db, decision.id, chunk, run_record_id=run_record.id)
            run_record.stage_status = "EXTRACTION_COMPLETE"
            db.commit()
        else:
            seed_controlled_claims(db, decision.id, case)
            run_record.stage_status = "EXTRACTION_COMPLETE"
            db.commit()

    output = engine.evaluate_decision(decision.id, execution_topology=topology, run_record_id=run_record.id)
    run_record.stage_status = "SYNTHESIS_COMPLETE"
    db.commit()
    
    latency_total = int((time.time() - t0) * 1000)
    
    actual_claims = [
        {"statement": c.statement, "quoted_evidence_span": c.quoted_evidence_span} 
        for c in db.query(Claim).filter(Claim.decision_id == decision.id).all()
    ]
    
    if path == "A_FULL_PIPELINE":
        det_metrics = EvaluationMetrics.calculate_precision_recall(
            expected=case.get("known_facts", []) + case.get("known_assumptions", []),
            actual_extracted=actual_claims
        )
    else:
        det_metrics = {
            "precision": "NOT APPLICABLE: GOLD CLAIMS INJECTED",
            "recall": "NOT APPLICABLE: GOLD CLAIMS INJECTED",
            "unsupported_assertion_rate": "NOT APPLICABLE: GOLD CLAIMS INJECTED"
        }
        
    trace_metrics = EvaluationMetrics.validate_traceability(db, output["synthesis"])
    
    sem_metrics = SemanticGrader.grade_semantic_dimensions(
        expected_risks=case["expected_concerns"],
        expected_reasoning=case["expected_reasoning"],
        agent_perspectives=output["agent_perspectives"],
        synthesis=output["synthesis"]
    )
    
    result_dict = {
        "case_id": case_id,
        "path": path,
        "topology": topology,
        "metrics": {
            "deterministic": det_metrics,
            "traceability": trace_metrics,
            "semantic": sem_metrics
        },
        "latency_total_ms": latency_total
    }
    
    run_record.output_json = json.dumps(result_dict)
    run_record.stage_status = "GRADING_COMPLETE"
    db.commit()
    
    if is_smoke:
        print("\n--- SMOKE TEST RESULTS ---")
        print(f"Execution Mode: {settings.APEX_LLM_MODE}")
        print(f"Provider Persisted: {run_record.provider}")
        print(f"Cost tracked: {run_record.accumulated_cost}")
        print(json.dumps(result_dict, indent=2))
        
    return result_dict

def run_pilot(smoke_only: bool = False, resume_id: str = None):
    print("========================================")
    print("APEX LIVE PILOT EVALUATION HARNESS")
    print(f"Extraction Provider: {settings.APEX_EXTRACTION_PROVIDER} ({settings.APEX_EXTRACTION_MODEL})")
    print(f"Reasoning Provider: {settings.APEX_REASONING_PROVIDER} ({settings.APEX_REASONING_MODEL})")
    print(f"Synthesis Provider: {settings.APEX_SYNTHESIS_PROVIDER} ({settings.APEX_SYNTHESIS_MODEL})")
    print(f"Grader Provider: {settings.APEX_GRADER_PROVIDER} ({settings.APEX_GRADER_MODEL})")
    print(f"Mode: {settings.APEX_LLM_MODE}")
    print("========================================\n")
    
    if settings.APEX_LLM_MODE != "live":
        print("WARNING: Running in TEST mode. Results will be mocked.")
    
    engine_db = setup_test_db(resume_id)
    from sqlalchemy.orm import sessionmaker
    SessionTest = sessionmaker(autocommit=False, autoflush=False, bind=engine_db)
    db = SessionTest()
    seed_domain_packs(db)
    
    engine = UniversalReasoningEngine(db)
    evaluation_run_id = resume_id if resume_id else str(uuid.uuid4())
    print(f"Evaluation Run ID: {evaluation_run_id}")
    
    results = []
    
    # Smoke Test Phase
    smoke_case = next((c for c in GOLDEN_CASES if c["id"] == "VC_01"), None)
    if smoke_case:
        print("Running Pre-Flight Smoke Test (VC_01, A_FULL_PIPELINE, deliberative)...")
        res = execute_run(db, engine, smoke_case, "A_FULL_PIPELINE", "deliberative", evaluation_run_id, is_smoke=True)
        
        # Smoke Test Gate
        print("\nVerifying Smoke Test Structural Integrity Gate...")
        run_record = db.query(ReasoningRun).filter_by(evaluation_run_id=evaluation_run_id, case_id="VC_01").first()
        
        smoke_failures = []
        if settings.APEX_LLM_MODE != "live":
            smoke_failures.append("Execution mode is not 'live'.")
        if not run_record or run_record.provider == "test_provider":
            smoke_failures.append("Provider call not confirmed as live.")
        if not res.get("metrics", {}).get("semantic"):
            smoke_failures.append("Structured output missing or invalid.")
        
        claims_count = db.query(Claim).filter_by(decision_id=run_record.decision_id).count()
        if claims_count == 0:
            smoke_failures.append("No claims extracted.")
            
        source_linked_claims = db.query(Claim).filter(Claim.decision_id == run_record.decision_id, Claim.quoted_evidence_span != None).count()
        if source_linked_claims == 0:
            smoke_failures.append("No valid source-linked claim found.")
            
        # Retrieve canonical outputs from intermediate state
        import json
        inter_state = json.loads(run_record.intermediate_state_json) if run_record.intermediate_state_json else {}
        
        agent_perspectives = inter_state.get("round_2") or inter_state.get("round_1", [])
        if not agent_perspectives:
            smoke_failures.append("Agent output not generated.")
            
        # Check Round 2 for deliberative
        has_challenge = any("challenge_response" in p for p in agent_perspectives)
        if not has_challenge:
            smoke_failures.append("Round 2 not executed for deliberative topology.")
            
        synth = inter_state.get("synthesis")
        if not synth:
            smoke_failures.append("Synthesis not generated.")
            
        if synth and "supporting_claim_ids" not in synth:
            smoke_failures.append("Recommendation missing supporting_claim_ids.")
        traceability = res.get("metrics", {}).get("traceability", {})
        if traceability.get("is_valid") is not True:
            smoke_failures.append(f"Claim-to-source provenance validation failed: {traceability.get('errors')}")
            
        if not run_record.token_usage_json:
            smoke_failures.append("Usage metadata not persisted.")
            
        if run_record.accumulated_cost <= 0:
            smoke_failures.append("Cost metadata not persisted.")
            
        if smoke_failures:
            print("\nSMOKE TEST STATUS: FAILED")
            for f in smoke_failures:
                print(f" - {f}")
            print("\nAborting pilot due to smoke test failure.")
            sys.exit(1)
            
        print("\nSMOKE TEST STATUS: PASSED")
            
        if smoke_only:
            print("Smoke test complete. Exiting due to --smoke-only flag.")
            sys.exit(0)
    
    for case_id in PILOT_CASES:
        case = next((c for c in GOLDEN_CASES if c["id"] == case_id), None)
        if not case: continue
        print(f"\nEvaluating Case: {case_id}")
        
        for path in ["A_FULL_PIPELINE", "B_CONTROLLED_REASONING"]:
            print(f"  Path: {path}")
            for topology in ["single", "parallel", "deliberative"]:
                print(f"    Topology: {topology}")
                # Skip the smoke test combination as we already ran it
                if case_id == "VC_01" and path == "A_FULL_PIPELINE" and topology == "deliberative":
                    # append the smoke test result
                    results.append(res)
                    continue
                
                result = execute_run(db, engine, case, path, topology, evaluation_run_id)
                results.append(result)
                
    db.close()
    report_path = os.path.join(os.path.dirname(__file__), "LIVE_PILOT_REPORT.json")
    with open(report_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nPilot complete. Results written to {report_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--smoke-only", action="store_true", help="Run only the smoke test and exit")
    parser.add_argument("--resume", type=str, help="Resume an evaluation run by UUID")
    args = parser.parse_args()
    
    run_pilot(smoke_only=args.smoke_only, resume_id=args.resume)
