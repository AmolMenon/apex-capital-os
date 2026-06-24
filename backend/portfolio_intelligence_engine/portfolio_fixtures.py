from portfolio_intelligence_engine.portfolio_schemas import (
    PortfolioCompany, PortfolioKPI, KPITimeSeries, FounderUpdate,
    BoardDeckAnalysis, PortfolioHealthScore, FollowOnRecommendation,
    ValueCreationRecommendation, ReserveAllocationOutput
)

MOCK_PORTFOLIO_COMPANIES = {
    "comp-neuraldesk": PortfolioCompany(
        company_id="comp-neuraldesk",
        deal_id="deal-1", # Assuming NeuralDesk was deal-1 in diligence
        company_name="NeuralDesk",
        sector="Enterprise AI",
        stage_at_entry="Seed",
        entry_date="2024-06-15",
        entry_valuation="$15M Post",
        initial_check_size="$2M",
        initial_ownership="13.3%",
        current_ownership="13.3%",
        reserve_allocated="$3M",
        lead_partner="Sarah",
        portfolio_status="active",
        latest_health_score=85,
        metadata={"description": "Enterprise AI workflow automation"}
    ),
    "comp-vetpulse": PortfolioCompany(
        company_id="comp-vetpulse",
        company_name="VetPulse AI",
        sector="Vertical SaaS",
        stage_at_entry="Series A",
        entry_date="2023-11-01",
        entry_valuation="$40M Post",
        initial_check_size="$5M",
        initial_ownership="12.5%",
        current_ownership="10.2%",
        reserve_allocated="$4M",
        lead_partner="Marcus",
        portfolio_status="needs_support",
        latest_health_score=62,
        metadata={"description": "Veterinary clinic intelligence"}
    ),
    "comp-carbonloop": PortfolioCompany(
        company_id="comp-carbonloop",
        company_name="CarbonLoop",
        sector="Climate Tech",
        stage_at_entry="Seed",
        entry_date="2024-01-20",
        entry_valuation="$20M Post",
        initial_check_size="$3M",
        initial_ownership="15.0%",
        current_ownership="15.0%",
        reserve_allocated="$5M",
        lead_partner="Elena",
        portfolio_status="follow_on_candidate",
        latest_health_score=92,
        metadata={"description": "Climate supply chain software"}
    ),
    "comp-biosignal": PortfolioCompany(
        company_id="comp-biosignal",
        company_name="BioSignal Labs",
        sector="Bioengineering",
        stage_at_entry="Pre-Seed",
        entry_date="2024-03-10",
        entry_valuation="$8M Post",
        initial_check_size="$1M",
        initial_ownership="12.5%",
        current_ownership="12.5%",
        reserve_allocated="$2M",
        lead_partner="David",
        portfolio_status="watchlist",
        latest_health_score=55,
        metadata={"description": "Bioengineering diagnostics platform"}
    ),
    "comp-paynest": PortfolioCompany(
        company_id="comp-paynest",
        company_name="PayNest",
        sector="Fintech",
        stage_at_entry="Series B",
        entry_date="2022-09-15",
        entry_valuation="$150M Post",
        initial_check_size="$10M",
        initial_ownership="6.6%",
        current_ownership="4.2%",
        reserve_allocated="$5M",
        lead_partner="Sarah",
        portfolio_status="watchlist",
        latest_health_score=48,
        metadata={"description": "Fintech infrastructure for SME payments"}
    ),
    "comp-gridsense": PortfolioCompany(
        company_id="comp-gridsense",
        company_name="GridSense Robotics",
        sector="Robotics",
        stage_at_entry="Seed",
        entry_date="2024-05-01",
        entry_valuation="$18M Post",
        initial_check_size="$2.5M",
        initial_ownership="13.8%",
        current_ownership="13.8%",
        reserve_allocated="$4M",
        lead_partner="Marcus",
        portfolio_status="active",
        latest_health_score=78,
        metadata={"description": "Industrial inspection robotics"}
    )
}

