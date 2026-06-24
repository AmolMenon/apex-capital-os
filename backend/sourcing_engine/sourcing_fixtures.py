import datetime

now = datetime.datetime.utcnow().isoformat() + "Z"

MOCK_THESES = [
    {
        "thesis_id": "india_ai_infra",
        "name": "India AI Infrastructure",
        "sector_focus": ["Indian-language AI", "Sovereign AI", "Enterprise AI Infra", "Vertical AI Workflows"],
        "geography": ["India"],
        "stage_preference": ["Pre-Seed", "Seed", "Series A"],
        "cheque_size": "$1M - $5M",
        "ownership_target": "15-20%",
        "must_have_signals": ["Strong technical team", "Clear data moat for local languages", "B2B enterprise traction"],
        "red_flags": ["Purely wrapping OpenAI without proprietary models", "Excessive cloud compute burn", "Valuation > $50M pre-revenue"],
        "preferred_business_models": ["API-as-a-service", "Enterprise SaaS", "On-premise deployment"],
        "excluded_categories": ["B2C LLM chat apps", "Crypto/AI combinations"],
        "benchmark_companies": ["Sarvam AI", "Krutrim", "Mistral AI (Global benchmark)"],
        "diligence_questions": ["What is the latency for local language generation?", "How are you acquiring high-quality parallel corpora?", "What is the gross margin after GPU costs?"],
        "fund_math_constraints": "Must believe company can reach $500M+ exit to return the fund at target ownership."
    },
    {
        "thesis_id": "ai_app_layer",
        "name": "AI Application Layer",
        "sector_focus": ["Workflow Automation", "Vertical SaaS", "Customer Support", "Sales Automation", "Healthcare AI", "Legal AI", "FinOps AI"],
        "geography": ["Global", "India-SaaS"],
        "stage_preference": ["Seed", "Series A"],
        "cheque_size": "$2M - $8M",
        "ownership_target": "15%",
        "must_have_signals": ["Clear ROI for customer (headcount reduction or revenue increase)", "High Net Dollar Retention (NDR)", "Agentic capabilities (not just copilot)"],
        "red_flags": ["High pilot churn", "Easily replicable by foundation model updates", "Low defensibility"],
        "preferred_business_models": ["Seat-based SaaS", "Outcome-based pricing"],
        "excluded_categories": ["Horizontal productivity tools without vertical focus"],
        "benchmark_companies": ["NeuralDesk", "Zendesk AI", "Harvey"],
        "diligence_questions": ["How do you handle AI hallucinations in production?", "Are customers actually turning off their legacy systems?", "What is the true cost of customer onboarding?"],
        "fund_math_constraints": "Requires rapid scaling to $10M ARR within 3 years to justify Series A valuations."
    },
    {
        "thesis_id": "deeptech_india",
        "name": "Deeptech India",
        "sector_focus": ["Robotics", "Climate Hardware", "Bioengineering", "Industrial Automation", "Semiconductor Infrastructure"],
        "geography": ["India"],
        "stage_preference": ["Seed"],
        "cheque_size": "$1M - $3M",
        "ownership_target": "10-20%",
        "must_have_signals": ["Patents or defensible IP", "Hardware expertise", "Global market applicability"],
        "red_flags": ["Capital intensive hardware without clear milestones", "Dependence on single manufacturing partner", "No path to positive unit economics"],
        "preferred_business_models": ["Hardware + SaaS", "RaaS (Robotics as a Service)"],
        "excluded_categories": ["Pure consumer electronics", "Standard D2C hardware"],
        "benchmark_companies": ["Integra Robotics", "GreyOrange", "Ather Energy"],
        "diligence_questions": ["What is the BOM cost at scale?", "What is the manufacturing scale-up timeline?", "Who owns the IP?"],
        "fund_math_constraints": "Longer time horizon; requires ability to attract large growth capital for manufacturing."
    },
    {
        "thesis_id": "consumer_commerce",
        "name": "Consumer and Commerce Infrastructure",
        "sector_focus": ["Quick Commerce Enablers", "Logistics Intelligence", "Supply Chain Software", "Commerce Infra", "Creator Commerce"],
        "geography": ["India", "SEA"],
        "stage_preference": ["Seed", "Series A"],
        "cheque_size": "$2M - $5M",
        "ownership_target": "15%",
        "must_have_signals": ["High transaction volume", "Network effects", "Strong retention"],
        "red_flags": ["Negative unit economics", "High customer acquisition cost (CAC)", "Dependence on discounting"],
        "preferred_business_models": ["Marketplace take rate", "Transaction fee", "B2B2C"],
        "excluded_categories": ["Standard D2C brands", "Me-too quick commerce delivery"],
        "benchmark_companies": ["Zepto", "Blinkit", "Delhivery"],
        "diligence_questions": ["What is the contribution margin after marketing?", "How frequently do top cohorts transact?", "What is the logistics failure rate?"],
        "fund_math_constraints": "Extremely capital intensive at later stages; must secure strong markup at Series B."
    },
    {
        "thesis_id": "healthcare_bio",
        "name": "Healthcare and Bio Platforms",
        "sector_focus": ["Diagnostics", "Biotech Tooling", "Digital Health Infra", "Clinical Workflow", "Personalized Care"],
        "geography": ["India", "US-India Corridor"],
        "stage_preference": ["Seed", "Series A"],
        "cheque_size": "$2M - $6M",
        "ownership_target": "15%",
        "must_have_signals": ["Clinical validation", "Regulatory clarity (FDA/CDSCO)", "Strong medical/scientific team"],
        "red_flags": ["Long regulatory approval timelines without bridge capital", "Unclear reimbursement pathways", "Lack of clinical efficacy data"],
        "preferred_business_models": ["B2B enterprise healthcare", "SaaS for clinics", "Diagnostic per-test revenue"],
        "excluded_categories": ["Consumer supplements", "Generic telemedicine"],
        "benchmark_companies": ["Pharmeasy", "Innovaccer"],
        "diligence_questions": ["What is the regulatory pathway?", "Who pays for the product (patient, provider, or payer)?", "How is patient data secured?"],
        "fund_math_constraints": "High technical risk but massive potential TAM if regulatory hurdles cleared."
    }
]

