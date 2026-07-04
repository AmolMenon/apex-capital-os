with open("run_vc01_batch.py", "r") as f:
    code = f.read()

# Replace the import with the actual function definition
code = code.replace("from run_pilot import grade_run", """
def grade_run(golden, state, telemetry_records):
    system_prompt = "You are an expert AI evaluator grading the output of a multi-agent decision system against a Golden Benchmark."
    user_prompt = f\"\"\"
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
    \"\"\"
    
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
    
    from services.llm_provider import LLMProvider
    t0 = time.time()
    try:
        grader_res, tokens = LLMProvider.generate_structured(system_prompt, user_prompt, schema, model_name=settings.APEX_GRADER_MODEL)
    except Exception as e:
        print(f"Grader error: {e}")
        grader_res = {k: 0.0 for k in schema["required"]}
        tokens = {"input": 0, "output": 0, "latency_ms": 0}
        
    latency = int((time.time() - t0) * 1000)
    synthesis = state.get("synthesis", {})
    
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
""")

with open("run_vc01_batch.py", "w") as f:
    f.write(code)
