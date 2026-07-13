from typing import List, Dict, Any

MOCK_FUND_PROFILE = {
    "fund_id": "fund_demo_1",
    "fund_name": "Apex Demo Fund I",
    "fund_size": 1000000000.0, # 100 Cr (in INR logic usually, but here 1B generic units for demo)
    "currency": "INR",
    "fund_type": "early-stage venture",
    "geography_focus": ["India"],
    "sector_focus": [
        "AI infrastructure",
        "AI application layer",
        "healthcare platforms",
        "deeptech",
        "commerce infrastructure"
    ],
    "stage_focus": ["pre-seed", "seed", "Series A"],
    "target_check_size": "₹1Cr to ₹5Cr",
    "target_ownership": "8% to 12%",
    "reserve_ratio": "40%",
    "fund_life": "10 years + 2",
    "investment_period": "3 years",
    "portfolio_construction_target": {
        "max_companies": 35,
        "min_companies": 25,
        "sector_allocations": {
            "AI": 0.40,
            "healthcare": 0.20,
            "deeptech": 0.20,
            "commerce": 0.20
        },
        "stage_allocations": {
            "pre-seed": 0.30,
            "seed": 0.50,
            "Series A": 0.20
        }
    },
    "metadata": {
        "is_mock": True,
        "objective": "at least 1 to 2 companies capable of returning meaningful fund percentage"
    }
}

MOCK_LPS = [
    {
        "lp_id": "lp_1",
        "lp_name": "Meridian Family Office",
        "lp_type": "family office",
        "geography": "India",
        "preferred_sectors": ["AI", "healthcare"],
        "preferred_stage": ["seed", "Series A"],
        "ticket_size": "₹20Cr",
        "relationship_status": "Diligence",
        "last_interaction": "2026-05-15",
        "interest_level": "High",
        "concerns": ["fund maturity and track record"],
        "next_action": "Share track record memo"
    },
    {
        "lp_id": "lp_2",
        "lp_name": "SouthBridge Fund of Funds",
        "lp_type": "fund of funds",
        "geography": "Singapore",
        "preferred_sectors": ["agtech", "fintech"],
        "preferred_stage": ["Series A"],
        "ticket_size": "₹50Cr",
        "relationship_status": "Soft Commit",
        "last_interaction": "2026-06-01",
        "interest_level": "High",
        "concerns": ["portfolio construction and reporting discipline"],
        "next_action": "Finalize LPA"
    },
    {
        "lp_id": "lp_3",
        "lp_name": "Horizon Strategic Capital",
        "lp_type": "strategic LP",
        "geography": "India",
        "preferred_sectors": ["deeptech", "climate"],
        "preferred_stage": ["seed"],
        "ticket_size": "₹15Cr",
        "relationship_status": "First Meeting",
        "last_interaction": "2026-06-10",
        "interest_level": "Medium",
        "concerns": ["commercialization timelines"],
        "next_action": "Send deeptech case studies"
    },
    {
        "lp_id": "lp_4",
        "lp_name": "Northstar Angels Office",
        "lp_type": "HNI",
        "geography": "India",
        "preferred_sectors": ["early-stage India generic"],
        "preferred_stage": ["pre-seed", "seed"],
        "ticket_size": "₹5Cr",
        "relationship_status": "Committed",
        "last_interaction": "2026-04-20",
        "interest_level": "Very High",
        "concerns": ["liquidity and follow-on strategy"],
        "next_action": "Send first capital call notice"
    },
    {
        "lp_id": "lp_5",
        "lp_name": "Asteria Institutional Partners",
        "lp_type": "institutional LP",
        "geography": "US",
        "preferred_sectors": ["AI-native funds"],
        "preferred_stage": ["seed", "Series A"],
        "ticket_size": "₹100Cr",
        "relationship_status": "Contacted",
        "last_interaction": "2026-06-05",
        "interest_level": "Low",
        "concerns": ["governance and fund operations"],
        "next_action": "Share GP operations deck"
    }
]

