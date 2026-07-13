from deal_war_room_engine.war_room_schemas import *
import datetime

def get_bharatvector_mock(deal_id: str):
    return DealWarRoom(
        deal_id=deal_id,
        company_name="BharatVector AI",
        war_room_status="completed_with_fallback",
        thesis=InvestmentThesis(
            one_line_thesis="BharatVector AI is building the foundational AI infrastructure for India's 1B+ non-English speakers, capturing the massive regional enterprise AI market.",
            why_now="Indian enterprises are mandated to adopt AI, but global models like GPT-4 are too expensive and perform poorly on Indic languages.",
            why_this_company="The founding team consists of ex-Google researchers who previously built the underlying architecture for Indic language models.",
            why_this_team="Deep technical pedigree combined with early enterprise distribution advantage.",
            why_this_market="India's enterprise AI market is growing at 45% CAGR, demanding sovereign models.",
            why_venture_scale="If successful, they become the 'OpenAI of India' with massive platform and API revenue potential.",
            evidence_supporting=[
                ThesisPoint(point="Ex-Google AI founders", evidence_label="Verified public fact", source_confidence="High", proof_status="Proven"),
                ThesisPoint(point="Models outperform Llama 3 on Indic benchmarks", evidence_label="Company Claim", source_confidence="Medium", proof_status="Needs Proof")
            ],
            assumptions=[
                "Enterprises will pay a premium for localized models.",
                "Compute and inference costs can be optimized to achieve SaaS-like margins."
            ],
            private_diligence_required=["Verify 3 Enterprise Pilots", "Inference Cost Breakdown", "Actual Revenue/ARR"]
        ),
        anti_thesis=AntiThesis(
            strongest_case_against="Global frontier models (OpenAI, Gemini) or Open Source (Llama 3) will commoditize Indic language support before BharatVector reaches sustainable scale.",
            market_risks=["Indian enterprise willingness to pay for software is historically low."],
            product_risks=["Model performance might not sustainably beat global models as they consume more multilingual data."],
            competition_risks=["OpenAI, Google, Meta, Krutrim."],
            economics_risks=["Structurally negative gross margins due to high compute costs vs low pricing power in India."],
            fund_fit_risks=["Valuation expectations ($40M Cap) might be too high for a pre-revenue seed round."],
            valuation_risks=["Priced for perfection at Seed."],
            unknown_private_metrics=["Current ARR", "Gross Margin & Compute Costs"],
            pass_triggers=["If the 3 pilots are unpaid and unwilling to convert.", "If inference costs exceed projected API pricing."]
        ),
        what_must_be_true=[
            WhatMustBeTrue(statement="Enterprises require native Indic models over translated English models.", why_it_matters="Core value proposition and defensibility.", current_evidence="Founders claim pilots prove this.", evidence_source="Pitch Deck", confidence="Low", required_proof=["Customer Calls"], diligence_owner="Sourcing Partner", status="Unknown"),
            WhatMustBeTrue(statement="Unit economics (Inference vs Price) are viable.", why_it_matters="AI infrastructure is capital intensive.", current_evidence="Unknown", evidence_source="N/A", confidence="Low", required_proof=["Cost Breakdown"], diligence_owner="Technical Partner", status="Unknown")
        ],
        partner_personas=[
            PartnerPersona(
                name="Sourcing Partner", 
                focus_area="Market & Narrative", 
                support_level="Support", 
                view_of_deal="This is a category creator with elite founders. We cannot afford to miss the 'OpenAI of India' thesis.", 
                top_questions=[PartnerQuestion(question="How quickly can we close the deal?", reason="Highly competitive round.")], 
                evidence_needed=["Commitment from founders on valuation."], 
                likely_vote="Invest", 
                what_would_change_view="If founders demand >$50M cap."
            ),
            PartnerPersona(
                name="Managing Partner", 
                focus_area="Fund Math & Returns", 
                support_level="Lean Against", 
                view_of_deal="At a $40M cap for a $2M check, we only get 5%. They need to become a $1B+ company just to return 1x of our fund.", 
                top_questions=[PartnerQuestion(question="Can we negotiate a $25M cap?", reason="To hit our 10% target ownership.")], 
                evidence_needed=["Founders willing to lower cap"], 
                likely_vote="Pass", 
                what_would_change_view="If we can secure 10% ownership or syndicate the round."
            ),
            PartnerPersona(
                name="Technical Partner", 
                focus_area="AI Moat & Compute", 
                support_level="Neutral", 
                view_of_deal="Team is strong, but building a foundational model from scratch requires hundreds of millions. I need to know their exact compute strategy.", 
                top_questions=[PartnerQuestion(question="What is the exact inference cost per 1k tokens?", reason="To verify gross margin claims.")], 
                evidence_needed=["Technical Deep Dive on Architecture"], 
                likely_vote="More Diligence", 
                what_would_change_view="If they have a proprietary architectural breakthrough that reduces compute."
            ),
            PartnerPersona(
                name="Diligence Agent", 
                focus_area="Fact Verification", 
                support_level="Lean Against", 
                view_of_deal="Too many missing facts. We have zero visibility into actual revenue or pilot conversion.", 
                top_questions=[PartnerQuestion(question="Are the 3 enterprise pilots paying?", reason="To validate commercial traction.")], 
                evidence_needed=["Contracts from the 3 pilots", "Current ARR figures"], 
                likely_vote="More Diligence", 
                what_would_change_view="Proof that pilots are paid and expanding."
            )
        ],
        ic_simulation=ICSimulation(
            analyst_opening="BharatVector AI is building foundational models for Indian languages. The team is ex-Google, but they are pre-revenue asking for a $40M cap.",
            bull_case="They have the best technical team for Indic NLP and a massive untapped enterprise market.",
            bear_case="Valuation is too high for a pre-revenue company, and OpenAI will likely commoditize Indic languages soon.",
            partner_debate=[
                "Sourcing Partner: We have to be in this. It's the most consensus AI deal in India right now.", 
                "Technical Partner: I agree the team is elite, but I need to see their architecture. Can they actually beat Llama 3 efficiently?",
                "Diligence Agent: We don't even know if their 3 pilots are paying. I'm flagging this as high risk.",
                "Managing Partner: If we invest $2M at a $40M cap, the fund math doesn't work unless they become a decacorn."
            ],
            fund_math_discussion="At a $40M cap, our $2M check buys 5%. We need a $1B exit to return $50M (1x our fund). That's a huge hurdle for Seed.",
            evidence_gaps="Missing revenue, missing cost breakdown, missing valuation confirmation.",
            partner_votes=[
                PartnerVote(partner_name="Sourcing Partner", vote="Invest", rationale="Power law potential & FOMO"), 
                PartnerVote(partner_name="Managing Partner", vote="Pass", rationale="Valuation too high, fund math breaks"),
                PartnerVote(partner_name="Technical Partner", vote="More Diligence", rationale="Need technical deep dive"),
                PartnerVote(partner_name="Diligence Agent", vote="More Diligence", rationale="Need commercial validation")
            ],
            ic_chair_summary="Fascinating team and market, but the current valuation and lack of commercial evidence make this un-investable today. We need a deep dive on tech and pilots.",
            required_diligence=["Verify Pilot Revenue", "Technical Deep Dive on Compute Costs", "Negotiate Valuation Cap"],
            committee_decision="More Diligence Required"
        ),
        conviction_score=ConvictionScore(
            overall_score=55,
            conviction_level="Mixed Conviction",
            market_conviction=85,
            team_conviction=95,
            product_conviction=70,
            traction_conviction=30,
            evidence_conviction=40,
            fund_fit_conviction=30,
            valuation_conviction=25,
            diligence_completeness=35,
            red_team_severity="High",
            source_confidence="Medium",
            drivers=["Elite Founders", "Massive Market Tailwinds"],
            detractors=["High Valuation Cap", "Unverified Commercials", "Global AI Competition"],
            deltas=[ConvictionDelta(driver="Founding Team", impact="Increased", reason="Ex-Google NLP pedigree"), ConvictionDelta(driver="Diligence Agent", impact="Decreased", reason="Missing revenue data")]
        ),
        valuation_sensitivity=ValuationSensitivity(
            latest_known_valuation="~$40M Cap (Expected)",
            assumed_entry_valuation=40000000,
            cheque_size=2000000,
            target_ownership=10.0,
            required_exit_value=1000000000,
            dilution_assumptions="Assume 25% dilution before exit",
            scenarios=[
                ValuationScenario(scenario_name="Conservative Exit", entry_valuation=40000000, exit_valuation=200000000, ownership_at_entry=0.05, ownership_at_exit=0.0375, fund_return=7500000, fund_multiple_contribution=0.15, notes="Decent outcome, but doesn't return the fund"),
                ValuationScenario(scenario_name="Fund Returner", entry_valuation=40000000, exit_valuation=1330000000, ownership_at_entry=0.05, ownership_at_exit=0.0375, fund_return=50000000, fund_multiple_contribution=1.0, notes="Requires a $1.3B+ exit to return a $50M fund.")
            ],
            warnings=["Our $2M check only buys 5% at a $40M cap. We fall short of our 10% ownership target."]
        ),
        ownership_scenarios=[
            OwnershipScenario(
                fund_size=50000000,
                target_ownership=10.0,
                cheque_size=2000000,
                entry_valuation=40000000,
                stage="Seed",
                reserve_ratio=1.0,
                expected_dilution=0.25,
                ownership_feasibility="Infeasible",
                initial_ownership=5.0,
                pro_rata_requirement=1000000,
                follow_on_reserve_needed=2000000,
                expected_exit_ownership=3.75,
                warnings=["Target ownership of 10% is unachievable without increasing check size to $4M or lowering valuation to $20M."]
            )
        ],
        fund_return_scenarios=[
            FundReturnScenario(
                fund_size=50000000,
                entry_ownership=5.0,
                exit_ownership=3.75,
                exit_valuation=1000000000,
                capital_invested=2000000,
                exit_proceeds=37500000,
                gross_multiple=18.75,
                percentage_of_fund_returned=75.0,
                can_return_1x_fund=False,
                required_exit_for_1x=1333333333,
                required_ownership_for_1x=10.0
            )
        ],
        change_our_mind=[
            ChangeOurMindCondition(condition_type="Upgrade", condition="Founders accept a $25M Valuation Cap", evidence_needed="Term Sheet Negotiation", current_status="Pending", decision_impact="Massive", owner="Managing Partner", priority="High"),
            ChangeOurMindCondition(condition_type="Upgrade", condition="Pilots convert to $1M+ ARR contracts", evidence_needed="Signed Contracts", current_status="Pending", decision_impact="Massive", owner="Diligence Agent", priority="High")
        ],
        decision_gates=[
            DecisionGate(gate_name="Fund Fit - Ownership", passed=False, reason="Projected ownership of 5% is below 10% target."),
            DecisionGate(gate_name="Traction Verification", passed=False, reason="Missing data on pilot conversions.")
        ],
        final_recommendation=WarRoomFinalRecommendation(
            recommendation="Diligence Required",
            rationale="The team and market are phenomenal, but we cannot invest blindly at a $40M cap without validating commercial traction and technical defensibility. Let's dig deeper.",
            next_action="Request Data Room & Technical Deep Dive"
        ),
        metadata=WarRoomMetadata(
            generated_at=datetime.datetime.utcnow().isoformat(),
            mode="mock",
            deal_type="flagship_demo",
            models_used=["mock_fallback"]
        )
    )
