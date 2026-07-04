import json
from datetime import datetime

def generate_mock_trace_step(agent_name: str, task: str, output: dict, confidence: str = "High", sources: list = [], unknowns: list = []):
    return {
        "step_id": f"step_{agent_name.lower().replace(' ', '_')}",
        "agent_name": agent_name,
        "status": "completed",
        "started_at": "2024-05-15T10:00:00Z",
        "completed_at": "2024-05-15T10:00:10Z",
        "output": {
            "agent_name": agent_name,
            "task": task,
            "input_summary": "Processed inputs from previous agents and blackboard.",
            "output": output,
            "confidence": confidence,
            "sources_used": sources,
            "assumptions": ["Assuming public data is accurate.", "Assuming no unannounced rounds."],
            "unknowns": unknowns,
            "next_actions": ["Pass to next agent in sequence."],
            "metadata": {"processing_time": 2.5}
        }
    }

def build_mock_workflow(company: str):
    # Sarvam AI fixture
    if company == "Sarvam AI":
        return {
            "run_id": "run_sarvam_ai_001",
            "deal_id": "1",
            "company_name": "Sarvam AI",
            "workflow_mode": "mock",
            "status": "completed",
            "agents_run": ["Research Planner", "Search Agent", "Source Quality", "Claim Extraction", "Evidence Verification", "Market Mapping", "Competitor Analysis", "Diligence Gap", "Fund Fit", "Red Team", "Memo Writer", "IC Readiness"],
            "trace": [
                generate_mock_trace_step("Research Planner", "Plan research objectives", {"objectives": ["Identify funding", "Analyze Indian language LLM market", "Verify AI4Bharat founder background"]}),
                generate_mock_trace_step("Search Agent", "Fetch public sources", {"sources": [{"url": "https://techcrunch.com", "type": "media"}], "coverage": "Good"}),
                generate_mock_trace_step("Source Quality", "Score source reliability", {"source_confidence_score": 90, "ranking": ["TechCrunch", "Company Blog"]}),
                generate_mock_trace_step("Claim Extraction", "Extract facts from text", {"claims": [{"claim_text": "$41M Series A", "source": "TechCrunch"}], "unsupported": []}),
                generate_mock_trace_step("Evidence Verification", "Verify extracted claims", {"verified_public_facts": ["Raised $41M Series A from Lightspeed"], "conflicts": []}),
                generate_mock_trace_step("Market Mapping", "Analyze market category", {"category": "GenAI Infrastructure", "growth_drivers": ["Enterprise adoption in India"], "risks": ["Compute costs"]}),
                generate_mock_trace_step("Competitor Analysis", "Map competitors", {"direct": ["Krutrim"], "adjacent": ["OpenAI", "Anthropic"], "moat": "Language-specific data advantage"}),
                generate_mock_trace_step("Diligence Gap", "Identify missing private metrics", {"critical_missing_metrics": ["ARR", "Gross Margin", "Compute/Revenue ratio"], "diligence_questions": ["What is the active enterprise pilot count?"]}, confidence="Medium", unknowns=["Revenue", "Margin"]),
                generate_mock_trace_step("Fund Fit", "Evaluate fund fit", {"fit_score": 85, "conclusion": "Strong fit for thesis, but stage might require larger cheque."}),
                generate_mock_trace_step("Red Team", "Attack the thesis", {"objections": ["Massive compute costs could destroy margins.", "Krutrim has more capital."], "hype_risk": "High", "evidence_risk": "Medium (missing commercial data)"}, confidence="Medium"),
                generate_mock_trace_step("Memo Writer", "Synthesize findings", {"memo_summary": "Sarvam AI is a leading Indian GenAI infra play with elite founders and strong Tier 1 backing, but lacks proven commercial traction in public data."}),
                generate_mock_trace_step("IC Readiness", "Decide IC readiness", {"readiness_level": "Not IC-ready", "blockers": ["Missing ARR", "Missing Gross Margin", "Missing Cohort Retention"], "recommendation_cap": "Diligence Required"})
            ],
            "final_report": {
                "public_benchmark_conclusion": "Strong public signal, private diligence required.",
                "private_diligence_required": ["ARR", "Gross Margin", "Enterprise Pilot Conversion"],
                "fund_fit_summary": "Thesis fit is strong, ownership might be expensive.",
                "ic_readiness_status": "Not IC-ready from public data alone.",
                "recommended_next_step": "Request data room from founders.",
                "key_findings": [
                    {"finding_type": "Funding", "content": "Raised $41M Series A", "confidence": "High"},
                    {"finding_type": "Risk", "content": "Unknown unit economics on compute", "confidence": "High"}
                ]
            },
            "metadata": {
                "provider_used": "mock",
                "fallback_used": True,
                "sources_reviewed": 5,
                "claims_verified": 8,
                "assumptions_created": 3,
                "unknown_metrics": 4,
                "created_at": "2024-05-15T10:00:00Z",
                "completed_at": "2024-05-15T10:02:00Z"
            }
        }
    elif company == "Zepto":
        return {
            "run_id": "run_zepto_001",
            "deal_id": "2",
            "company_name": "Zepto",
            "workflow_mode": "mock",
            "status": "completed",
            "agents_run": ["Research Planner", "Search Agent", "Source Quality", "Claim Extraction", "Evidence Verification", "Market Mapping", "Competitor Analysis", "Diligence Gap", "Fund Fit", "Red Team", "Memo Writer", "IC Readiness"],
            "trace": [
                generate_mock_trace_step("Research Planner", "Plan research objectives", {"objectives": ["Identify valuation", "Analyze quick commerce metrics"]}),
                generate_mock_trace_step("Search Agent", "Fetch public sources", {"sources": [{"url": "https://techcrunch.com", "type": "media"}], "coverage": "Good"}),
                generate_mock_trace_step("Source Quality", "Score source reliability", {"source_confidence_score": 95, "ranking": ["TechCrunch"]}),
                generate_mock_trace_step("Claim Extraction", "Extract facts from text", {"claims": [{"claim_text": "$3.6B Valuation", "source": "TechCrunch"}], "unsupported": []}),
                generate_mock_trace_step("Evidence Verification", "Verify extracted claims", {"verified_public_facts": ["Raised $665M at $3.6B valuation"], "conflicts": []}),
                generate_mock_trace_step("Market Mapping", "Analyze market category", {"category": "Quick Commerce", "growth_drivers": ["Urban convenience"], "risks": ["Burn rate"]}),
                generate_mock_trace_step("Competitor Analysis", "Map competitors", {"direct": ["Blinkit", "Instamart"], "adjacent": ["BigBasket"], "moat": "Execution speed and dark store density"}),
                generate_mock_trace_step("Diligence Gap", "Identify missing private metrics", {"critical_missing_metrics": ["Dark store profitability", "Cohort retention"], "diligence_questions": ["When will EBITDA turn positive?"]}, confidence="Medium", unknowns=["Burn rate", "Retention"]),
                generate_mock_trace_step("Fund Fit", "Evaluate fund fit", {"fit_score": 30, "conclusion": "Too late stage for our mandate."}),
                generate_mock_trace_step("Red Team", "Attack the thesis", {"objections": ["Hyper-competitive market.", "Valuation leaves little upside for early stage fund."], "hype_risk": "Low (execution is real)", "evidence_risk": "Low"}, confidence="High"),
                generate_mock_trace_step("Memo Writer", "Synthesize findings", {"memo_summary": "Zepto is a quick commerce decacorn-track company with massive scale but outside our fund's early-stage mandate."}),
                generate_mock_trace_step("IC Readiness", "Decide IC readiness", {"readiness_level": "Outside Mandate", "blockers": ["Stage mismatch", "Valuation too high"], "recommendation_cap": "Pass"})
            ],
            "final_report": {
                "public_benchmark_conclusion": "Outside fund mandate. Too late stage.",
                "private_diligence_required": ["Dark store profitability"],
                "fund_fit_summary": "Too late stage, check size too small to matter.",
                "ic_readiness_status": "Outside Mandate",
                "recommended_next_step": "Pass (Track for Benchmark)",
                "key_findings": [
                    {"finding_type": "Funding", "content": "Valued at $3.6B", "confidence": "High"},
                    {"finding_type": "Fit", "content": "Stage mismatch", "confidence": "High"}
                ]
            },
            "metadata": {
                "provider_used": "mock",
                "fallback_used": True,
                "sources_reviewed": 8,
                "claims_verified": 12,
                "assumptions_created": 2,
                "unknown_metrics": 3,
                "created_at": "2024-05-15T10:05:00Z",
                "completed_at": "2024-05-15T10:07:00Z"
            }
        }
    else:
        # Generic mock
        return {
            "run_id": f"run_{company.lower()}_001",
            "deal_id": "0",
            "company_name": company,
            "workflow_mode": "mock",
            "status": "completed",
            "agents_run": ["Research Planner", "Search Agent", "Source Quality", "Claim Extraction", "Evidence Verification", "Market Mapping", "Competitor Analysis", "Diligence Gap", "Fund Fit", "Red Team", "Memo Writer", "IC Readiness"],
            "trace": [
                generate_mock_trace_step("Research Planner", "Plan research objectives", {"objectives": ["Identify basic facts"]}),
                generate_mock_trace_step("Search Agent", "Fetch public sources", {"sources": [], "coverage": "Poor"}),
                generate_mock_trace_step("Source Quality", "Score source reliability", {"source_confidence_score": 50, "ranking": []}),
                generate_mock_trace_step("Claim Extraction", "Extract facts from text", {"claims": [], "unsupported": []}),
                generate_mock_trace_step("Evidence Verification", "Verify extracted claims", {"verified_public_facts": [], "conflicts": []}),
                generate_mock_trace_step("Market Mapping", "Analyze market category", {"category": "Unknown", "growth_drivers": [], "risks": []}),
                generate_mock_trace_step("Competitor Analysis", "Map competitors", {"direct": [], "adjacent": [], "moat": "Unknown"}),
                generate_mock_trace_step("Diligence Gap", "Identify missing private metrics", {"critical_missing_metrics": ["Everything"], "diligence_questions": ["What do they do?"]}, confidence="Low", unknowns=["Everything"]),
                generate_mock_trace_step("Fund Fit", "Evaluate fund fit", {"fit_score": 50, "conclusion": "Unknown"}),
                generate_mock_trace_step("Red Team", "Attack the thesis", {"objections": ["No public data"], "hype_risk": "Unknown", "evidence_risk": "Extreme"}, confidence="Low"),
                generate_mock_trace_step("Memo Writer", "Synthesize findings", {"memo_summary": "Insufficient public data to evaluate."}),
                generate_mock_trace_step("IC Readiness", "Decide IC readiness", {"readiness_level": "Not IC-ready", "blockers": ["No public footprint"], "recommendation_cap": "Pass"})
            ],
            "final_report": {
                "public_benchmark_conclusion": "Insufficient public data.",
                "private_diligence_required": ["All metrics"],
                "fund_fit_summary": "Unknown",
                "ic_readiness_status": "Not IC-ready",
                "recommended_next_step": "Pass or request intro.",
                "key_findings": []
            },
            "metadata": {
                "provider_used": "mock",
                "fallback_used": True,
                "sources_reviewed": 0,
                "claims_verified": 0,
                "assumptions_created": 0,
                "unknown_metrics": 10,
                "created_at": "2024-05-15T10:00:00Z",
                "completed_at": "2024-05-15T10:00:05Z"
            }
        }

