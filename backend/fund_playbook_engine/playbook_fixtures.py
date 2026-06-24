from .playbook_schemas import *

DEFAULT_PLAYBOOKS = [
    FundPlaybook(
        playbook_id="apex_default",
        playbook_name="Apex Default Early-Stage Playbook",
        playbook_type="demo",
        fund_archetype="early_stage",
        investment_philosophy=InvestmentPhilosophy(
            founder_market_fit_importance="High",
            market_size_threshold="$1B+",
            capital_efficiency_preference="Medium",
            technical_risk_tolerance="Medium",
            regulatory_risk_tolerance="Low",
            valuation_sensitivity="Medium"
        ),
        stage_strategies=[
            StageStrategy(
                stage_name="Seed",
                focus_metrics=["early traction", "product wedge"],
                acceptable_evidence_uncertainty="High",
                ownership_target="15-20%",
                required_data_room_items=["Deck", "Cap Table"]
            )
        ],
        sector_playbooks=[
            SectorPlaybook(
                sector_name="AI Applications",
                focus_areas=["workflow depth", "retention"],
                required_diligence_questions=["What is the data moat?"],
                key_risks=["Model commoditization", "Distribution wedge"],
                scoring_weight_adjustments={"product_weight": 1.5}
            )
        ],
        decision_gates=DecisionGateConfig(
            min_evidence_score_for_ic=60,
            min_data_room_completeness=50,
            required_cap_table_presence=False,
            required_customer_references=False,
            required_retention_data=False,
            required_gross_margin_data=False,
            maximum_unresolved_critical_blockers=2,
            ownership_feasibility_threshold=10.0
        ),
        memo_template=MemoTemplateConfig(
            required_sections=["Company Snapshot", "Thesis", "Market"],
            optional_sections=["Risks"],
            custom_instructions="Be concise."
        ),
        ic_process=ICProcessConfig(
            review_stages=2,
            partner_review_required=True,
            red_team_required=False,
            war_room_required=True,
            ic_simulation_required=False,
            minimum_safe_to_share_status="review_completed"
        ),
        partner_preferences=[
            PartnerPreference(
                role_name="Market Partner",
                focus_areas=["TAM", "Competition"],
                preferred_evidence=["Market maps", "Competitor pricing"],
                common_objections=["Market too small", "Too much competition"],
                decision_style="Analytical"
            )
        ],
        scoring_profile=ScoringProfile(
            market_weight=1.0,
            founder_weight=1.2,
            product_weight=1.0,
            traction_weight=0.8,
            financial_quality_weight=0.5,
            evidence_quality_weight=1.0
        ),
        metadata={"created_by": "System"}
    ),
    FundPlaybook(
        playbook_id="evidence_heavy",
        playbook_name="Evidence-Heavy Institutional Playbook",
        playbook_type="demo",
        fund_archetype="growth",
        investment_philosophy=InvestmentPhilosophy(
            founder_market_fit_importance="Medium",
            market_size_threshold="$5B+",
            capital_efficiency_preference="High",
            technical_risk_tolerance="Low",
            regulatory_risk_tolerance="Low",
            valuation_sensitivity="High"
        ),
        stage_strategies=[
            StageStrategy(
                stage_name="Series A",
                focus_metrics=["revenue quality", "retention", "margins"],
                acceptable_evidence_uncertainty="Low",
                ownership_target="15-20%",
                required_data_room_items=["Financial Model", "Cohort Data", "Audited Financials"]
            )
        ],
        sector_playbooks=[],
        decision_gates=DecisionGateConfig(
            min_evidence_score_for_ic=85,
            min_data_room_completeness=90,
            required_cap_table_presence=True,
            required_customer_references=True,
            required_retention_data=True,
            required_gross_margin_data=True,
            maximum_unresolved_critical_blockers=0,
            ownership_feasibility_threshold=15.0
        ),
        memo_template=MemoTemplateConfig(
            required_sections=["Company Snapshot", "Thesis", "Market", "Financials", "Unit Economics"],
            optional_sections=[],
            custom_instructions="Focus heavily on metrics and downside protection."
        ),
        ic_process=ICProcessConfig(
            review_stages=4,
            partner_review_required=True,
            red_team_required=True,
            war_room_required=True,
            ic_simulation_required=True,
            minimum_safe_to_share_status="verified"
        ),
        partner_preferences=[
            PartnerPreference(
                role_name="Risk Partner",
                focus_areas=["Downside protection", "Unit economics"],
                preferred_evidence=["Audited financials", "Customer contracts"],
                common_objections=["Unit economics don't scale", "Customer churn is hidden"],
                decision_style="Skeptical"
            )
        ],
        scoring_profile=ScoringProfile(
            market_weight=1.0,
            founder_weight=1.0,
            product_weight=1.0,
            traction_weight=1.5,
            financial_quality_weight=2.0,
            evidence_quality_weight=2.0
        ),
        metadata={"created_by": "System"}
    ),
    FundPlaybook(
        playbook_id="ai_native",
        playbook_name="AI-Native Fund Playbook",
        playbook_type="demo",
        fund_archetype="early_stage",
        investment_philosophy=InvestmentPhilosophy(
            founder_market_fit_importance="High",
            market_size_threshold="$1B+",
            capital_efficiency_preference="Low",
            technical_risk_tolerance="High",
            regulatory_risk_tolerance="Medium",
            valuation_sensitivity="Low"
        ),
        stage_strategies=[
            StageStrategy(
                stage_name="Seed",
                focus_metrics=["product velocity", "model defensibility"],
                acceptable_evidence_uncertainty="High",
                ownership_target="10-15%",
                required_data_room_items=["Architecture Diagram"]
            )
        ],
        sector_playbooks=[
            SectorPlaybook(
                sector_name="AI Infrastructure",
                focus_areas=["compute economics", "model defensibility", "open-source risk"],
                required_diligence_questions=["What happens if OpenAI drops prices by 10x?"],
                key_risks=["Model commoditization"],
                scoring_weight_adjustments={"product_weight": 2.0}
            )
        ],
        decision_gates=DecisionGateConfig(
            min_evidence_score_for_ic=50,
            min_data_room_completeness=40,
            required_cap_table_presence=False,
            required_customer_references=False,
            required_retention_data=False,
            required_gross_margin_data=False,
            maximum_unresolved_critical_blockers=1,
            ownership_feasibility_threshold=5.0
        ),
        memo_template=MemoTemplateConfig(
            required_sections=["Company Snapshot", "Thesis", "Data Moat", "AI Defensibility"],
            optional_sections=[],
            custom_instructions="Focus on workflow depth and distribution wedge."
        ),
        ic_process=ICProcessConfig(
            review_stages=2,
            partner_review_required=True,
            red_team_required=False,
            war_room_required=True,
            ic_simulation_required=False,
            minimum_safe_to_share_status="review_completed"
        ),
        partner_preferences=[
            PartnerPreference(
                role_name="Technical Partner",
                focus_areas=["Architecture", "Model efficiency"],
                preferred_evidence=["Benchmarks", "GitHub repos"],
                common_objections=["Wrapper risk", "No data moat"],
                decision_style="Technical"
            )
        ],
        scoring_profile=ScoringProfile(
            market_weight=1.0,
            founder_weight=1.5,
            product_weight=2.0,
            traction_weight=0.5,
            financial_quality_weight=0.5,
            evidence_quality_weight=0.8
        ),
        metadata={"created_by": "System"}
    )
]
