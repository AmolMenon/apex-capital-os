def generate_diligence_plan(deal_dict: dict) -> list:
    return [
        {
            "phase_name": "Phase 1: First 2 Weeks",
            "goal": "Validate basic deal quality",
            "tasks": [
                {
                    "task": "Founder call",
                    "objective": "Assess founder ambition, grit, and communication.",
                    "owner": "Lead Partner",
                    "evidence_required": "Detailed notes on founder's motivation and vision.",
                    "pass_fail_signal": "Pass if founder is uniquely suited; Fail if low energy or unclear vision."
                },
                {
                    "task": "Product demo",
                    "objective": "Verify product exists and works as claimed.",
                    "owner": "Associate",
                    "evidence_required": "Recording of demo and UX teardown.",
                    "pass_fail_signal": "Fail if product is vaporware or highly buggy."
                },
                {
                    "task": "Customer references",
                    "objective": "Understand real value proposition.",
                    "owner": "Analyst",
                    "evidence_required": "Notes from 3+ early customer calls.",
                    "pass_fail_signal": "Pass if customers exhibit high NPS."
                },
                {
                    "task": "Market sizing check",
                    "objective": "Validate TAM/SAM logic.",
                    "owner": "Analyst",
                    "evidence_required": "Bottom-up TAM model.",
                    "pass_fail_signal": "Fail if bottom-up TAM is <$500M."
                },
                {
                    "task": "Competitor scan",
                    "objective": "Identify direct threats.",
                    "owner": "Analyst",
                    "evidence_required": "Feature comparison matrix.",
                    "pass_fail_signal": "Fail if 100% feature overlap with a free incumbent."
                },
                {
                    "task": "Unit economics sanity check",
                    "objective": "Verify gross margin and CAC claims.",
                    "owner": "Associate",
                    "evidence_required": "LTV/CAC breakdown.",
                    "pass_fail_signal": "Pass if unit economics show a path to scalability."
                }
            ]
        },
        {
            "phase_name": "Phase 2: Weeks 3–6",
            "goal": "Validate traction and repeatability",
            "tasks": [
                {
                    "task": "Customer cohort analysis",
                    "objective": "Check retention over time.",
                    "owner": "Associate",
                    "evidence_required": "Month-over-month cohort retention charts.",
                    "pass_fail_signal": "Fail if month 6 retention is <50%."
                },
                {
                    "task": "Sales pipeline review",
                    "objective": "Evaluate future growth.",
                    "owner": "Lead Partner",
                    "evidence_required": "CRM export review.",
                    "pass_fail_signal": "Fail if pipeline is shallow."
                },
                {
                    "task": "Pricing analysis",
                    "objective": "Check pricing power.",
                    "owner": "Analyst",
                    "evidence_required": "ACV progression over last 12 months.",
                    "pass_fail_signal": "Pass if ACV is increasing."
                }
            ]
        },
        {
            "phase_name": "Phase 3: Weeks 7–12",
            "goal": "Validate investment readiness",
            "tasks": [
                {
                    "task": "Legal & IP review",
                    "objective": "Ensure clean entity and IP.",
                    "owner": "Legal Counsel",
                    "evidence_required": "Legal DD report.",
                    "pass_fail_signal": "Fail if major litigation or IP issues."
                },
                {
                    "task": "Cap table review",
                    "objective": "Check ownership structure.",
                    "owner": "Associate",
                    "evidence_required": "Pro-forma cap table.",
                    "pass_fail_signal": "Fail if dead equity is >30%."
                },
                {
                    "task": "Financial model review",
                    "objective": "Verify burn and runway.",
                    "owner": "Associate",
                    "evidence_required": "3-year financial model.",
                    "pass_fail_signal": "Pass if capital covers 18+ months runway."
                },
                {
                    "task": "IC memo finalization",
                    "objective": "Prepare final defense.",
                    "owner": "Deal Team",
                    "evidence_required": "Completed investment memo.",
                    "pass_fail_signal": "Pass if IC approves."
                }
            ]
        }
    ]