MOCK_WORKFLOW_FIXTURES = {
    "Sarvam AI": build_mock_workflow("Sarvam AI"),
    "Zepto": build_mock_workflow("Zepto"),
    "Mistral AI": build_mock_workflow("Mistral AI"),
    "TrueFan AI": build_mock_workflow("TrueFan AI"),
    "Integra Robotics": build_mock_workflow("Integra Robotics")
}

def build_dynamic_workflow(company: str, public_profile_json: str = None):
    if not public_profile_json:
        return build_mock_workflow(company)
        
    try:
        profile = json.loads(public_profile_json)
        sector = profile.get("sector", "Technology")
        description = profile.get("public_description", f"{company} operating in {sector}.")
        sources = profile.get("public_sources", [])
        extracted_claims = [c for s in sources for c in s.get("claims_supported", [])]
        
        return {
            "run_id": f"run_{company.lower().replace(' ', '_')}_001",
            "deal_id": "0",
            "company_name": company,
            "workflow_mode": "mock",
            "status": "completed",
            "agents_run": ["Research Planner", "Search Agent", "Source Quality", "Claim Extraction", "Evidence Verification", "Market Mapping", "Competitor Analysis", "Diligence Gap", "Fund Fit", "Red Team", "Memo Writer", "IC Readiness"],
            "trace": [
                generate_mock_trace_step("Research Planner", "Plan research objectives", {"objectives": [f"Analyze {company} in {sector}", "Verify funding"]}),
                generate_mock_trace_step("Search Agent", "Fetch public sources", {"sources": [{"url": s.get("source_url", "https://techcrunch.com"), "type": "media"} for s in sources], "coverage": "Good"}),
                generate_mock_trace_step("Source Quality", "Score source reliability", {"source_confidence_score": profile.get("source_quality_score", 80), "ranking": ["Top Tier"]}),
                generate_mock_trace_step("Claim Extraction", "Extract facts from text", {"claims": [{"claim_text": c, "source": "News"} for c in extracted_claims], "unsupported": []}),
                generate_mock_trace_step("Evidence Verification", "Verify extracted claims", {"verified_public_facts": extracted_claims, "conflicts": []}),
                generate_mock_trace_step("Market Mapping", "Analyze market category", {"category": sector, "growth_drivers": ["Market adoption"], "risks": ["Competition"]}),
                generate_mock_trace_step("Competitor Analysis", "Map competitors", {"direct": ["Incumbents"], "adjacent": [], "moat": "Execution and team"}),
                generate_mock_trace_step("Diligence Gap", "Identify missing private metrics", {"critical_missing_metrics": profile.get("unavailable_metrics", []), "diligence_questions": ["What is cohort retention?"]}, confidence="Medium", unknowns=profile.get("unavailable_metrics", [])),
                generate_mock_trace_step("Fund Fit", "Evaluate fund fit", {"fit_score": 80, "conclusion": f"Strong fit for {sector} thesis."}),
                generate_mock_trace_step("Red Team", "Attack the thesis", {"objections": profile.get("analyst_assumptions", []), "hype_risk": "Medium", "evidence_risk": "Medium"}, confidence="Medium"),
                generate_mock_trace_step("Memo Writer", "Synthesize findings", {"memo_summary": f"{company} is a leading player in {sector}. {description}"}),
                generate_mock_trace_step("IC Readiness", "Decide IC readiness", {"readiness_level": "Diligence Required", "blockers": profile.get("unavailable_metrics", []), "recommendation_cap": "Proceed to founder call"})
            ],
            "final_report": {
                "public_benchmark_conclusion": "Strong public signal, private diligence required.",
                "private_diligence_required": profile.get("unavailable_metrics", []),
                "fund_fit_summary": f"Thesis fit is strong in {sector}.",
                "ic_readiness_status": "Diligence Required",
                "recommended_next_step": "Request data room from founders.",
                "key_findings": [
                    {"finding_type": "Funding", "content": c, "confidence": "High"} for c in extracted_claims
                ]
            },
            "metadata": {
                "provider_used": "mock",
                "fallback_used": True,
                "sources_reviewed": len(sources),
                "claims_verified": len(extracted_claims),
                "assumptions_created": len(profile.get("analyst_assumptions", [])),
                "unknown_metrics": len(profile.get("unavailable_metrics", [])),
                "created_at": "2024-05-15T10:00:00Z",
                "completed_at": "2024-05-15T10:02:00Z"
            }
        }
    except Exception as e:
        return build_mock_workflow(company)