MOCK_HEALTH_SCORES = {
    "comp-neuraldesk": PortfolioHealthScore(
        overall_score=85,
        growth_score=90,
        retention_score=75,
        margin_score=80,
        runway_score=95,
        execution_score=88,
        reporting_quality_score=90,
        founder_communication_score=85,
        risk_score=20,
        trend="improving"
    ),
    "comp-vetpulse": PortfolioHealthScore(
        overall_score=62,
        growth_score=50,
        retention_score=85,
        margin_score=60,
        runway_score=70,
        execution_score=55,
        reporting_quality_score=75,
        founder_communication_score=80,
        risk_score=65,
        trend="stable"
    ),
    "comp-carbonloop": PortfolioHealthScore(
        overall_score=92,
        growth_score=95,
        retention_score=90,
        margin_score=70, # Needs margin clarity
        runway_score=85,
        execution_score=98,
        reporting_quality_score=95,
        founder_communication_score=95,
        risk_score=15,
        trend="improving"
    ),
    "comp-biosignal": PortfolioHealthScore(
        overall_score=55,
        growth_score=40,
        retention_score=0, # Pre-revenue mostly
        margin_score=0,
        runway_score=60,
        execution_score=65,
        reporting_quality_score=70,
        founder_communication_score=85,
        risk_score=85, # Regulatory/Technical Risk
        trend="deteriorating"
    ),
    "comp-paynest": PortfolioHealthScore(
        overall_score=48,
        growth_score=80,
        retention_score=65,
        margin_score=30,
        runway_score=20, # Burn high, runway concern
        execution_score=50,
        reporting_quality_score=60,
        founder_communication_score=55,
        risk_score=90,
        trend="deteriorating"
    ),
    "comp-gridsense": PortfolioHealthScore(
        overall_score=78,
        growth_score=85,
        retention_score=80,
        margin_score=40, # Hardware margin uncertainty
        runway_score=80,
        execution_score=90,
        reporting_quality_score=85,
        founder_communication_score=80,
        risk_score=40,
        trend="stable"
    )
}

MOCK_FOUNDER_UPDATES = {
    "comp-neuraldesk": FounderUpdate(
        update_id="update-nd-01",
        company_id="comp-neuraldesk",
        reporting_period="Q2 2024",
        raw_text="Great quarter. ARR grew to $2.1M. Strong enterprise pipeline. We are still seeing some early churn in the mid-market segment which we are diagnosing. We hired a new VP Eng.",
        metrics_reported=["ARR: $2.1M", "Cash: $12M", "Burn: $400k/mo"],
        wins=["Hit $2.1M ARR", "Hired VP Eng from Anthropic", "Closed 3 enterprise pilots"],
        misses=["Mid-market retention lower than expected (82% NDR)"],
        asks=["Need intros to Fortune 500 CIOs for Q3 pipeline"],
        risks=["Retention risk in mid-market segment"],
        hiring_updates=["Hired VP Engineering", "Looking for 2 Enterprise AEs"],
        customer_updates=["Signed Acme Corp", "Signed Globex"],
        fundraising_updates=["Not fundraising for 12 months"],
        runway_update="30 months",
        confidence="High",
        extracted_at="2024-07-05T10:00:00Z"
    ),
    "comp-vetpulse": FounderUpdate(
        update_id="update-vp-01",
        company_id="comp-vetpulse",
        reporting_period="Q2 2024",
        raw_text="Product usage is incredibly strong among active clinics (daily active users up 40%). However, our clinic rollout is slower than planned due to integration hurdles with legacy practice management software. Need help with GTM.",
        metrics_reported=["ARR: $3.4M", "Clinics Live: 142", "Burn: $650k/mo"],
        wins=["Strong engagement in live clinics", "Zero churn this quarter"],
        misses=["Missed new clinic deployment target by 40%"],
        asks=["Need advice on channel partnership GTM strategy"],
        risks=["GTM scaling bottlenecks", "Integration dependency"],
        hiring_updates=["Paused sales hiring until integration bottleneck is resolved"],
        customer_updates=["Onboarded 12 new clinics"],
        fundraising_updates=["May need a bridge round if deployments don't accelerate"],
        runway_update="14 months",
        confidence="Medium",
        extracted_at="2024-07-05T10:00:00Z"
    ),
    # Let's add CarbonLoop
    "comp-carbonloop": FounderUpdate(
        update_id="update-cl-01",
        company_id="comp-carbonloop",
        reporting_period="Q2 2024",
        raw_text="Explosive quarter. Unprecedented customer pull due to new EU regulations. Tripled ARR to $1.8M. We are sprinting to keep up with deployments. Gross margins took a hit because we used manual services to fulfill.",
        metrics_reported=["ARR: $1.8M", "Gross Margin: 42%", "Burn: $300k/mo"],
        wins=["Tripled ARR", "Signed massive EU conglomerate"],
        misses=["Gross margins dipped to 42% due to manual onboarding"],
        asks=["Need help prepping Series A deck and metrics narrative"],
        risks=["Margin compression", "Onboarding bottleneck"],
        hiring_updates=["Aggressively hiring implementation managers"],
        customer_updates=["5 new enterprise logos"],
        fundraising_updates=["Planning to raise Series A in Q4"],
        runway_update="24 months",
        confidence="Very High",
        extracted_at="2024-07-05T10:00:00Z"
    )
}

