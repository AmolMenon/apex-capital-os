from deal_war_room_engine.war_room_schemas import *
import datetime
import json

def get_sarvam_mock():
    return DealWarRoom(
        deal_id="6",
        company_name="Sarvam AI",
        war_room_status="completed_with_fallback",
        thesis=InvestmentThesis(
            one_line_thesis="Sarvam AI is building the foundational AI layer for India, capturing the multi-billion dollar enterprise and government shift to vernacular AI.",
            why_now="India is rapidly digitizing and the government has mandated vernacular AI adoption, but global models like GPT-4 perform poorly and expensively on Indic languages.",
            why_this_company="Strongest technical team in India (ex-AI4Bharat) with a massive compute moat (Yotta partnership) and early distribution advantage.",
            why_this_team="Pratyush and Vivek are the preeminent Indian AI researchers who built AI4Bharat, deeply connected with the government.",
            why_this_market="India is the fastest growing digital economy, and enterprise AI penetration is just beginning.",
            why_venture_scale="If Sarvam becomes the 'OpenAI of India', it can capture platform revenue, API revenue, and massive government contracts.",
            evidence_supporting=[
                ThesisPoint(point="Yotta Partnership secures compute", evidence_label="Verified public fact", source_confidence="High", proof_status="Proven"),
                ThesisPoint(point="$41M Series A funding from Lightspeed/PeakXV", evidence_label="Verified public fact", source_confidence="High", proof_status="Proven")
            ],
            assumptions=[
                "Enterprises will pay a premium for Indic language models over fine-tuned open-source models.",
                "Inference costs will be low enough to be profitable at Indian SaaS pricing."
            ],
            private_diligence_required=["Current API usage metrics", "Enterprise POC conversion rates", "Gross margin on inference"]
        ),
        anti_thesis=AntiThesis(
            strongest_case_against="Global frontier models (OpenAI, Gemini) will rapidly improve Indic language support, commoditizing Sarvam's primary moat before they can reach profitability.",
            market_risks=["Indian enterprise willingness to pay is notoriously low.", "Open source models (Llama 3) might be 'good enough' for most use cases."],
            product_risks=["Model performance might not sustainably beat global models."],
            competition_risks=["Krutrim, OpenAI, Google, Meta."],
            economics_risks=["High compute costs vs low API pricing could lead to structurally negative gross margins."],
            fund_fit_risks=["Valuation is already massive ($41M Series A implies a valuation too high for our target ownership)."],
            valuation_risks=["Priced to perfection. Next round will be a massive step up."],
            unknown_private_metrics=["Revenue", "Gross Margin", "Customer Retention"],
            pass_triggers=["If enterprise POCs are churning because Llama 3 is cheaper and sufficient.", "If valuation prevents us from getting meaningful ownership."]
        ),
        what_must_be_true=[
            WhatMustBeTrue(statement="Enterprises require native Indic models.", why_it_matters="Core value proposition.", current_evidence="Government mandates it.", evidence_source="Public statements", confidence="Medium", required_proof=["Customer contracts"], diligence_owner="Analyst", status="Partially Supported"),
            WhatMustBeTrue(statement="Unit economics are viable.", why_it_matters="AI infrastructure is capital intensive.", current_evidence="Unknown", evidence_source="N/A", confidence="Low", required_proof=["Compute cost vs API price"], diligence_owner="Partner", status="Unknown")
        ],
        partner_personas=[
            PartnerPersona(name="Growth Lead", focus_area="Market size and power law", support_level="Support", view_of_deal="This is a category creator. We must be in it.", top_questions=[PartnerQuestion(question="Can they expand beyond India?", reason="To justify a $10B+ outcome")], evidence_needed=["Global ambition"], likely_vote="Invest", what_would_change_view="If they are capped at Indian market size."),
            PartnerPersona(name="Skeptic", focus_area="Valuation and competition", support_level="Lean Against", view_of_deal="Great team, but we're paying a huge premium for a moat that OpenAI will close in 12 months.", top_questions=[PartnerQuestion(question="Why won't OpenAI just beat them on Hindi?", reason="OpenAI has 100x the compute")], evidence_needed=["Defensible moat against OpenAI"], likely_vote="Pass", what_would_change_view="If their proprietary data provides an unbridgeable moat.")
        ],
        ic_simulation=ICSimulation(
            analyst_opening="Sarvam AI is the leading Indic AI foundational model company.",
            bull_case="They have the best team, government backing, and $41M to secure compute.",
            bear_case="Valuation is too high and OpenAI will commoditize them.",
            partner_debate=["Growth Lead: We can't miss the OpenAI of India.", "Skeptic: We can if we buy at $200M and they get crushed by Llama."],
            fund_math_discussion="We need to write a $5M check to even matter here.",
            evidence_gaps="We have no idea what their revenue or margins are.",
            partner_votes=[PartnerVote(partner_name="Growth Lead", vote="Invest", rationale="Power law potential"), PartnerVote(partner_name="Skeptic", vote="More Diligence", rationale="Need to see margins")],
            ic_chair_summary="Fascinating company, incredible team, but we need private metrics before writing a check at this valuation.",
            required_diligence=["Get data room", "See API usage", "Talk to 3 enterprise customers"],
            committee_decision="Benchmark only"
        ),
        conviction_score=ConvictionScore(
            overall_score=65,
            conviction_level="High Interest, Low Evidence",
            market_conviction=90,
            team_conviction=95,
            product_conviction=70,
            traction_conviction=40,
            evidence_conviction=50,
            fund_fit_conviction=40,
            valuation_conviction=30,
            diligence_completeness=45,
            red_team_severity="High",
            source_confidence="High (Public)",
            drivers=["Incredible founders", "Massive market tailwind", "Tier-1 co-investors"],
            detractors=["High valuation", "Missing private metrics", "Global competition risk"],
            deltas=[ConvictionDelta(driver="Funding News", impact="Increased", reason="Tier-1 validation"), ConvictionDelta(driver="Red Team", impact="Decreased", reason="OpenAI commoditization risk")]
        ),
        valuation_sensitivity=ValuationSensitivity(
            latest_known_valuation="~$150M - $200M (Estimated)",
            assumed_entry_valuation=200000000,
            cheque_size=2000000,
            target_ownership=1.0,
            required_exit_value=2000000000,
            dilution_assumptions="Assume 25% dilution before exit",
            scenarios=[
                ValuationScenario(scenario_name="Conservative", entry_valuation=200000000, exit_valuation=500000000, ownership_at_entry=1.0, ownership_at_exit=0.75, fund_return=3750000, fund_multiple_contribution=0.075, notes="Poor return for the risk"),
                ValuationScenario(scenario_name="Power Law", entry_valuation=200000000, exit_valuation=5000000000, ownership_at_entry=1.0, ownership_at_exit=0.75, fund_return=37500000, fund_multiple_contribution=0.75, notes="Requires them to become a decacorn to return the fund")
            ],
            warnings=["At $200M+, our $2M check only buys 1%. We are a price-taker here."]
        ),
        ownership_scenarios=[
            OwnershipScenario(
                fund_size=50000000,
                target_ownership=5.0,
                cheque_size=2000000,
                entry_valuation=200000000,
                stage="Series A",
                reserve_ratio=1.0,
                expected_dilution=0.25,
                ownership_feasibility="Infeasible",
                initial_ownership=1.0,
                pro_rata_requirement=1000000,
                follow_on_reserve_needed=2000000,
                expected_exit_ownership=0.75,
                warnings=["Our target ownership is 5%, but we can only afford 1% at this valuation."]
            )
        ],
        fund_return_scenarios=[
            FundReturnScenario(
                fund_size=50000000,
                entry_ownership=1.0,
                exit_ownership=0.75,
                exit_valuation=1000000000,
                capital_invested=2000000,
                exit_proceeds=7500000,
                gross_multiple=3.75,
                percentage_of_fund_returned=15.0,
                can_return_1x_fund=False,
                required_exit_for_1x=6600000000,
                required_ownership_for_1x=5.0
            )
        ],
        change_our_mind=[
            ChangeOurMindCondition(condition_type="Upgrade", condition="OpenAI fails to handle Indic languages well", evidence_needed="Benchmarks comparing Sarvam to GPT-4o on Hindi/Tamil", current_status="Unknown", decision_impact="Massive", owner="Technical Partner", priority="High")
        ],
        decision_gates=[
            DecisionGate(gate_name="Fund Fit", passed=False, reason="Valuation is too high for our fund size.")
        ],
        final_recommendation=WarRoomFinalRecommendation(
            recommendation="Benchmark only",
            rationale="Exceptional company, but outside our mandate for ownership and entry valuation. Treat as a benchmark for what a tier-1 AI infrastructure deal looks like.",
            next_action="Track progress"
        ),
        metadata=WarRoomMetadata(
            generated_at=datetime.datetime.utcnow().isoformat(),
            mode="mock",
            deal_type="real_benchmark",
            models_used=["mock_fallback"]
        )
    )

