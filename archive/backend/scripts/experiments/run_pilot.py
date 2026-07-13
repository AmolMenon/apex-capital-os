import sys, os, json, hashlib, time
sys.path.insert(0, os.path.abspath('.'))
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from core.config import settings
from db.models import Decision, Claim, Assumption, EvidenceConflict, ReasoningRun, ModelTelemetry
from reasoning_engine.engine import UniversalReasoningEngine
from services.llm_provider import LLMProvider
from services.confidence_service import ConfidenceService
from evaluation.datasets import GOLDEN_CASES

db = sessionmaker(bind=create_engine(settings.TEST_DATABASE_URL))()
engine = UniversalReasoningEngine(db=db)

cases_to_run = ["VC_01", "CS_03", "OP_03"]
golden_map = {c["id"]: c for c in GOLDEN_CASES}

# We will collect everything into a massive report struct
report = {
    "vc_01": {},
    "cs_03": {},
    "op_03": {}
}

def verify_snapshot(decision_id, expected_hash):
    claims = db.query(Claim).filter_by(decision_id=decision_id).all()
    assumps = db.query(Assumption).filter_by(decision_id=decision_id).all()
    confs = db.query(EvidenceConflict).filter_by(decision_id=decision_id).all()
    
    # chunk and doc IDs are 1-to-1 per decision since we mocked it
    # We will just hash the claim statements to verify it matches
    def hash_str(s): return hashlib.sha256(s.encode('utf-8')).hexdigest()
    claim_hashes = {c.id: hash_str(c.statement) for c in claims}
    
    # To correctly match the setup hash, we need the doc_ids and chunk_hashes.
    # In setup_snapshots.py:
    # doc_ids = [doc.id]
    # chunk_hashes = {chunk.id: hash_str(chunk.content)}
    from db.models import Document, Chunk
    docs = db.query(Document).filter_by(decision_id=decision_id).all()
    doc_ids = [d.id for d in docs]
    chunks = db.query(Chunk).filter(Chunk.document_id.in_(doc_ids)).all()
    chunk_hashes = {c.id: hash_str(c.content) for c in chunks}
    
    current_hash = hash_str(json.dumps({
        "doc_ids": doc_ids,
        "chunk_hashes": chunk_hashes,
        "claim_hashes": claim_hashes,
        "assumption_ids": [a.id for a in assumps],
        "conflict_ids": [conf.id for conf in confs]
    }, sort_keys=True))
    
    if current_hash != expected_hash:
        print(f"SNAPSHOT INTEGRITY FAILURE for Decision {decision_id}. Expected {expected_hash}, got {current_hash}")
        sys.exit(1)
        
snapshot_hashes = {
    "VC_01": "dd13522ce0cfc7a38490230d7ab5a0dc6ecfb623428438b077ef5df5b7a71545",
    "CS_03": "c752337ed5b848cd06e4e92dc4e2697dd70bd3fce32181dab3e2af855ff914ab",
    "OP_03": "ab1a76288d1dad6b0f4cdb30ef32aac63595f0dacab47560051a2c9b75fbd62f"
}
decision_map = {
    "VC_01": 3,
    "CS_03": 4,
    "OP_03": 5
}