MOCK_BOARD_DECKS = {
    "comp-neuraldesk": BoardDeckAnalysis(
        company_id="comp-neuraldesk",
        company_narrative="Scaling enterprise GTM successfully, but mid-market churn is dragging NDR down. Need to double down on upmarket accounts.",
        kpi_trends=["ARR: +45% QoQ", "Burn: Flat", "NDR: 98%"],
        actuals_vs_plan="Beat ARR plan by 15%, missed retention target by 5%.",
        hiring_plan="On track. VP Eng hired.",
        runway="30 months",
        burn="$400k/mo",
        sales_pipeline="Strong enterprise pipeline built, $4M in late stage.",
        customer_wins_losses="Won Acme Corp. Lost 2 mid-market accounts to churn.",
        product_milestones="Shipped v2 automation engine.",
        risks=["Mid-market churn", "Enterprise sales cycle length"],
        asks_from_board=["Intros to CIOs", "Feedback on new pricing model"],
        inconsistencies=["Pipeline conversion rates don't match historicals (projected too high)"],
        missing_slides=["No cohort retention slide"],
        board_deck_quality_score=85
    )
}

MOCK_FOLLOW_ON_RECOMMENDATIONS = {
    "comp-carbonloop": FollowOnRecommendation(
        company_id="comp-carbonloop",
        recommendation="Strong Follow-On Candidate",
        reasons=["Explosive customer pull", "Regulatory tailwinds", "Tripled ARR QoQ"],
        blockers=["Gross margin degradation needs explanation"],
        required_proof=["Proof that implementation can be automated to restore 70%+ margins"],
        valuation_sensitivity="Can support up to $80M pre-money at Series A",
        ownership_impact="Target maintaining 15% via pro-rata",
        reserve_impact="Will require $4M of allocated $5M reserve",
        next_action="Schedule deep dive on gross margin unit economics before term sheet."
    ),
    "comp-paynest": FollowOnRecommendation(
        company_id="comp-paynest",
        recommendation="Do Not Follow-On Yet",
        reasons=["Runway critical (< 8 months)", "Burn is excessively high compared to growth", "Deteriorating margins"],
        blockers=["Runway below 12mo", "No clear path to profitability"],
        required_proof=["Need to see 30% reduction in burn with sustained revenue"],
        valuation_sensitivity="Likely a down-round or flat-round candidate",
        ownership_impact="Risk of heavy dilution if we don't participate",
        reserve_impact="Do not deploy remaining $5M reserve without drastic turnaround",
        next_action="Call founder to discuss burn reduction plan immediately."
    )
}

