from typing import List
from .fund_os_schemas import InstitutionalLPQuestion

def get_institutional_lp_questions() -> List[InstitutionalLPQuestion]:
    return [
        InstitutionalLPQuestion(
            question_id="q_1",
            category="Track Record",
            question_text="How do you attribute the returns of your previous investments?",
            why_lp_asks="Institutional LPs want to know if returns were driven by a systemic process or a single lucky strike.",
            current_answer="Our returns are driven by a thesis-first approach and disciplined entry valuations. We rely on our Agentic Workflow for consistent diligence.",
            evidence_available=["Investment Memos", "Historical DPI records"],
            evidence_missing=["Detailed post-mortem on our two write-offs"],
            recommended_preparation="Draft a concise 2-pager analyzing lessons learned from past failures."
        ),
        InstitutionalLPQuestion(
            question_id="q_2",
            category="Portfolio Construction",
            question_text="How exactly do you model and deploy your 40% reserves?",
            why_lp_asks="LPs worry about GPs throwing good money after bad, or diluting their best winners.",
            current_answer="We only follow-on into the top 20% of the portfolio based on objective KPI momentum and Value Creation urgency scores.",
            evidence_available=["Reserve Strategy Doc", "Fund OS Construction Model"],
            evidence_missing=["Examples of when we chose NOT to follow-on"],
            recommended_preparation="Highlight the Decision Engine output where we passed on a Series B round due to valuation compression."
        ),
        InstitutionalLPQuestion(
            question_id="q_3",
            category="Differentiation",
            question_text="If you compete for a hot deal against Sequoia or Accel, why does the founder choose you?",
            why_lp_asks="Testing the firm's true edge in a highly competitive early-stage market.",
            current_answer="We offer AI-native operational support and unparalleled market intelligence through our Evidence Center.",
            evidence_available=["Founder Reference List", "Case Studies"],
            evidence_missing=["Data on win-rates in competitive situations"],
            recommended_preparation="Compile a breakdown of our last 5 competitive wins."
        )
    ]
