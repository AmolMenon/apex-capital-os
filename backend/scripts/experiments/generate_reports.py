import sys, os, json
sys.path.insert(0, os.path.abspath('.'))
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from core.config import settings
from db.models import ReasoningRun, ModelTelemetry
from services.delta_service import DeltaService

db = sessionmaker(bind=create_engine(settings.TEST_DATABASE_URL))()

runs = db.query(ReasoningRun).filter_by(experiment_batch_id="canonical_nine_run").order_by(ReasoningRun.case_id, ReasoningRun.execution_topology).all()

cases = ["VC_01", "CS_03", "OP_03"]
topologies = ["single", "parallel", "deliberative"]

results = {}
for run in runs:
    case = run.case_id or run.evaluation_run_id.split('_')[3] + "_" + run.evaluation_run_id.split('_')[4] # fallback if case_id is null
    if case not in results: results[case] = {}
    
    # metrics
    out = json.loads(run.output_json) if run.output_json else {}
    sm = out.get("semantic_metrics", {})
    
    # telemetry
    tels = db.query(ModelTelemetry).filter_by(evaluation_run_id=run.evaluation_run_id).all()
    in_tokens = sum(t.input_tokens for t in tels if t.input_tokens)
    out_tokens = sum(t.output_tokens for t in tels if t.output_tokens)
    lat = sum(t.latency_ms for t in tels if t.latency_ms)
    calls = len(tels)
    
    # state
    state = json.loads(run.intermediate_state_json) if run.intermediate_state_json else {}
    
    results[case][run.execution_topology] = {
        "run_id": run.id,
        "sm": sm,
        "tokens": in_tokens + out_tokens,
        "latency": lat,
        "calls": calls,
        "state": state
    }

# 1. THREE_CASE_LIVE_PILOT_REPORT
out_3case = "# THREE CASE LIVE PILOT REPORT\n\n"
for case in cases:
    out_3case += f"## {case}\n| Topology | Risk Recall | Contradict Det | Reason Cov | Miss Info | Rec Coherence |\n|---|---|---|---|---|---|\n"
    for top in topologies:
        sm = results[case][top]["sm"]
        if sm:
            out_3case += f"| {top} | {sm.get('risk_recall', 0):.2f} | {sm.get('contradiction_detection', 0):.2f} | {sm.get('reasoning_coverage', 0):.2f} | {sm.get('missing_information_quality', 0):.2f} | {sm.get('recommendation_coherence', 0):.2f} |\n"
        else:
            out_3case += f"| {top} | NULL | NULL | NULL | NULL | NULL |\n"
    out_3case += "\n"

with open("/Users/AmolMenon/.gemini/antigravity/brain/3ba9b9a1-79b1-4bfc-a515-272ee57ab145/THREE_CASE_LIVE_PILOT_REPORT.md", "w") as f:
    f.write(out_3case)

# 2. CANONICAL_RUN_MANIFEST
out_man = "# CANONICAL RUN MANIFEST\n\nExperiment Batch: canonical_nine_run\n\n"
for case in cases:
    for top in topologies:
        out_man += f"- {case} / {top}: Run ID {results[case][top]['run_id']}\n"
with open("/Users/AmolMenon/.gemini/antigravity/brain/3ba9b9a1-79b1-4bfc-a515-272ee57ab145/CANONICAL_RUN_MANIFEST.md", "w") as f:
    f.write(out_man)

# 3. PROVIDER_CALL_ACCOUNTING
out_acc = "# PROVIDER CALL ACCOUNTING\n\n| Case | Topology | Calls | Tokens | Latency (ms) |\n|---|---|---|---|---|\n"
total_calls = 0
total_tokens = 0
for case in cases:
    for top in topologies:
        c = results[case][top]["calls"]
        t = results[case][top]["tokens"]
        l = results[case][top]["latency"]
        total_calls += c
        total_tokens += t
        out_acc += f"| {case} | {top} | {c} | {t} | {l} |\n"
out_acc += f"\n**Total Calls:** {total_calls} (Expected 48)\n**Total Tokens:** {total_tokens}\n"
with open("/Users/AmolMenon/.gemini/antigravity/brain/3ba9b9a1-79b1-4bfc-a515-272ee57ab145/PROVIDER_CALL_ACCOUNTING.md", "w") as f:
    f.write(out_acc)

# 4. DELIBERATION_VALUE_REPORT
out_delib = "# DELIBERATION VALUE REPORT\n\n"
for case in cases:
    state = results[case]["deliberative"]["state"]
    r1 = state.get("round_1", [])
    r2 = state.get("round_2", [])
    out_delib += f"## {case}\n"
    for i, (p1, p2) in enumerate(zip(r1, r2)):
        delta = DeltaService.classify_delta(p1, p2.get("challenge_response", {}))
        out_delib += f"Agent {i+1}: {delta}\n"
    out_delib += "\n"
with open("/Users/AmolMenon/.gemini/antigravity/brain/3ba9b9a1-79b1-4bfc-a515-272ee57ab145/DELIBERATION_VALUE_REPORT.md", "w") as f:
    f.write(out_delib)

# 5. TOPOLOGY_ECONOMICS_REPORT
out_econ = "# TOPOLOGY ECONOMICS REPORT\n\n"
out_econ += "Comparing average token and latency costs across the three cases.\n\n"
avg_t_single = sum(results[c]["single"]["tokens"] for c in cases) / 3
avg_t_parallel = sum(results[c]["parallel"]["tokens"] for c in cases) / 3
avg_t_delib = sum(results[c]["deliberative"]["tokens"] for c in cases) / 3

out_econ += f"- **Single**: {avg_t_single:.0f} tokens/case\n"
out_econ += f"- **Parallel**: {avg_t_parallel:.0f} tokens/case\n"
out_econ += f"- **Deliberative**: {avg_t_delib:.0f} tokens/case\n"
with open("/Users/AmolMenon/.gemini/antigravity/brain/3ba9b9a1-79b1-4bfc-a515-272ee57ab145/TOPOLOGY_ECONOMICS_REPORT.md", "w") as f:
    f.write(out_econ)

