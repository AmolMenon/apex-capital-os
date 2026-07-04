from typing import Dict, Any

MOCK_RESEARCH_BRIEFS = {
    "BharatVector AI": {
        "company_name": "BharatVector AI",
        "research_mode": "mock",
        "queries_used": [
            {"query": "BharatVector AI founding team", "purpose": "Founder verification", "priority": "High", "expected_source_type": "LinkedIn"},
            {"query": "BharatVector AI funding TechCrunch", "purpose": "Funding verification", "priority": "High", "expected_source_type": "News"}
        ],
        "sources_reviewed": [
            {
                "url": "https://techcrunch.com/2025/11/12/bharatvector-ai-emerges-stealth/",
                "title": "BharatVector AI emerges from stealth with ambitious regional LLM plan",
                "domain": "techcrunch.com",
                "raw_text_excerpt": "...",
                "extracted_text": "The company was founded by ex-Google researchers who previously worked on indic language models.",
                "fetch_status": "success",
                "fetched_at": "2026-06-15T10:00:00Z",
                "content_type": "text/html"
            }
        ],
        "claims_extracted": [
            {
                "claim_text": "Founded by ex-Google researchers",
                "claim_type": "Team",
                "value": "ex-Google",
                "currency": "",
                "source_url": "https://techcrunch.com/2025/11/12/bharatvector-ai-emerges-stealth/",
                "source_title": "TechCrunch",
                "source_type": "News",
                "confidence": "High",
                "verification_status": "verified_public_fact"
            }
        ],
        "verified_public_facts": ["Founders are former Google AI researchers with strong NLP backgrounds.", "Building foundational models for Indian regional languages."],
        "media_reported_facts": ["Planning to raise a large Seed round.", "Focusing on enterprise use cases first."],
        "company_claims": ["Models outperform Llama 3 on Indic benchmarks", "Zero-hallucination guarantee for enterprise"],
        "investor_claims": [],
        "analyst_assumptions": ["Pre-revenue", "High infrastructure burn", "Will require massive capital to train foundational models."],
        "unknown_private_metrics": [
            {
                "metric": "Current ARR",
                "is_publicly_available": False,
                "source_count": 0,
                "confidence": "Low",
                "should_use_in_scoring": False,
                "should_mark_unknown": True,
                "diligence_required": "Need current revenue to justify valuation. Are there paying customers or just free pilots?"
            },
            {
                "metric": "Gross Margin & Compute Costs",
                "is_publicly_available": False,
                "source_count": 0,
                "confidence": "Low",
                "should_use_in_scoring": False,
                "should_mark_unknown": True,
                "diligence_required": "Need detailed breakdown of inference vs training costs."
            }
        ],
        "source_conflicts": [
            {
                "topic": "Valuation Expectations",
                "source_a": "The Ken (Reports founder expectation of $40M Cap)",
                "source_b": "Pitchbook Estimates (Models suggest $25M-$30M standard seed for this profile)",
                "resolution_strategy": "Flagged for Partner review. Need to confirm valuation cap in upcoming founder meeting."
            }
        ],
        "evidence_graph": [
            {
                "fact": "Founded by ex-Google researchers",
                "supporting_sources": [{"title": "TechCrunch", "url": "https://techcrunch.com"}],
                "conflicting_sources": [],
                "confidence": "High",
                "last_updated": "2025-11-12",
                "importance": "High"
            }
        ],
        "source_quality_score": 92,
        "public_data_confidence": "High",
        "vc_synthesis": {
            "public_company_snapshot": "High-pedigree team building regional language AI infrastructure.",
            "market_category": "GenAI Infrastructure",
            "funding_signal": "Pre-seed stealth, raising Seed.",
            "investor_signal": "Unknown",
            "product_interpretation": "Regional LLMs fine-tuned for enterprise tasks in Hindi, Tamil, Telugu, etc.",
            "public_traction": "Early stage, team credibility is the main signal.",
            "what_public_data_supports": "Elite technical team with relevant domain expertise.",
            "what_remains_unknown": "Revenue, pilot conversion rates, and true training costs.",
            "private_diligence_questions": ["What is the compute cost vs API revenue ratio?", "How many of the 3 claimed pilots are paid?"],
            "hype_vs_evidence": "High hype around the team, but commercial evidence is missing.",
            "vc_benchmark_conclusion": "Strong public signal on team, but requires deep technical and commercial diligence."
        },
        "citations": [
            {"claim_id": "1", "claim_text": "Founded by ex-Google researchers", "sources": [{"title": "TechCrunch", "url": "https://techcrunch.com"}], "confidence": "High", "display_label": "[1]"}
        ],
        "metadata": {"time_taken": 3.1}
    },
    "Sarvam AI": {
        "company_name": "Sarvam AI",
        "research_mode": "mock",
        "queries_used": [
            {"query": "Sarvam AI funding Series A Lightspeed", "purpose": "Funding details", "priority": "High", "expected_source_type": "News"},
            {"query": "Sarvam AI founders Vivek Raghavan", "purpose": "Founder background", "priority": "High", "expected_source_type": "Company/News"}
        ],
        "sources_reviewed": [
            {
                "url": "https://techcrunch.com/2023/12/07/sarvam-ai-41m-series-a/",
                "title": "Indian generative AI startup Sarvam raises $41M Series A led by Lightspeed",
                "domain": "techcrunch.com",
                "raw_text_excerpt": "...",
                "extracted_text": "Sarvam AI has raised $41 million in a Series A funding round led by Lightspeed, with participation from Peak XV Partners and Khosla Ventures.",
                "fetch_status": "success",
                "fetched_at": "2024-05-15T10:00:00Z",
                "content_type": "text/html"
            }
        ],
        "claims_extracted": [
            {
                "claim_text": "Raised $41 million Series A",
                "claim_type": "Funding",
                "value": "41000000",
                "currency": "USD",
                "source_url": "https://techcrunch.com/2023/12/07/sarvam-ai-41m-series-a/",
                "source_title": "TechCrunch",
                "source_type": "News",
                "confidence": "High",
                "verification_status": "verified_public_fact"
            }
        ],
        "verified_public_facts": ["Raised $41M Series A from Lightspeed, Peak XV, Khosla Ventures"],
        "media_reported_facts": ["Building full-stack generative AI in India"],
        "company_claims": ["Will develop foundational models in Indian languages"],
        "investor_claims": [],
        "analyst_assumptions": ["Pre-revenue", "High infrastructure burn"],
        "unknown_private_metrics": [
            {
                "metric": "ARR",
                "is_publicly_available": False,
                "source_count": 0,
                "confidence": "Low",
                "should_use_in_scoring": False,
                "should_mark_unknown": True,
                "diligence_required": "Need current revenue run rate to justify valuation."
            },
            {
                "metric": "Gross Margin",
                "is_publicly_available": False,
                "source_count": 0,
                "confidence": "Low",
                "should_use_in_scoring": False,
                "should_mark_unknown": True,
                "diligence_required": "Need infrastructure cost breakdown."
            }
        ],
        "source_conflicts": [],
        "evidence_graph": [
            {
                "fact": "Raised $41M Series A",
                "supporting_sources": [{"title": "TechCrunch", "url": "https://techcrunch.com"}],
                "conflicting_sources": [],
                "confidence": "High",
                "last_updated": "2023-12-07",
                "importance": "High"
            }
        ],
        "source_quality_score": 90,
        "public_data_confidence": "High",
        "vc_synthesis": {
            "public_company_snapshot": "Foundational AI model builder for Indian languages.",
            "market_category": "GenAI Infrastructure",
            "funding_signal": "Exceptional ($41M Series A from Tier 1 funds).",
            "investor_signal": "Lightspeed, Peak XV, Khosla Ventures",
            "product_interpretation": "Building sovereign LLMs tailored to Indian dialects and enterprise use cases.",
            "public_traction": "Early stage, mostly model announcements.",
            "what_public_data_supports": "Strong funding and elite founder background (AI4Bharat).",
            "what_remains_unknown": "Revenue, active enterprise customers, gross margins.",
            "private_diligence_questions": ["What is the compute cost vs API revenue ratio?", "Who are the top 3 paying enterprise pilots?"],
            "hype_vs_evidence": "High hype, solid team evidence, missing commercial evidence.",
            "vc_benchmark_conclusion": "Strong public signal, private diligence required."
        },
        "citations": [
            {"claim_id": "1", "claim_text": "Raised $41M Series A", "sources": [{"title": "TechCrunch", "url": "https://techcrunch.com"}], "confidence": "High", "display_label": "[1]"}
        ],
        "metadata": {"time_taken": 2.5}
    },
    "Zepto": {
        "company_name": "Zepto",
        "research_mode": "mock",
        "queries_used": [],
        "sources_reviewed": [{"url": "https://example.com", "title": "Mock Zepto Source", "domain": "example.com", "raw_text_excerpt": "", "extracted_text": "", "fetch_status": "success", "fetched_at": "", "content_type": ""}],
        "claims_extracted": [],
        "verified_public_facts": ["Raised $665M at $3.6B valuation", "10-minute grocery delivery"],
        "media_reported_facts": ["Targeting EBITDA profitability by 2025"],
        "company_claims": ["140% YoY growth"],
        "investor_claims": [],
        "analyst_assumptions": ["High burn rate"],
        "unknown_private_metrics": [{"metric": "Customer Retention", "is_publicly_available": False, "source_count": 0, "confidence": "Low", "should_use_in_scoring": False, "should_mark_unknown": True, "diligence_required": "Need cohort retention data."}],
        "source_conflicts": [],
        "evidence_graph": [],
        "source_quality_score": 85,
        "public_data_confidence": "Medium",
        "vc_synthesis": {
            "public_company_snapshot": "Quick commerce decacorn-track startup.",
            "market_category": "Quick Commerce",
            "funding_signal": "Massive (Latest round at $3.6B).",
            "investor_signal": "StepStone, Goodwater, Nexus",
            "product_interpretation": "Hyperlocal delivery network.",
            "public_traction": "Extremely high GMV growth reported.",
            "what_public_data_supports": "Market leadership in quick commerce.",
            "what_remains_unknown": "Exact burn rate and cohort retention.",
            "private_diligence_questions": ["What is the true dark store profitability?"],
            "hype_vs_evidence": "High evidence of scale, unproven long-term profitability.",
            "vc_benchmark_conclusion": "Outside fund mandate. Too late stage."
        },
        "citations": [],
        "metadata": {}
    },
    "Mistral AI": {
        "company_name": "Mistral AI",
        "research_mode": "mock",
        "queries_used": [],
        "sources_reviewed": [{"url": "https://example.com", "title": "Mock Mistral Source", "domain": "example.com", "raw_text_excerpt": "", "extracted_text": "", "fetch_status": "success", "fetched_at": "", "content_type": ""}],
        "claims_extracted": [],
        "verified_public_facts": ["Raised €600M at €5.8B valuation", "Open-weight models outperform Llama in some benchmarks"],
        "media_reported_facts": [],
        "company_claims": ["Most efficient frontier models"],
        "investor_claims": [],
        "analyst_assumptions": [],
        "unknown_private_metrics": [{"metric": "API Revenue", "is_publicly_available": False, "source_count": 0, "confidence": "Low", "should_use_in_scoring": False, "should_mark_unknown": True, "diligence_required": "Need commercial API revenue figures."}],
        "source_conflicts": [],
        "evidence_graph": [],
        "source_quality_score": 95,
        "public_data_confidence": "High",
        "vc_synthesis": {
            "public_company_snapshot": "European OpenAI competitor focusing on open-weight models.",
            "market_category": "GenAI Models",
            "funding_signal": "Exceptional",
            "investor_signal": "a16z, Lightspeed, Microsoft",
            "product_interpretation": "High-efficiency open-source and commercial LLMs.",
            "public_traction": "Massive developer adoption.",
            "what_public_data_supports": "World-class team and exceptional model efficiency.",
            "what_remains_unknown": "B2B commercialization traction.",
            "private_diligence_questions": ["How will they compete long-term on pricing vs OpenAI?"],
            "hype_vs_evidence": "Evidence perfectly matches the hype.",
            "vc_benchmark_conclusion": "Benchmark profile. Requires private diligence."
        },
        "citations": [],
        "metadata": {}
    }
}