MOCK_PIPELINE = [
    {
        "item_id": "pipe_1",
        "lp_profile": MOCK_LPS[0],
        "fit_score": 85,
        "relationship_status": "Diligence",
        "concerns": ["fund maturity and track record"],
        "next_action": "Share track record memo",
        "last_touch": "2026-05-15",
        "materials_needed": ["Team Track Record", "Historical DPI"],
        "likely_ticket_size": "₹20Cr",
        "probability": 60,
        "notes": "Good alignment on AI, but they need to be sold on our ability to return."
    },
    {
        "item_id": "pipe_2",
        "lp_profile": MOCK_LPS[1],
        "fit_score": 90,
        "relationship_status": "Soft Commit",
        "concerns": ["portfolio construction and reporting discipline"],
        "next_action": "Finalize LPA",
        "last_touch": "2026-06-01",
        "materials_needed": ["Draft LPA", "Fund OS Demo"],
        "likely_ticket_size": "₹50Cr",
        "probability": 90,
        "notes": "Very excited about the Fund OS reporting capabilities."
    },
    {
        "item_id": "pipe_3",
        "lp_profile": MOCK_LPS[4],
        "fit_score": 70,
        "relationship_status": "Contacted",
        "concerns": ["governance and fund operations"],
        "next_action": "Share GP operations deck",
        "last_touch": "2026-06-05",
        "materials_needed": ["Fund Operations Deck", "Auditor Docs"],
        "likely_ticket_size": "₹100Cr",
        "probability": 20,
        "notes": "Long shot, but great institutional anchor if we land them."
    }
]

MOCK_DATA_ROOM = [
    {"item_id": "dr_1", "title": "Fund Pitch Deck", "category": "Marketing", "status": "ready", "owner": "Managing Partner", "priority": "High", "lp_relevance": "All LPs", "notes": "Updated May 2026"},
    {"item_id": "dr_2", "title": "Investment Thesis", "category": "Strategy", "status": "ready", "owner": "Research Lead", "priority": "High", "lp_relevance": "All LPs", "notes": "Includes Agentic Workflow breakdown"},
    {"item_id": "dr_3", "title": "Team Bios", "category": "Team", "status": "needs update", "owner": "HR", "priority": "Medium", "lp_relevance": "All LPs", "notes": "Need to add new Venture Partner"},
    {"item_id": "dr_4", "title": "Track Record", "category": "Performance", "status": "ready", "owner": "CFO", "priority": "High", "lp_relevance": "Institutional LPs", "notes": "Audited as of Q1 2026"},
    {"item_id": "dr_5", "title": "Portfolio Construction", "category": "Strategy", "status": "ready", "owner": "Managing Partner", "priority": "High", "lp_relevance": "Institutional LPs", "notes": ""},
    {"item_id": "dr_6", "title": "Current Portfolio", "category": "Performance", "status": "needs update", "owner": "CFO", "priority": "High", "lp_relevance": "All LPs", "notes": "Missing latest NeuralDesk markup"},
    {"item_id": "dr_7", "title": "Case Studies", "category": "Marketing", "status": "missing", "owner": "Research Lead", "priority": "Medium", "lp_relevance": "Family Offices", "notes": "Need one for HealthTech"},
    {"item_id": "dr_8", "title": "Investment Memos", "category": "Diligence", "status": "ready", "owner": "Investment Team", "priority": "Low", "lp_relevance": "Deep Diligence LPs", "notes": "3 sample memos uploaded"},
    {"item_id": "dr_9", "title": "IC Process", "category": "Governance", "status": "ready", "owner": "Operations", "priority": "Medium", "lp_relevance": "Institutional LPs", "notes": ""},
    {"item_id": "dr_10", "title": "Risk Management", "category": "Governance", "status": "missing", "owner": "Operations", "priority": "High", "lp_relevance": "Institutional LPs", "notes": "Crucial for Asteria"},
    {"item_id": "dr_11", "title": "Legal Docs (LPA, PPM)", "category": "Legal", "status": "ready", "owner": "General Counsel", "priority": "High", "lp_relevance": "Committing LPs", "notes": ""},
    {"item_id": "dr_12", "title": "Reporting Samples", "category": "Marketing", "status": "ready", "owner": "CFO", "priority": "Medium", "lp_relevance": "Institutional LPs", "notes": "Generated from Fund OS"},
    {"item_id": "dr_13", "title": "ESG Policy", "category": "Governance", "status": "not applicable", "owner": "Operations", "priority": "Low", "lp_relevance": "European LPs", "notes": "Not explicitly tracking yet"},
]

MOCK_FUND_PERFORMANCE = {
    "committed_capital": 1000000000.0,
    "called_capital": 300000000.0,
    "deployed_capital": 250000000.0,
    "reserved_capital": 400000000.0,
    "remaining_dry_powder": 350000000.0,
    "number_of_investments": 12,
    "active_portfolio_companies": 12,
    "follow_on_candidates": 4,
    "watchlist_companies": 2,
    "marked_up_companies": 3,
    "marked_down_companies": 1,
    "unrealized_value": 310000000.0,
    "realized_value": 0.0,
    "tvpi": 1.03,
    "dpi": 0.0,
    "rvpi": 1.03,
    "gross_moic": 1.24,
    "data_confidence": "Mock Data - Unaudited",
    "average_entry_valuation": 45000000.0,
    "weighted_average_ownership": 10.5
}