MOCK_MARKET_RADAR = [
    {
        "signal_id": "rad_1",
        "signal_title": "Spike in Indic LLM Developer Tooling",
        "market": "India AI Infrastructure",
        "source": "GitHub Trends / HackerNews",
        "date": now,
        "signal_type": "Developer Traction",
        "confidence": "High",
        "relevance_to_thesis": "Directly impacts Sovereign AI and Indian-language AI focus.",
        "companies_mentioned": ["BharatVector AI", "Sarvam AI"],
        "analyst_interpretation": "Developers are shifting from wrapping OpenAI to fine-tuning local models for regional languages. Huge opportunity for infrastructure tooling.",
        "next_action": "Source top 5 fastest-growing repos in this space."
    },
    {
        "signal_id": "rad_2",
        "signal_title": "Enterprise RTO pushing autonomous agent adoption",
        "market": "AI Application Layer",
        "source": "Enterprise CIO Survey (Mock)",
        "date": now,
        "signal_type": "Customer Pain Signal",
        "confidence": "Medium",
        "relevance_to_thesis": "Validates the need for 'Workflow Automation' and 'Sales Automation'.",
        "companies_mentioned": ["TradePilot AI", "NeuralDesk"],
        "analyst_interpretation": "CIOs are looking to replace offshore BPO headcount with autonomous agents. Focus sourcing on vertical specific agentic SaaS.",
        "next_action": "Review BPO-replacement SaaS startups."
    },
    {
        "signal_id": "rad_3",
        "signal_title": "New CDSCO Guidelines for AI in Medical Devices",
        "market": "Healthcare and Bio Platforms",
        "source": "Regulatory Body Announcement",
        "date": now,
        "signal_type": "Regulatory Signal",
        "confidence": "High",
        "relevance_to_thesis": "Impacts 'Clinical Workflow' and 'Diagnostics'.",
        "companies_mentioned": ["KlinikOS AI", "MedScribe AI"],
        "analyst_interpretation": "Clearer regulatory pathways will accelerate hospital adoption of AI diagnostic tools. Wait-and-see period is over.",
        "next_action": "Map regulatory-compliant AI diagnostic startups."
    }
]

