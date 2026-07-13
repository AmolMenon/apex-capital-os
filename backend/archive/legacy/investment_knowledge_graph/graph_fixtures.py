import datetime

now = datetime.datetime.utcnow().isoformat() + "Z"

MOCK_ENTITIES = [
    {"entity_id": "sarvam_ai", "entity_type": "CompanyNode", "name": "Sarvam AI", "description": "Indian AI infrastructure", "confidence": 100, "source_module": "deal_room", "created_at": now, "updated_at": now},
    {"entity_id": "mistral_ai", "entity_type": "CompanyNode", "name": "Mistral AI", "description": "European AI infrastructure", "confidence": 100, "source_module": "benchmarks", "created_at": now, "updated_at": now},
    {"entity_id": "zepto", "entity_type": "CompanyNode", "name": "Zepto", "description": "Quick commerce", "confidence": 100, "source_module": "benchmarks", "created_at": now, "updated_at": now},
    {"entity_id": "neuraldesk", "entity_type": "CompanyNode", "name": "NeuralDesk", "description": "Enterprise AI SaaS", "confidence": 100, "source_module": "deal_room", "created_at": now, "updated_at": now},
    {"entity_id": "truefan_ai", "entity_type": "CompanyNode", "name": "TrueFan AI", "description": "Creator AI", "confidence": 100, "source_module": "deal_room", "created_at": now, "updated_at": now},
    {"entity_id": "integra_robotics", "entity_type": "CompanyNode", "name": "Integra Robotics", "description": "Deeptech robotics", "confidence": 100, "source_module": "deal_room", "created_at": now, "updated_at": now},
    
    {"entity_id": "risk_compute", "entity_type": "RiskNode", "name": "Compute Economics Risk", "description": "GPU cost overruns block path to profitability", "confidence": 95, "source_module": "red_team", "created_at": now, "updated_at": now},
    {"entity_id": "risk_valuation", "entity_type": "RiskNode", "name": "Valuation Ownership Risk", "description": "High valuation blocks target ownership for small fund", "confidence": 98, "source_module": "fund_math", "created_at": now, "updated_at": now},
    {"entity_id": "gap_retention", "entity_type": "DiligenceGapNode", "name": "Missing Retention Cohorts", "description": "Required to prove enterprise stickiness", "confidence": 90, "source_module": "diligence_engine", "created_at": now, "updated_at": now},
]

MOCK_RELATIONSHIPS = [
    {"relationship_id": "r1", "from_entity_id": "sarvam_ai", "to_entity_id": "mistral_ai", "relationship_type": "similar_to", "evidence": "Both building regional foundation models", "confidence": 90, "source_reference": "Benchmark Engine", "decision_relevance": "Mistral's traction shows path to monetization."},
    {"relationship_id": "r2", "from_entity_id": "risk_compute", "to_entity_id": "sarvam_ai", "relationship_type": "creates_risk", "evidence": "Foundational models require massive compute", "confidence": 95, "source_reference": "Red Team", "decision_relevance": "Blocks IC approval without cost breakdown."},
]

MOCK_SIMILAR_DEALS = {
    "1": [  # Sarvam AI
        {
            "company_name": "Mistral AI",
            "similarity_score": 85,
            "why_similar": "Regional sovereign AI foundation model",
            "key_differences": "Geography, fund mandate, stage, and valuation",
            "useful_benchmark_reason": "Proves enterprise demand for local language models",
            "relevant_risks": ["Compute Economics", "Open Source Commoditization"],
            "decision_context": "We missed Mistral early; Sarvam offers a chance to capture the India market if unit economics hold."
        }
    ],
    "2": [ # Zepto
        {
            "company_name": "Instacart",
            "similarity_score": 70,
            "why_similar": "Consumer grocery logistics",
            "key_differences": "Market maturity, dark store model",
            "useful_benchmark_reason": "Benchmark for scale, but not actionable due to valuation/ownership constraints",
            "relevant_risks": ["Burn Rate", "Gross Margin squeeze"],
            "decision_context": "Usually benchmark-only for early-stage funds due to valuation."
        }
    ],
    "3": [ # NeuralDesk
        {
            "company_name": "Zendesk AI",
            "similarity_score": 75,
            "why_similar": "AI customer support replacement",
            "key_differences": "NeuralDesk is agentic, Zendesk is copilot",
            "useful_benchmark_reason": "Private diligence contrast",
            "relevant_risks": ["Enterprise Retention", "Implementation friction"],
            "decision_context": "More actionable than Sarvam because private evidence and ARR exists."
        }
    ]
}

