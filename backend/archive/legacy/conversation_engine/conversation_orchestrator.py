import json
import logging
import asyncio
from typing import Dict, Any, List

from conversation_engine.conversation_schemas import (
    ConversationIntelligenceOutput,
    ConversationRoundOutput,
    ConversationMessageOutput,
    FounderResponseAnalysisOutput,
    InvestorQuestionOutput,
    ExtractedEvidenceOutput,
    ContradictionOutput,
    FollowupItemOutput,
    ConversationScorecardOutput,
    ConversationDecisionImpactOutput
)

logger = logging.getLogger(__name__)

class ConversationOrchestrator:
    """
    Simulates the complex LLM analysis of a founder-investor transcript.
    In real mode, this would route chunks of transcripts to Claude 3.5 / Gemini 1.5 Pro
    using the AIProviderRouter to populate the schemas.
    """
    def __init__(self, ai_router=None):
        self.ai_router = ai_router

    async def analyze_transcript(self, deal_id: str, company_name: str, raw_text: str, round_title: str) -> ConversationRoundOutput:
        # Mocking the transcript parsing
        await asyncio.sleep(0.5)
        parsed_messages = [
            ConversationMessageOutput(
                speaker="Investor", role="Investor", message_text="Can you clarify your ARR?", detected_topic="Revenue"
            ),
            ConversationMessageOutput(
                speaker="Founder", role="Founder", message_text="We are currently at ₹42L ARR and growing 31% month-on-month.", detected_topic="Revenue", linked_claim="ARR Scale"
            )
        ]
        
        return ConversationRoundOutput(
            round_id="mock_round_1",
            title=round_title,
            conversation_type="Intro Call",
            date="2024-06-15",
            participants=["Investor", "Founder"],
            raw_text=raw_text,
            parsed_messages=parsed_messages,
            round_score=85,
            key_signal="Strong revenue recall but needs evidence."
        )

    async def generate_intelligence(self, deal_id: str, company_name: str, rounds: List[ConversationRoundOutput]) -> ConversationIntelligenceOutput:
        """
        Synthesizes multiple rounds of conversation into the final ConversationIntelligenceOutput.
        """
        await asyncio.sleep(1.0)
        
        # Hardcoded NeuralDesk Mock
        if company_name == "NeuralDesk" or deal_id in ["1", "deal-1"]:
            return self._mock_neuraldesk_intelligence(deal_id)
            
        # Hardcoded VetPulse AI Mock
        if company_name == "VetPulse AI" or deal_id in ["2", "deal-2"]:
            return self._mock_vetpulse_intelligence(deal_id)

        # Generic Mock for others
        return self._mock_generic_intelligence(deal_id, company_name)


    def _mock_neuraldesk_intelligence(self, deal_id: str) -> ConversationIntelligenceOutput:
        return ConversationIntelligenceOutput(
            deal_id=str(deal_id),
            company_name="NeuralDesk",
            founder_response_quality_score=82,
            clarity_score=88,
            responsiveness_score=90,
            credibility_score=85,
            evidence_provided_score=70,
            contradiction_risk_score=40,
            overall_conversation_score=81,
            summary="Founder responses were highly specific on customer acquisition and product roadmap, but ARR quality requires clarification because later discussion separated contracted revenue from pilot revenue.",
            recommendation_adjustment="No Change",
            
            scorecard=ConversationScorecardOutput(
                directness=85,
                specificity=90,
                evidence_quality=70,
                clarity=88,
                responsiveness=90,
                credibility=85,
                consistency=75,
                investor_readiness=82
            ),
            
            founder_analysis=FounderResponseAnalysisOutput(
                strongest_answers=["GTM strategy", "Technical differentiation"],
                weakest_answers=["Retention cohort data"],
                evasive_answers=["Why will incumbents not copy this (partial evasion)"],
                honest_uncertainty=["Exact churn rate after month 12"],
                data_backed_answers=["Outbound SDR metrics"],
                vague_claims=["Most early customers came from founder network"]
            ),
            
            investor_questions=[
                InvestorQuestionOutput(
                    question_text="Is ₹42L ARR fully contracted?",
                    category="Revenue",
                    importance="High",
                    answered_status="Partial",
                    answer_quality="Strong",
                    linked_answer="₹30L ARR is contracted, ₹12L is pilot-stage.",
                    followup_required=True
                ),
                InvestorQuestionOutput(
                    question_text="What is your retention data?",
                    category="Retention",
                    importance="Critical",
                    answered_status="Partial",
                    answer_quality="Evasive",
                    linked_answer="6-month logo retention is 86%, but cohort data is still being cleaned.",
                    followup_required=True
                )
            ],
            
            positive_signals=[
                "Honest revenue breakdown (Contracted vs Pilot)",
                "Fast follow-up on product roadmap questions",
                "Deep technical understanding of customer friction"
            ],
            negative_signals=[
                "ARR headline in deck was blended, not fully contracted",
                "Retention cohort data is still missing"
            ],
            
            contradictions=[
                ContradictionOutput(
                    id="c1",
                    contradiction_title="ARR Quality Mismatch",
                    source_A="Pitch Deck claims ₹42L ARR",
                    source_B="Diligence Call admits ₹12L of that is pilot revenue",
                    severity="High",
                    why_it_matters="Changes the actual baseline valuation and retention risk.",
                    decision_impact="Downgrade confidence",
                    followup_question="When do the pilots convert to contracted ARR?",
                    recommended_diligence_action="Request individual pilot conversion contracts."
                )
            ],
            
            evidence_extracted=[
                ExtractedEvidenceOutput(
                    id="e1",
                    evidence_text="5 recent customers came from outbound cold email",
                    evidence_type="GTM Pipeline",
                    source_conversation="Partner Q&A",
                    speaker="Founder",
                    confidence="High",
                    supports_or_weakens="Supports",
                    linked_claim="Scalable Sales Motion",
                    verification_status="Needs verification"
                )
            ],
            
            open_followups=[
                FollowupItemOutput(
                    id="f1",
                    followup_item="Share retention cohort data",
                    requested_by="Investor",
                    promised_by="Founder",
                    due_date="End of Week",
                    status="Open",
                    linked_risk="Churn Risk",
                    importance="Critical",
                    impact_if_unresolved="Blocks IC Readiness"
                )
            ],
            
            decision_impact=ConversationDecisionImpactOutput(
                recommendation_adjustment="No Change",
                evidence_score_impact="Increase (Honest breakdown)",
                ic_readiness_impact="Decrease (Waiting on Cohort Data)",
                confidence_impact="Decrease (Due to Pilot ARR mix)",
                decision_gates_triggered=["IC Blocked by Open Follow-up"],
                final_explanation="Founder is highly credible and intellectually honest, but the discrepancy in ARR quality means we cannot proceed to IC until the pilot conversion risk and cohort data are resolved."
            )
        )

    def _mock_vetpulse_intelligence(self, deal_id: str) -> ConversationIntelligenceOutput:
        return ConversationIntelligenceOutput(
            deal_id=str(deal_id),
            company_name="VetPulse AI",
            founder_response_quality_score=75,
            clarity_score=80,
            responsiveness_score=85,
            credibility_score=82,
            evidence_provided_score=60,
            contradiction_risk_score=65,
            overall_conversation_score=72,
            summary="Founder is transparent about friction, revealing that onboarding takes 2-3 sessions per clinic. This validates a major risk that the business model is highly services-heavy.",
            recommendation_adjustment="Downgrade",
            
            scorecard=ConversationScorecardOutput(
                directness=80,
                specificity=75,
                evidence_quality=60,
                clarity=80,
                responsiveness=85,
                credibility=82,
                consistency=70,
                investor_readiness=75
            ),
            
            founder_analysis=FounderResponseAnalysisOutput(
                strongest_answers=["Clinical workflow integration", "Current customer pain points"],
                weakest_answers=["Willingness to pay SaaS fees", "Retention data"],
                evasive_answers=[],
                honest_uncertainty=["Exact LTV since cohort data is early"],
                data_backed_answers=["22 active paying clinics"],
                vague_claims=["Retention is directionally good"]
            ),
            
            investor_questions=[
                InvestorQuestionOutput(
                    question_text="Are clinics willing to pay SaaS fees?",
                    category="Revenue",
                    importance="Critical",
                    answered_status="Partial",
                    answer_quality="Moderate",
                    linked_answer="22 clinics paying, but price sensitivity is high.",
                    followup_required=True
                ),
                InvestorQuestionOutput(
                    question_text="How much onboarding support is needed?",
                    category="Product",
                    importance="High",
                    answered_status="Yes",
                    answer_quality="Strong",
                    linked_answer="Onboarding currently takes 2–3 sessions per clinic.",
                    followup_required=False
                )
            ],
            
            positive_signals=[
                "Founder is transparent about onboarding friction",
                "Deep clinical empathy and understanding"
            ],
            negative_signals=[
                "Services-heavy onboarding limits software margins",
                "Price sensitivity among target clinics is high"
            ],
            
            contradictions=[
                ContradictionOutput(
                    id="c1",
                    contradiction_title="Software vs Services Margin",
                    source_A="Pitch Deck claims 85% gross margin (SaaS)",
                    source_B="Diligence Call admits 2-3 sessions of manual onboarding per clinic",
                    severity="Medium",
                    why_it_matters="Reduces actual gross margin and scalability of GTM.",
                    decision_impact="Downgrade Margin Assumptions",
                    followup_question="How will you automate onboarding?",
                    recommended_diligence_action="Model unit economics with full onboarding costs."
                )
            ],
            
            evidence_extracted=[],
            
            open_followups=[
                FollowupItemOutput(
                    id="f1",
                    followup_item="Provide willingness-to-pay evidence from clinics",
                    requested_by="Investor",
                    promised_by="Founder",
                    due_date="Pending",
                    status="Open",
                    linked_risk="Pricing Power",
                    importance="High",
                    impact_if_unresolved="Blocks Deal Confidence"
                )
            ],
            
            decision_impact=ConversationDecisionImpactOutput(
                recommendation_adjustment="Downgrade",
                evidence_score_impact="Neutral",
                ic_readiness_impact="Decrease",
                confidence_impact="Decrease (Margin profile shifted)",
                decision_gates_triggered=["Watchlist"],
                final_explanation="Conversations revealed the product acts more like tech-enabled services than pure SaaS currently. We need stronger customer validation before proceeding."
            )
        )

    def _mock_generic_intelligence(self, deal_id: str, company_name: str) -> ConversationIntelligenceOutput:
        return ConversationIntelligenceOutput(
            deal_id=str(deal_id),
            company_name=company_name,
            founder_response_quality_score=70,
            clarity_score=70,
            responsiveness_score=70,
            credibility_score=70,
            evidence_provided_score=70,
            contradiction_risk_score=50,
            overall_conversation_score=70,
            summary="Conversation data has been processed. The founder provided standard responses to initial diligence questions. No critical contradictions found.",
            recommendation_adjustment="No Change"
        )