MOCK_SOURCED_COMPANIES = [
    {
        "company_id": "src_bharatvector",
        "company_name": "BharatVector AI",
        "sector": "AI Infrastructure",
        "geography": "India (Bengaluru)",
        "stage_estimate": "Seed",
        "business_model": "Enterprise API / On-Prem",
        "public_description": "Building the data infrastructure for Indian language LLMs. BharatVector provides vector databases optimized for Indic language tokenization and retrieval.",
        "discovery_source": "GitHub Trending & TechCrunch Early Stage",
        "signals": [
            {
                "signal": "Ex-Google Brain founders",
                "source": "LinkedIn",
                "confidence": "High",
                "why_it_matters": "Strong technical pedigree required for AI Infra.",
                "thesis_relevance": "Matches 'Strong technical team' requirement.",
                "decision_importance": "Critical",
                "verification_needed": "None",
                "signal_type": "Founder Quality",
                "signal_quality": "Strong signal"
            },
            {
                "signal": "10k GitHub Stars in 2 months",
                "source": "GitHub",
                "confidence": "High",
                "why_it_matters": "Massive developer traction.",
                "thesis_relevance": "Validates market demand.",
                "decision_importance": "High",
                "verification_needed": "Verify active users vs bots.",
                "signal_type": "Developer Traction",
                "signal_quality": "Strong signal"
            }
        ],
        "thesis_fit": {
            "thesis_id": "india_ai_infra",
            "thesis_name": "India AI Infrastructure",
            "fit_score": 92,
            "fit_level": "Strong Fit",
            "reasons_for_fit": ["Directly addresses Indian-language AI", "Strong technical team", "Clear enterprise infra play"],
            "reasons_against_fit": ["No clear revenue signal yet"],
            "missing_info": ["Current burn rate", "Early enterprise pilot details"],
            "suggested_next_action": "Prioritize Founder Call"
        },
        "sourcing_score": {
            "total_score": 88,
            "thesis_fit": 95,
            "market_timing": 90,
            "signal_strength": 85,
            "source_confidence": 90,
            "fund_fit": 80,
            "stage_fit": 95,
            "power_law_potential": 90,
            "knowledge_graph_similarity": 75,
            "diligence_accessibility": 70,
            "hype_risk_adjustment": -10,
            "sourcing_priority": "High Priority"
        },
        "unknowns": ["Revenue", "Compute costs", "Enterprise pilot status"],
        "assumptions": ["Assuming they are raising a Seed round soon based on traction."],
        "source_references": ["github.com/bharatvector", "linkedin.com/company/bharatvector"],
        "recommended_next_action": "Draft founder outreach and schedule introductory call.",
        "status": "Lead",
        "metadata": {"thesis_id": "india_ai_infra"}
    },
    {
        "company_id": "src_klinikos",
        "company_name": "KlinikOS AI",
        "sector": "Healthcare AI",
        "geography": "India (Delhi NCR)",
        "stage_estimate": "Pre-Seed",
        "business_model": "SaaS",
        "public_description": "AI-first hospital management system designed for mid-tier Indian hospitals. Automates billing, patient records, and insurance claims.",
        "discovery_source": "Y Combinator Startup Directory (Mock)",
        "signals": [
            {
                "signal": "YC W24 Batch",
                "source": "YC Directory",
                "confidence": "High",
                "why_it_matters": "Top tier accelerator validation.",
                "thesis_relevance": "Strong team signal.",
                "decision_importance": "Medium",
                "verification_needed": "None",
                "signal_type": "Investor Quality",
                "signal_quality": "Useful signal"
            }
        ],
        "thesis_fit": {
            "thesis_id": "healthcare_bio",
            "thesis_name": "Healthcare and Bio Platforms",
            "fit_score": 75,
            "fit_level": "Moderate Fit",
            "reasons_for_fit": ["Clinical workflow software", "SaaS model"],
            "reasons_against_fit": ["Highly competitive space with entrenched legacy players"],
            "missing_info": ["Go-to-market strategy", "Pricing model"],
            "suggested_next_action": "Add to Watchlist"
        },
        "sourcing_score": {
            "total_score": 70,
            "thesis_fit": 75,
            "market_timing": 70,
            "signal_strength": 65,
            "source_confidence": 80,
            "fund_fit": 80,
            "stage_fit": 90,
            "power_law_potential": 60,
            "knowledge_graph_similarity": 50,
            "diligence_accessibility": 60,
            "hype_risk_adjustment": 0,
            "sourcing_priority": "Watchlist"
        },
        "unknowns": ["Sales cycles", "Integration capabilities with legacy HIS"],
        "assumptions": ["Assuming standard SaaS pricing model."],
        "source_references": ["klinikos.ai", "ycombinator.com/companies/klinikos"],
        "recommended_next_action": "Monitor for post-YC seed round announcement.",
        "status": "Watchlist",
        "metadata": {"thesis_id": "healthcare_bio"}
    },
    {
        "company_id": "src_grid_sense",
        "company_name": "GridSense Robotics",
        "sector": "Deeptech / Robotics",
        "geography": "India (Chennai)",
        "stage_estimate": "Series A",
        "business_model": "RaaS (Robotics as a Service)",
        "public_description": "Autonomous drones and crawlers for power grid and industrial pipeline inspection. Replaces hazardous manual inspection.",
        "discovery_source": "Industrial Tech Conference Winner",
        "signals": [
            {
                "signal": "Secured pilot with major Indian power PSU",
                "source": "News Article",
                "confidence": "Medium",
                "why_it_matters": "Shows enterprise/government willingness to adopt.",
                "thesis_relevance": "Validates market applicability.",
                "decision_importance": "High",
                "verification_needed": "Verify if pilot is paid or unpaid.",
                "signal_type": "Traction Signal",
                "signal_quality": "Useful signal"
            }
        ],
        "thesis_fit": {
            "thesis_id": "deeptech_india",
            "thesis_name": "Deeptech India",
            "fit_score": 85,
            "fit_level": "Strong Fit",
            "reasons_for_fit": ["Industrial automation", "RaaS model", "Clear ROI (safety & efficiency)"],
            "reasons_against_fit": ["Might be too late stage (Series A) for target ownership"],
            "missing_info": ["Valuation expectations", "Hardware BOM cost"],
            "suggested_next_action": "Research valuation"
        },
        "sourcing_score": {
            "total_score": 78,
            "thesis_fit": 85,
            "market_timing": 80,
            "signal_strength": 75,
            "source_confidence": 70,
            "fund_fit": 60, # Late stage hurts fund fit
            "stage_fit": 50,
            "power_law_potential": 85,
            "knowledge_graph_similarity": 60,
            "diligence_accessibility": 50,
            "hype_risk_adjustment": 0,
            "sourcing_priority": "Research Required"
        },
        "unknowns": ["Paid vs Unpaid pilot", "Manufacturing scale"],
        "assumptions": ["Hardware is assembled locally."],
        "source_references": ["gridsense.tech", "industrynews.in/gridsense"],
        "recommended_next_action": "Verify stage and valuation expectations before outreach.",
        "status": "Research Required",
        "metadata": {"thesis_id": "deeptech_india"}
    },
    {
        "company_id": "src_tradepilot",
        "company_name": "TradePilot AI",
        "sector": "AI Application Layer",
        "geography": "India -> US",
        "stage_estimate": "Seed",
        "business_model": "Vertical SaaS",
        "public_description": "AI agents for cross-border freight forwarding. Automates customs documentation, quoting, and tracking via email parsing.",
        "discovery_source": "LinkedIn Talent Updates",
        "signals": [
            {
                "signal": "Hired VP of Engineering from Flexport",
                "source": "LinkedIn",
                "confidence": "High",
                "why_it_matters": "Domain expertise and ability to attract top talent.",
                "thesis_relevance": "Strong indicator of execution capability.",
                "decision_importance": "Medium",
                "verification_needed": "None",
                "signal_type": "Hiring Signal",
                "signal_quality": "Strong signal"
            }
        ],
        "thesis_fit": {
            "thesis_id": "ai_app_layer",
            "thesis_name": "AI Application Layer",
            "fit_score": 88,
            "fit_level": "Strong Fit",
            "reasons_for_fit": ["Vertical SaaS (Logistics)", "Workflow automation", "Agentic capabilities"],
            "reasons_against_fit": [],
            "missing_info": ["Current ARR", "Customer retention"],
            "suggested_next_action": "Founder Outreach"
        },
        "sourcing_score": {
            "total_score": 85,
            "thesis_fit": 90,
            "market_timing": 85,
            "signal_strength": 80,
            "source_confidence": 95,
            "fund_fit": 90,
            "stage_fit": 90,
            "power_law_potential": 80,
            "knowledge_graph_similarity": 70,
            "diligence_accessibility": 60,
            "hype_risk_adjustment": 0,
            "sourcing_priority": "High Priority"
        },
        "unknowns": ["Revenue", "Accuracy of parsing engine"],
        "assumptions": ["Targeting SMB freight forwarders first."],
        "source_references": ["linkedin.com/company/tradepilot-ai"],
        "recommended_next_action": "Send warm intro request via connected investors.",
        "status": "Lead",
        "metadata": {"thesis_id": "ai_app_layer"}
    }
]