MOCK_PATTERN_FINDINGS = [
    {
        "pattern_id": "p1",
        "pattern_type": "Risk Cluster",
        "description": "AI infrastructure deals repeatedly face compute economics risks that block IC.",
        "deals_affected": ["Sarvam AI", "Mistral AI", "Anthropic"],
        "evidence": "80% of infra deals flagged by Red Team for gross margin concerns.",
        "confidence": 92,
        "implication": "Standardize GPU cost diligence earlier in the pipeline.",
        "recommended_process_change": "Require cloud compute contract summaries before Partner Review."
    },
    {
        "pattern_id": "p2",
        "pattern_type": "Fund Math Failure",
        "description": "Quick commerce and consumer logistics deals repeatedly fail fund math for our fund size.",
        "deals_affected": ["Zepto", "Blinkit"],
        "evidence": "Valuation exceeds ownership feasibility.",
        "confidence": 98,
        "implication": "These deals are strictly benchmarks, not investments.",
        "recommended_process_change": "Add ownership feasibility filter before initial memo creation."
    }
]

MOCK_RECURRING_RISKS = [
    {
        "deals_affected": ["Sarvam AI", "TrueFan AI"],
        "severity": "High",
        "frequency": "Frequent",
        "evidence": "Compute overhead",
        "mitigation": "Partner with cloud provider",
        "partner_question": "What is the margin floor?",
        "ic_impact": "Blocks without clarity"
    }
]

MOCK_DILIGENCE_GAPS = [
    {
        "affected_deals": ["NeuralDesk", "TrueFan AI", "Sarvam AI"],
        "frequency": "Very High",
        "severity": "Critical",
        "required_document": "Retention Cohorts",
        "suggested_founder_ask": "Can you provide logo and NRR retention by cohort for the last 12 months?",
        "suggested_data_room_request": "Add retention cohort template to standard data room request."
    }
]

MOCK_SOURCE_RELIABILITY = [
    {
        "source_type": "Founder Transcript",
        "average_reliability": 60,
        "common_issues": ["Optimistic timelines", "Unverified ARR claims"],
        "decision_usefulness": "High for vision, Low for metrics",
        "confidence_adjustment": -20
    },
    {
        "source_type": "Uploaded KPI Sheet",
        "average_reliability": 95,
        "common_issues": ["Formatting inconsistencies"],
        "decision_usefulness": "Critical for IC",
        "confidence_adjustment": 30
    }
]

MOCK_DECISION_MEMORY = [
    {
        "memory_id": "dm1",
        "deal_id": "mistral_ai",
        "company_name": "Mistral AI",
        "deal_type": "AI Infra",
        "recommendation": "Pass",
        "confidence": 90,
        "evidence_score": 85,
        "ic_readiness": "Blocked",
        "fund_fit": "Poor",
        "red_team_severity": "High",
        "partner_support": "Mixed",
        "fund_math_result": "Failed: Valuation too high for 15% target",
        "decision_blockers": ["Valuation", "Fund Math"],
        "next_action": "Track as benchmark",
        "what_changed_the_decision": "Term sheet valuation exceeded fund modeling feasibility.",
        "created_at": "2024-01-15T00:00:00Z"
    }
]

MOCK_LEARNING_NODES = [
    {
        "learning_id": "l1",
        "learning": "Missing retention data blocks 40% of early IC reviews.",
        "why_it_matters": "Delays partner decisions and wastes Monday meeting time.",
        "evidence": "NeuralDesk and TrueFan AI both lacked cohort data in the first folder.",
        "suggested_workflow_change": "Add retention cohort template to standard data room request before first partner meeting.",
        "priority": "High",
        "affected_modules": ["Data Room", "Checklist"]
    },
    {
        "learning_id": "l2",
        "learning": "Public benchmarks have strong funding signals but weak private data.",
        "why_it_matters": "Confuses analysts comparing Zepto to private startups.",
        "evidence": "Mistral and Zepto show 90% public data, 0% private metrics.",
        "suggested_workflow_change": "Show public signal and private diligence separately by default.",
        "priority": "Medium",
        "affected_modules": ["Decision Engine"]
    }
]

