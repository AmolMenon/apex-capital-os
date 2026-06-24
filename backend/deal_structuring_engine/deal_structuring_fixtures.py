from .deal_structuring_schemas import *

NEURALDESK_DEAL = DealStructuringReport(
    deal_id="neuraldesk",
    company_name="NeuralDesk",
    round_type="Priced Seed Equity",
    recommended_check_size="₹4Cr",
    target_ownership="12%",
    entry_valuation="₹25Cr Pre-money",
    ownership_scenarios=[
        {"scenario": "Base", "ownership": "12.0%"},
        {"scenario": "Post-Series A Dilution", "ownership": "9.6%"}
    ],
    dilution_scenarios=[
        {"round": "Series A", "dilution": "20%", "pro_rata_required": "₹2Cr"}
    ],
    fund_return_analysis={
        "return_potential": "Strong",
        "multiple_needed_for_fund_return": "15x"
    },
    lead_or_participate={
        "recommendation": "Co-Lead",
        "reason": "High conviction, but cheque size requires a partner to fill the ₹10Cr round."
    },
    term_sheet_analysis=TermSheetAnalysis(
        valuation="₹25Cr Pre",
        round_size="₹10Cr",
        security_type="Equity",
        liquidation_preference="1x Non-Participating",
        board_rights="1 Seat",
        pro_rata_rights="Major Investor Rights",
        business_meaning={"liquidation_preference": "Standard downside protection"},
        fund_impact={"board_rights": "Requires partner bandwidth"},
        founder_impact={"board_rights": "Loss of single-founder control"},
        risk_level={"valuation": "Medium - slight premium to market"},
        legal_review_required=["Board Seat Voting Rights", "Pro-Rata Definitions"],
        missing_terms=["Option Pool Increase"]
    ),
    negotiation_prep={
        "fund_priorities": ["12% Ownership", "Board Seat", "Pro-Rata"],
        "founder_priorities": ["Minimize dilution", "Fast closing"],
        "push": ["Option pool expansion before round"],
        "flex": ["Board seat can be an observer seat if needed"],
        "non_negotiables": ["1x Non-Participating Liq Pref"]
    },
    closing_checklist=[
        ClosingChecklistItem(id="c1", item="IC Approval", owner="Partner A", status="Completed", due_date="2026-06-14", blocker=True, evidence_required="IC Memo", notes=""),
        ClosingChecklistItem(id="c2", item="Final Term Sheet Signed", owner="Legal", status="Pending", due_date="2026-06-18", blocker=True, evidence_required="Signed PDF", notes="Waiting on founder"),
        ClosingChecklistItem(id="c3", item="Wire Instructions Verified", owner="Finance", status="Not Started", due_date="2026-06-20", blocker=True, evidence_required="Bank Letter", notes="")
    ],
    legal_diligence=[
        LegalDiligenceItem(id="l1", item="Incorporation Docs", status="Received", notes="Standard DE C-Corp"),
        LegalDiligenceItem(id="l2", item="Cap Table", status="Under Review", notes="Checking ESOP allocations"),
        LegalDiligenceItem(id="l3", item="IP Assignment", status="Requested", notes="Crucial for AI models")
    ],
    post_close_handoff={
        "status": "Not Ready",
        "key_risks_to_monitor": ["Churn rate", "CAC payback"],
        "reporting_cadence": "Monthly"
    },
    trust_flags=[
        "Not legal advice. Term sheet analysis requires counsel review.",
        "Valuation assumptions based on user input, not verified market data.",
        "Cap table analysis relies on founder-provided Excel, not audited data room."
    ],
    metadata={"status": "active"}
)

FIXTURES = {
    "neuraldesk": NEURALDESK_DEAL
}