MOCK_PIPELINE = [
    {
        "item_id": "pipe_1",
        "company_id": "src_bharatvector",
        "company_name": "BharatVector AI",
        "thesis_id": "india_ai_infra",
        "thesis_name": "India AI Infrastructure",
        "sourcing_score": 88,
        "signal_quality": "Strong",
        "owner": "Sarah",
        "next_action": "Founder Call",
        "last_touch": now,
        "source": "GitHub",
        "reason_for_priority": "Exceptional developer traction",
        "status": "Discovered"
    },
    {
        "item_id": "pipe_2",
        "company_id": "src_klinikos",
        "company_name": "KlinikOS AI",
        "thesis_id": "healthcare_bio",
        "thesis_name": "Healthcare and Bio Platforms",
        "sourcing_score": 70,
        "signal_quality": "Useful",
        "owner": "Unassigned",
        "next_action": "Monitor",
        "last_touch": now,
        "source": "YC",
        "reason_for_priority": "Watch post-demo day",
        "status": "Watchlist"
    },
    {
        "item_id": "pipe_3",
        "company_id": "src_tradepilot",
        "company_name": "TradePilot AI",
        "thesis_id": "ai_app_layer",
        "thesis_name": "AI Application Layer",
        "sourcing_score": 85,
        "signal_quality": "Strong",
        "owner": "David",
        "next_action": "Send Email",
        "last_touch": now,
        "source": "LinkedIn",
        "reason_for_priority": "Key domain hire",
        "status": "Researching"
    }
]
