import json, sys, os
sys.path.insert(0, os.path.abspath('.'))
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from core.config import settings
from db.models import ReasoningRun, ModelTelemetry, Claim, EvidenceConflict, Document

db = sessionmaker(bind=create_engine(settings.TEST_DATABASE_URL))()
runs = db.query(ReasoningRun).filter_by(experiment_batch_id="canonical_nine_run").order_by(ReasoningRun.id).all()

data = {}
for r in runs:
    case_str = r.case_id or r.evaluation_run_id.split('_')[3] + "_" + r.evaluation_run_id.split('_')[4]
    data[r.id] = {
        "case": case_str,
        "topology": r.execution_topology,
        "status": r.status,
        "grading_status": r.grading_status,
        "state": json.loads(r.intermediate_state_json) if r.intermediate_state_json else {},
        "output": json.loads(r.output_json) if r.output_json else {}
    }
    tels = db.query(ModelTelemetry).filter_by(evaluation_run_id=r.evaluation_run_id).all()
    data[r.id]["telemetry"] = [
        {"input": t.input_tokens, "output": t.output_tokens, "latency": t.latency_ms} 
        for t in tels
    ]

# Also extract frozen claims and conflicts for VC_01
decision_map = {"VC_01": 3, "CS_03": 4, "OP_03": 5}
vc_claims = db.query(Claim).filter_by(decision_id=3).all()
vc_confs = db.query(EvidenceConflict).filter_by(decision_id=3).all()
vc_docs = db.query(Document).filter_by(decision_id=3).all()

env_data = {
    "vc_claims": [{"id": c.id, "statement": c.statement} for c in vc_claims],
    "vc_confs": [{"id": c.id, "description": c.description, "claim_ids": c.claim_ids} for c in vc_confs]
}

with open("analysis_dump.json", "w") as f:
    json.dump({"runs": data, "env": env_data}, f, indent=2)

print(f"Extracted {len(runs)} runs.")
