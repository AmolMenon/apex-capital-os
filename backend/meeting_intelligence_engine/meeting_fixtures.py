from .meeting_schemas import *

MEETINGS = [
    ApexMeeting(
        meeting_id="mtg_1",
        title="BharatVector AI - Intro Call",
        meeting_type="founder_call",
        related_entity_type="deal",
        related_entity_id="bharatvector",
        start_time="2026-06-16T10:00:00Z",
        end_time="2026-06-16T10:45:00Z",
        participants=["Partner A", "Rahul Sharma (Founder)"],
        agenda="Introductory pitch, understand tech differentiation.",
        prep_brief={
            "company_summary": "AI agents for Indian manufacturing.",
            "thesis_fit": "High - aligns with emerging market AI application thesis.",
            "suggested_questions": ["How do you integrate with legacy ERPs like SAP/Tally?", "What is the sales cycle length?"]
        },
        summary={},
        action_items=[],
        followups=[],
        founder_claims=[],
        partner_notes=[],
        metadata={"is_upcoming": True}
    ),
    ApexMeeting(
        meeting_id="mtg_2",
        title="NeuralDesk - Partner Review",
        meeting_type="partner_review",
        related_entity_type="deal",
        related_entity_id="neuraldesk",
        start_time="2026-06-14T14:00:00Z",
        end_time="2026-06-14T15:00:00Z",
        participants=["Partner A", "Partner B", "Analyst C"],
        agenda="Review diligence findings before IC.",
        prep_brief={},
        summary={
            "what_happened": "Reviewed technical diligence. Partner B raised concerns on churn.",
            "next_best_action": "Wait for updated cohort retention data."
        },
        action_items=[MeetingActionItem(task="Request updated cohorts", owner="Analyst C", due_date="2026-06-16")],
        followups=["Founder to send updated cohorts"],
        founder_claims=[],
        partner_notes=["I am still not convinced the product is sticky enough - Partner B"],
        metadata={"is_upcoming": False}
    )
]
