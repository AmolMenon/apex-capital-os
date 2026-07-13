from .deal_inbox_schemas import *

INBOUND_DEALS = [
    InboundDeal(
        inbound_id="inb_bharatvector",
        source="email",
        company_name="BharatVector AI",
        founder_name="Rahul Sharma",
        founder_email="rahul@bharatvector.ai",
        received_at="2026-06-14T10:00:00Z",
        subject="Intro: BharatVector AI - Regional AI Infra for Indian Enterprises",
        summary="Building regional-language enterprise AI infrastructure for Indian businesses, starting with customer support and knowledge workflows for regulated industries.",
        attachments=["BharatVector_Deck_v2.pdf"],
        parsed_claims=[
            "building regional-language AI infrastructure",
            "targeting enterprise workflows",
            "early pilots mentioned",
            "fundraising round mentioned",
            "claims require verification"
        ],
        thesis_match={"match": "High", "reason": "Strong thesis match for emerging market AI infrastructure."},
        priority_score={"priority": "High Priority", "score": 92},
        triage_status="new",
        recommended_next_action="Convert to Deal and Request Data Room",
        owner="Partner A",
        metadata={
            "unknowns": [
                "ARR",
                "customer retention",
                "gross margin",
                "compute cost economics",
                "customer concentration",
                "cap table",
                "round valuation",
                "product usage depth"
            ]
        }
    ),
    InboundDeal(
        inbound_id="inb_2",
        source="email",
        company_name="GridSense Robotics",
        founder_name="Sarah Jenkins",
        founder_email="ceo@gridsense.io",
        received_at="2026-06-14T11:30:00Z",
        subject="GridSense Robotics - Series A",
        summary="Industrial robotics. Raising $15M Series A.",
        attachments=["GridSense_SeriesA.pdf"],
        parsed_claims=["$2M ARR", "12 enterprise customers", "Hardware + Software"],
        thesis_match={"match": "Medium", "reason": "Good metrics but hardware heavy."},
        priority_score={"priority": "Review Next", "score": 70},
        triage_status="new",
        recommended_next_action="Review deck",
        owner="Analyst B",
        metadata={}
    )
]