def grade_run(golden, state, telemetry_records):
    # Call the semantic grader
    system_prompt = "You are an expert AI evaluator grading the output of a multi-agent decision system against a Golden Benchmark."
    user_prompt = f"""
    Golden Facts: {json.dumps(golden.get('known_facts', []))}
    Golden Risks: {json.dumps(golden.get('known_risks', []))}
    Golden Contradictions: {json.dumps(golden.get('known_contradictions', []))}
    Expected Reasoning: {json.dumps(golden.get('expected_reasoning', []))}
    
    Actual Synthesis Output:
    {json.dumps(state.get('synthesis', {}))}
    
    Please evaluate the following metrics strictly on a 0.0 to 1.0 scale:
    - risk_recall: proportion of golden risks identified
    - contradiction_detection: proportion of golden contradictions found
    - reasoning_coverage: proportion of expected reasoning logic demonstrated
    - missing_information_quality: relevance of questions asked/info missing (1.0 = extremely insightful, 0.0 = none or irrelevant)
    - recommendation_coherence: logical consistency of the final recommendation
    - semantic_evidence_utilization: how well the agents utilized the source facts
    """
    
    schema = {
        "type": "object",
        "properties": {
            "risk_recall": {"type": "number"},
            "contradiction_detection": {"type": "number"},
            "reasoning_coverage": {"type": "number"},
            "missing_information_quality": {"type": "number"},
            "recommendation_coherence": {"type": "number"},
            "semantic_evidence_utilization": {"type": "number"}
        },
        "required": ["risk_recall", "contradiction_detection", "reasoning_coverage", "missing_information_quality", "recommendation_coherence", "semantic_evidence_utilization"]
    }
    
    t0 = time.time()
    try:
        grader_res, tokens = LLMProvider.generate_structured(system_prompt, user_prompt, schema, model_name=settings.APEX_GRADER_MODEL)
    except Exception as e:
        print(f"Grader error: {e}")
        grader_res = {k: 0.0 for k in schema["required"]}
        tokens = {"input": 0, "output": 0, "latency_ms": 0}
        
    latency = int((time.time() - t0) * 1000)
    
    # Calculate deterministic metrics
    # System Adjusted Confidence is already in state, but wait, the synthesis returns 'model_confidence'.
    # We use the deterministic confidence service.
    synthesis = state.get("synthesis", {})
    missing_info = len(synthesis.get("missing_information", []))
    
    res = {
        "Semantic Metrics": grader_res,
        "Confidence": {
            "Model Confidence": synthesis.get("model_confidence", 0)
        },
        "Tokens": sum(t.input_tokens + t.output_tokens for t in telemetry_records if t.input_tokens),
        "Cost": sum(t.estimated_cost for t in telemetry_records if t.estimated_cost),
        "Latency": sum(t.latency_ms for t in telemetry_records if t.latency_ms),
        "Grader Tokens": tokens.get("input", 0) + tokens.get("output", 0)
    }
    return res

for case_id in cases_to_run:
    print(f"=== Starting {case_id} ===")
    decision_id = decision_map[case_id]
    expected_hash = snapshot_hashes[case_id]
    
    for topology in ["single", "parallel", "deliberative"]:
        print(f"  Running Topology: {topology}")
        verify_snapshot(decision_id, expected_hash)
        
        run = ReasoningRun(
            decision_id=decision_id,
            execution_topology=topology,
            stage_status="STARTED"
        )
        db.add(run)
        db.commit()
        
        try:
            engine.evaluate_decision(decision_id, execution_topology=topology, run_record_id=run.id)
        except Exception as e:
            print(f"Error in {case_id} {topology}: {e}")
            
        # Refresh to get state
        db.refresh(run)
        state = json.loads(run.intermediate_state_json) if run.intermediate_state_json else {}
        telemetry = db.query(ModelTelemetry).filter_by(evaluation_run_id=run.evaluation_run_id).all()
        
        grades = grade_run(golden_map[case_id], state, telemetry)
        
        # Calculate Deliberation Delta if deliberative
        delta = {}
        if topology == "deliberative":
            r1 = state.get("round_1", [])
            r2 = state.get("round_2", [])
            # Super naive delta for logging
            r1_risks = sum(len(p.get("key_risks", [])) for p in r1)
            r2_risks = sum(len(p.get("challenge_response", {}).get("key_risks", [])) for p in r2)
            delta = {
                "new_risks_discovered": max(0, r2_risks - r1_risks),
                "classification": "CONFIDENCE_ONLY_CHANGE" if r1_risks == r2_risks else "SUBSTANTIVE_VALUE_ADDED"
            }
            
        report[case_id][topology] = {
            "run_id": run.evaluation_run_id,
            "grades": grades,
            "delta": delta,
            "recommendation_type": state.get("synthesis", {}).get("recommendation_type", "Unknown")
        }

with open("/Users/AmolMenon/.gemini/antigravity/brain/3ba9b9a1-79b1-4bfc-a515-272ee57ab145/pilot_raw_results.json", "w") as f:
    json.dump(report, f, indent=2)

print("Pilot execution complete!")