MOCK_RESERVE_ALLOCATIONS = {
    "comp-neuraldesk": ReserveAllocationOutput(
        company_id="comp-neuraldesk",
        current_allocation="$3M",
        suggested_allocation="$3M",
        risk_level="Low",
        justification="Performing to plan. Keep standard pro-rata reserve."
    ),
    "comp-carbonloop": ReserveAllocationOutput(
        company_id="comp-carbonloop",
        current_allocation="$5M",
        suggested_allocation="$8M",
        risk_level="Low",
        justification="Fund return potential. Over-allocate reserves to lean into the Series A."
    ),
    "comp-paynest": ReserveAllocationOutput(
        company_id="comp-paynest",
        current_allocation="$5M",
        suggested_allocation="$0M",
        risk_level="High",
        justification="High burn, poor margins. Release reserves for better performing assets."
    )
}

MOCK_VALUE_CREATION = {
    "comp-neuraldesk": ValueCreationRecommendation(
        company_id="comp-neuraldesk",
        recommendation="Introduce NeuralDesk to 5 enterprise workflow buyers.",
        why_it_matters="They have strong enterprise product but need top-of-funnel pipeline for Q3.",
        evidence="Founder update explicit ask for CIO intros; late-stage pipeline is robust but early-stage is thinning.",
        urgency="High",
        owner="Sarah",
        expected_impact="+$1M in new pipeline generation",
        suggested_action="Draft intro email for Sarah's network targeting Fortune 500 IT leads."
    ),
    "comp-vetpulse": ValueCreationRecommendation(
        company_id="comp-vetpulse",
        recommendation="Help VetPulse AI improve clinic adoption playbook.",
        why_it_matters="Deployments are stalled due to legacy integrations, risking cash burn.",
        evidence="Missed deployment target by 40%.",
        urgency="High",
        owner="Platform Team",
        expected_impact="Unblock $500k in contracted ARR waiting for deployment",
        suggested_action="Connect founder with GTM expert from our network who scaled Veeva."
    )
}

MOCK_KPI_TIMESERIES = {
    "comp-neuraldesk": KPITimeSeries(
        company_id="comp-neuraldesk",
        kpis=[
            PortfolioKPI(kpi_name="ARR", category="Revenue", value="$2.1M", period="Q2 2024", source="Founder Update", confidence="High", trend="improving"),
            PortfolioKPI(kpi_name="Burn", category="Financial", value="$400k/mo", period="Q2 2024", source="Founder Update", confidence="High", trend="stable"),
            PortfolioKPI(kpi_name="Runway", category="Financial", value="30 months", period="Q2 2024", source="Founder Update", confidence="High", trend="stable"),
            PortfolioKPI(kpi_name="Enterprise Logos", category="Customers", value="12", period="Q2 2024", source="Board Deck", confidence="High", trend="improving")
        ]
    )
}

def get_mock_company(company_id: str) -> PortfolioCompany:
    return MOCK_PORTFOLIO_COMPANIES.get(company_id)

def get_mock_health(company_id: str) -> PortfolioHealthScore:
    return MOCK_HEALTH_SCORES.get(company_id)

def get_mock_founder_updates(company_id: str) -> list[FounderUpdate]:
    update = MOCK_FOUNDER_UPDATES.get(company_id)
    return [update] if update else []

def get_mock_board_deck_analysis(company_id: str) -> BoardDeckAnalysis:
    return MOCK_BOARD_DECKS.get(company_id)

def get_mock_follow_on_recommendation(company_id: str) -> FollowOnRecommendation:
    return MOCK_FOLLOW_ON_RECOMMENDATIONS.get(company_id)

def get_mock_reserve_allocation(company_id: str) -> ReserveAllocationOutput:
    return MOCK_RESERVE_ALLOCATIONS.get(company_id)

def get_mock_value_creation_plan(company_id: str) -> list[ValueCreationRecommendation]:
    vc = MOCK_VALUE_CREATION.get(company_id)
    return [vc] if vc else []

def get_mock_kpi_timeseries(company_id: str) -> KPITimeSeries:
    return MOCK_KPI_TIMESERIES.get(company_id)
