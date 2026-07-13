import json

def generate_report():
    # 1. RETRY POLICY AUDIT
    retry_audit = """### RETRY_POLICY_AUDIT
- **Implementation:** Replaced `max_retries + 3` fixed 60s sleeps with dynamic classification and bounded exponential backoff with jitter.
- **Fail Fast Classifications:** `DAILY_QUOTA_EXHAUSTED`, `MODEL_QUOTA_ZERO`, `AUTHENTICATION_FAILURE`, `INVALID_REQUEST` throw immediate exceptions.
- **Transient Classifications:** `TRANSIENT_RPM_LIMIT`, `TRANSIENT_TPM_LIMIT`, `SERVER_ERROR`, `NETWORK_ERROR` undergo exponential backoff (max 60s base + jitter), respecting provider `retryDelay` headers.
- **Test Coverage:** Added `tests/test_llm_provider_retry.py` verifying both fail-fast and transient retry logic.
"""

    # 2. REQUEST BUDGET ESTIMATOR
    agents_per_case = 3
    cases = 3
    
    # Per Case topology requests
    single_reqs = 1 + 1 + 1 # reasoning + synthesis + grader
    parallel_reqs = agents_per_case + 1 + 1 # r1 + synthesis + grader
    deliberative_reqs = agents_per_case + 1 + agents_per_case + 1 + 1 # r1 + conflict + r2 + synthesis + grader
    
    shared_extraction_reqs = 1 # extraction
    shared_relationship_reqs = 1 # relationship
    
    total_topology_reqs = cases * (single_reqs + parallel_reqs + deliberative_reqs)
    total_shared_reqs = cases * (shared_extraction_reqs + shared_relationship_reqs)
    
    min_expected = total_topology_reqs + total_shared_reqs
    max_expected = min_expected + 15 # safety margin for retries/unexpected
    
    budget_estimate = f"""### REQUEST_BUDGET_ESTIMATE
- **EXPECTED_REQUESTS_BY_TOPOLOGY:**
  - SINGLE: {single_reqs} calls (1 reasoning, 1 synthesis, 1 grader)
  - PARALLEL: {parallel_reqs} calls ({agents_per_case} R1 agents, 1 synthesis, 1 grader)
  - DELIBERATIVE: {deliberative_reqs} calls ({agents_per_case} R1 agents, 1 conflict, {agents_per_case} R2 agents, 1 synthesis, 1 grader)
- **EXPECTED_REQUESTS_BY_STAGE (Per Case):**
  - Extraction/Relationship: {shared_extraction_reqs + shared_relationship_reqs}
  - Reasoning (All Topologies): {1 + agents_per_case + (agents_per_case * 2 + 1)}
  - Synthesis (All Topologies): 3
  - Grading (All Topologies): 3
- **EXPECTED_REQUESTS_BY_CASE:** {single_reqs + parallel_reqs + deliberative_reqs + shared_extraction_reqs + shared_relationship_reqs} calls
- **MINIMUM_EXPECTED_REQUESTS:** {min_expected} calls total (3 cases)
- **MAXIMUM_EXPECTED_REQUESTS:** {max_expected} calls (assuming normal retry variance)
"""

    # 3. QUOTA REQUIREMENT
    daily_quota = 20 # from previous failure
    quota_req = max_expected * 1.2
    quota_req_str = f"""### QUOTA_REQUIREMENT
- **Required Quota (Max + 20% safety buffer):** {int(quota_req)} requests/day
- **Current Available Quota:** {daily_quota} requests/day (Free Tier)
- **Status:** PILOT_EXECUTION_BLOCKED_INSUFFICIENT_QUOTA
"""

    # 4. COST ESTIMATOR
    # Assumptions based on gemini-2.5-flash standard pricing ($0.075/1M input, $0.30/1M output)
    # Assume 10k input, 1k output per call average
    call_cost = (10000 / 1000000 * 0.075) + (1000 / 1000000 * 0.30)
    
    cost_estimate = f"""### COST_ESTIMATE
*Note: Using planning assumptions of 10k input tokens and 1k output tokens per LLM call using gemini-2.5-flash.*
- **Shared Evidence Preparation Cost (Per Case):** ${(shared_extraction_reqs + shared_relationship_reqs) * call_cost:.4f}
- **Single Topology Cost (Per Case):** ${(single_reqs) * call_cost:.4f}
- **Parallel Topology Cost (Per Case):** ${(parallel_reqs) * call_cost:.4f}
- **Deliberative Topology Cost (Per Case):** ${(deliberative_reqs) * call_cost:.4f}
- **Estimated Total Pilot Cost:** ${min_expected * call_cost:.4f}
- **Maximum Permitted Pilot Cost:** $5.00
"""

    # 5. FAILED RUN INVENTORY
    inventory = """### FAILED RUN INVENTORY
*(Detailed in FAILED_PILOT_EXECUTION_INTEGRITY_APPENDIX.md)*
- DB ID 3: Case VC_01, Topology single, Stage STARTED, Pre-restart (Aborted)
- DB ID 4: Case VC_01, Topology [NULL], Stage STARTED, Pre-restart (Engine auto-fallback)
- DB ID 5: Case VC_01, Topology single, Stage STARTED, Post-restart (Failed/429)
- DB ID 6: Case VC_01, Topology single, Stage STARTED, Post-restart (Failed/429)
All marked as INVALID_FOR_ARCHITECTURE_COMPARISON.
"""

    report = f"# EXPERIMENT EXECUTION READINESS PASS\n\n{retry_audit}\n{budget_estimate}\n{quota_req_str}\n{cost_estimate}\n{inventory}\n\nPILOT_RERUN_INFRASTRUCTURE_BLOCKED\n"
    
    with open('/Users/AmolMenon/.gemini/antigravity/brain/3ba9b9a1-79b1-4bfc-a515-272ee57ab145/READINESS_REPORT.md', 'w') as f:
        f.write(report)

generate_report()