# Portfolio Intelligence Fixtures
MOCK_PORTFOLIO_ENTITIES = [
    {"entity_id": "comp-neuraldesk", "entity_type": "PortfolioCompany", "name": "NeuralDesk", "status": "active", "source_module": "portfolio_engine", "created_at": now, "updated_at": now},
    {"entity_id": "nd-kpi-retention", "entity_type": "KPITrend", "name": "NDR", "metric": "NDR", "trend": "deteriorating", "source_module": "portfolio_engine", "created_at": now, "updated_at": now},
    {"entity_id": "nd-health", "entity_type": "PortfolioHealthScore", "name": "Health 85", "score": 85, "source_module": "portfolio_engine", "created_at": now, "updated_at": now},
    {"entity_id": "nd-vc-intro", "entity_type": "ValueCreationAction", "name": "Customer Intro", "type": "Customer Intro", "urgency": "High", "source_module": "portfolio_engine", "created_at": now, "updated_at": now},
    
    {"entity_id": "comp-vetpulse", "entity_type": "PortfolioCompany", "name": "VetPulse AI", "status": "needs_support", "source_module": "portfolio_engine", "created_at": now, "updated_at": now},
    {"entity_id": "vp-founder-update-1", "entity_type": "FounderUpdate", "name": "Update 1", "clarity": "vague", "risk_flagged": True, "source_module": "portfolio_engine", "created_at": now, "updated_at": now},
    
    {"entity_id": "comp-paynest", "entity_type": "PortfolioCompany", "name": "PayNest", "status": "watchlist", "source_module": "portfolio_engine", "created_at": now, "updated_at": now},
    {"entity_id": "pn-board-deck-1", "entity_type": "BoardDeck", "name": "Board Deck 1", "missing_slide": "Runway", "source_module": "portfolio_engine", "created_at": now, "updated_at": now},
    {"entity_id": "pn-follow-on", "entity_type": "FollowOnDecision", "name": "Do Not Follow-On Yet", "recommendation": "Do Not Follow-On Yet", "source_module": "portfolio_engine", "created_at": now, "updated_at": now},
    
    {"entity_id": "comp-carbonloop", "entity_type": "PortfolioCompany", "name": "CarbonLoop", "status": "follow_on_candidate", "source_module": "portfolio_engine", "created_at": now, "updated_at": now},
    {"entity_id": "cl-reserve", "entity_type": "ReserveAllocation", "name": "$8M", "amount": "$8M", "status": "Under-Reserved", "source_module": "portfolio_engine", "created_at": now, "updated_at": now},
]

MOCK_PORTFOLIO_EDGES = [
    {"relationship_id": "pe1", "from_entity_id": "comp-neuraldesk", "to_entity_id": "nd-kpi-retention", "relationship_type": "portfolio_company_has_kpi"},
    {"relationship_id": "pe2", "from_entity_id": "nd-kpi-retention", "to_entity_id": "nd-health", "relationship_type": "kpi_trend_affects_health"},
    {"relationship_id": "pe3", "from_entity_id": "nd-vc-intro", "to_entity_id": "comp-neuraldesk", "relationship_type": "value_creation_action_targets"},
    
    {"relationship_id": "pe4", "from_entity_id": "vp-founder-update-1", "to_entity_id": "comp-vetpulse", "relationship_type": "founder_update_reports"},
    
    {"relationship_id": "pe5", "from_entity_id": "pn-board-deck-1", "to_entity_id": "comp-paynest", "relationship_type": "board_deck_flags_risk"},
    {"relationship_id": "pe6", "from_entity_id": "pn-follow-on", "to_entity_id": "comp-paynest", "relationship_type": "follow_on_decision_based_on"},
    
    {"relationship_id": "pe7", "from_entity_id": "cl-reserve", "to_entity_id": "comp-carbonloop", "relationship_type": "reserve_allocation_supports"},
]

MOCK_PORTFOLIO_INSIGHTS = [
    {
        "pattern_id": "pi1",
        "pattern_type": "Portfolio Risk",
        "description": "Deals with weak retention at diligence tend to need support post-investment.",
        "deals_affected": [],
        "evidence": "4 deals follow this pattern.",
        "confidence": 88,
        "implication": "Watch retention closely.",
        "recommended_process_change": "Track NDR tightly."
    },
    {
        "pattern_id": "pi2",
        "pattern_type": "Portfolio Risk",
        "description": "Companies with vague founder updates often become watchlist.",
        "deals_affected": [],
        "evidence": "6 deals follow this pattern.",
        "confidence": 92,
        "implication": "Intervene early.",
        "recommended_process_change": "Mandate clear KPIs in updates."
    }
]

MOCK_ENTITIES.extend(MOCK_PORTFOLIO_ENTITIES)
MOCK_RELATIONSHIPS.extend(MOCK_PORTFOLIO_EDGES)
MOCK_PATTERN_FINDINGS.extend(MOCK_PORTFOLIO_INSIGHTS)
