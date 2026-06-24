with open("backend/investment_knowledge_graph/graph_fixtures.py", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip() == "# Portfolio Intelligence Fixtures":
        break
    new_lines.append(line)

portfolio_fixtures = """# Portfolio Intelligence Fixtures
MOCK_PORTFOLIO_ENTITIES = [
    {"entity_id": "comp-neuraldesk", "entity_type": "PortfolioCompany", "name": "NeuralDesk", "status": "active"},
    {"entity_id": "nd-kpi-retention", "entity_type": "KPITrend", "metric": "NDR", "trend": "deteriorating"},
    {"entity_id": "nd-health", "entity_type": "PortfolioHealthScore", "score": 85},
    {"entity_id": "nd-vc-intro", "entity_type": "ValueCreationAction", "type": "Customer Intro", "urgency": "High"},
    
    {"entity_id": "comp-vetpulse", "entity_type": "PortfolioCompany", "name": "VetPulse AI", "status": "needs_support"},
    {"entity_id": "vp-founder-update-1", "entity_type": "FounderUpdate", "clarity": "vague", "risk_flagged": True},
    
    {"entity_id": "comp-paynest", "entity_type": "PortfolioCompany", "name": "PayNest", "status": "watchlist"},
    {"entity_id": "pn-board-deck-1", "entity_type": "BoardDeck", "missing_slide": "Runway"},
    {"entity_id": "pn-follow-on", "entity_type": "FollowOnDecision", "recommendation": "Do Not Follow-On Yet"},
    
    {"entity_id": "comp-carbonloop", "entity_type": "PortfolioCompany", "name": "CarbonLoop", "status": "follow_on_candidate"},
    {"entity_id": "cl-reserve", "entity_type": "ReserveAllocation", "amount": "$8M", "status": "Under-Reserved"},
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
"""

new_lines.append(portfolio_fixtures)

with open("backend/investment_knowledge_graph/graph_fixtures.py", "w") as f:
    f.writelines(new_lines)