def get_default_mock(company_name: str, deal_id: str, deal=None):
    profile = {}
    sector = "software"
    desc = f"{company_name} is a compelling opportunity in a growing market."
    if deal and deal.public_profile_json:
        try:
            profile = json.loads(deal.public_profile_json)
            sector = profile.get('sector', 'software')
            desc = profile.get('description', desc)
        except:
            pass

    # A generic fallback
    return DealWarRoom(
        deal_id=deal_id,
        company_name=company_name,
        war_room_status="completed_with_fallback",
        thesis=InvestmentThesis(
            one_line_thesis=f"{company_name} is well-positioned to disrupt the {sector} market.",
            why_now=f"The {sector} market is experiencing secular tailwinds and rapid digitization.",
            why_this_company=desc,
            why_this_team="Relevant domain expertise in " + sector,
            why_this_market=f"Large TAM for {sector}.",
            why_venture_scale=f"Potential for venture margins at scale in {sector}.",
            evidence_supporting=[],
            assumptions=[f"{sector} market continues to grow.", "Team executes well."],
            private_diligence_required=["Financials", "Customer retention", "CAC"]
        ),
        anti_thesis=AntiThesis(
            strongest_case_against="Competition from incumbents could erode margins before profitability.",
            market_risks=[f"Market adoption of {sector} products is slower than expected."],
            product_risks=["Product lacks deep technical moat.", "Churn risk."],
            competition_risks=["Incumbents build similar features."],
            economics_risks=["High CAC in " + sector],
            fund_fit_risks=["Valuation may be too high for our target ownership."],
            valuation_risks=["Priced for perfection."],
            unknown_private_metrics=["Churn", "LTV", "CAC Payback"],
            pass_triggers=["If churn is > 20%.", "If valuation implies <5% ownership."]
        ),
        what_must_be_true=[
            WhatMustBeTrue(statement="Customer acquisition cost remains viable.", why_it_matters="Needed for profitability.", current_evidence="Unknown", evidence_source="N/A", confidence="Low", required_proof=["Unit economics data"], diligence_owner="Analyst", status="Unknown"),
            WhatMustBeTrue(statement=f"Core technology in {sector} scales.", why_it_matters="Essential for enterprise adoption.", current_evidence="Some early POCs.", evidence_source="Founders", confidence="Medium", required_proof=["Load testing"], diligence_owner="Partner", status="Partially Supported")
        ],
        partner_personas=[
            PartnerPersona(
                name="The Skeptic", 
                focus_area="Unit Economics", 
                support_level="Lean Against", 
                view_of_deal="Valuation is too high for the traction.", 
                top_questions=[PartnerQuestion(question="What is the real churn rate?", reason="Crucial for SaaS metrics.")], 
                evidence_needed=["Actual cohorts data"], 
                likely_vote="Pass", 
                what_would_change_view="Proof of negative net churn."
            ),
            PartnerPersona(
                name="The Visionary", 
                focus_area="Market TAM", 
                support_level="Support", 
                view_of_deal="Massive TAM and strong founders.", 
                top_questions=[PartnerQuestion(question="Can they expand horizontally?", reason="Need a path to $10B.")], 
                evidence_needed=["Clear product roadmap"], 
                likely_vote="Invest", 
                what_would_change_view="Inability to hire strong engineers."
            )
        ],
        ic_simulation=ICSimulation(
            analyst_opening=f"{company_name} is an interesting deal.",
            bull_case="Huge market.",
            bear_case="Lots of competition.",
            partner_debate=["Partner A: I like the team.", "Partner B: Valuation is rich."],
            fund_math_discussion="Needs a $1B exit.",
            evidence_gaps="Missing data room.",
            partner_votes=[PartnerVote(partner_name="Growth Lead", vote="Invest", rationale="Power law potential"), PartnerVote(partner_name="Skeptic", vote="More Diligence", rationale="Need to see margins")],
            ic_chair_summary="Hold for more data.",
            required_diligence=["Get data room"],
            committee_decision="Hold for more data"
        ),
        conviction_score=ConvictionScore(
            overall_score=50,
            conviction_level="Low Conviction",
            market_conviction=50,
            team_conviction=50,
            product_conviction=50,
            traction_conviction=50,
            evidence_conviction=50,
            fund_fit_conviction=50,
            valuation_conviction=50,
            diligence_completeness=10,
            red_team_severity="Medium",
            source_confidence="Low",
            drivers=[],
            detractors=["Missing data"],
            deltas=[]
        ),
        valuation_sensitivity=ValuationSensitivity(
            latest_known_valuation="Unknown",
            assumed_entry_valuation=20000000,
            cheque_size=1000000,
            target_ownership=5.0,
            required_exit_value=500000000,
            dilution_assumptions="20%",
            scenarios=[],
            warnings=[]
        ),
        ownership_scenarios=[
            OwnershipScenario(
                fund_size=50000000,
                target_ownership=10.0,
                cheque_size=2000000,
                entry_valuation=20000000,
                stage="Seed",
                reserve_ratio=1.0,
                expected_dilution=0.20,
                ownership_feasibility="Feasible",
                initial_ownership=10.0,
                pro_rata_requirement=1000000,
                follow_on_reserve_needed=2000000,
                expected_exit_ownership=8.0,
                warnings=["Need to ensure pro-rata rights."]
            )
        ],
        fund_return_scenarios=[
            FundReturnScenario(
                fund_size=50000000,
                entry_ownership=10.0,
                exit_ownership=8.0,
                exit_valuation=1000000000,
                capital_invested=2000000,
                exit_proceeds=80000000,
                gross_multiple=40.0,
                percentage_of_fund_returned=160.0,
                can_return_1x_fund=True,
                required_exit_for_1x=625000000,
                required_ownership_for_1x=8.0
            )
        ],
        change_our_mind=[
            ChangeOurMindCondition(condition_type="Downgrade", condition="Competitor raises massive round", evidence_needed="Press release", current_status="Unknown", decision_impact="High", owner="Partner", priority="High")
        ],
        decision_gates=[
            DecisionGate(gate_name="Traction", passed=False, reason="Need $1M ARR.")
        ],
        final_recommendation=WarRoomFinalRecommendation(
            recommendation="Hold for more data",
            rationale="Not enough private data to make a decision.",
            next_action="Request data room"
        ),
        metadata=WarRoomMetadata(
            generated_at=datetime.datetime.utcnow().isoformat(),
            mode="mock",
            deal_type="user",
            models_used=["mock_fallback"]
        )
    )

