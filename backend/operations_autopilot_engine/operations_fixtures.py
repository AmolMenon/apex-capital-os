import datetime

now = datetime.datetime.utcnow().isoformat() + "Z"
tomorrow = (datetime.datetime.utcnow() + datetime.timedelta(days=1)).isoformat() + "Z"
next_week = (datetime.datetime.utcnow() + datetime.timedelta(days=7)).isoformat() + "Z"

MOCK_TASKS = [
    {
        "task_id": "tsk_bharatvector_1",
        "title": "Verify enterprise pilot ARR conversion for BharatVector",
        "description": "BharatVector AI claims 3 enterprise pilots but has no verified ARR. IC Packet indicates this is a critical blocker.",
        "source_module": "decision_engine",
        "source_entity_type": "deal",
        "source_entity_id": "bharatvector_ai",
        "owner": "Partner",
        "priority": "critical",
        "status": "not_started",
        "due_date": tomorrow,
        "task_type": "partner_review",
        "blocking_ic": True,
        "blocking_follow_on": False,
        "blocking_lp_report": False,
        "dependencies": [],
        "recommended_action": "Email founders requesting signed LOIs or pilot conversion data.",
        "evidence_reference": "Decision Engine / IC Packet",
        "created_at": now,
        "updated_at": now,
        "metadata": {}
    },
    {
        "task_id": "tsk_sarvam_1",
        "title": "Request private metrics (ARR, Customer Concentration)",
        "description": "Sarvam AI is currently treated as a public benchmark, but we need private metrics to consider an investment.",
        "source_module": "deal_room",
        "source_entity_type": "deal",
        "source_entity_id": "sarvam_ai",
        "owner": "Analyst",
        "priority": "high",
        "status": "not_started",
        "due_date": tomorrow,
        "task_type": "data_room_request",
        "blocking_ic": True,
        "blocking_follow_on": False,
        "blocking_lp_report": False,
        "dependencies": [],
        "recommended_action": "Email founder requesting cap table, ARR, and compute costs.",
        "evidence_reference": "Missing private metrics in Data Room.",
        "created_at": now,
        "updated_at": now,
        "metadata": {}
    },
    {
        "task_id": "tsk_neural_1",
        "title": "Review retention cohort before IC",
        "description": "NeuralDesk provided cohort data but it needs partner review for NRR breakdown.",
        "source_module": "data_room",
        "source_entity_type": "deal",
        "source_entity_id": "neuraldesk",
        "owner": "Partner",
        "priority": "critical",
        "status": "not_started",
        "due_date": tomorrow,
        "task_type": "partner_review",
        "blocking_ic": True,
        "blocking_follow_on": False,
        "blocking_lp_report": False,
        "dependencies": [],
        "recommended_action": "Review the uploaded Retention Cohort sheet in the Data Room.",
        "evidence_reference": "Retention Cohort uploaded yesterday.",
        "created_at": now,
        "updated_at": now,
        "metadata": {}
    },
    {
        "task_id": "tsk_neural_2",
        "title": "Resolve pipeline conversion uncertainty",
        "description": "Ensure NeuralDesk is accurately marked as advancing to IC in pipeline.",
        "source_module": "sourcing",
        "source_entity_type": "deal",
        "source_entity_id": "neuraldesk",
        "owner": "Analyst",
        "priority": "medium",
        "status": "in_progress",
        "due_date": tomorrow,
        "task_type": "system_configuration",
        "blocking_ic": False,
        "blocking_follow_on": False,
        "blocking_lp_report": False,
        "dependencies": [],
        "recommended_action": "Update Sourcing Engine pipeline status.",
        "evidence_reference": "Pipeline stage mismatch.",
        "created_at": now,
        "updated_at": now,
        "metadata": {}
    },
    {
        "task_id": "tsk_zepto_1",
        "title": "Mark as benchmark-only due to fund math limitations",
        "description": "Zepto valuation exceeds our target ownership constraints.",
        "source_module": "fund_math",
        "source_entity_type": "deal",
        "source_entity_id": "zepto",
        "owner": "Principal",
        "priority": "medium",
        "status": "completed",
        "due_date": now,
        "task_type": "fund_math_review",
        "blocking_ic": False,
        "blocking_follow_on": False,
        "blocking_lp_report": False,
        "dependencies": [],
        "recommended_action": "Archive Zepto as an investment target and retain for benchmarking.",
        "evidence_reference": "Fund Math Output",
        "created_at": now,
        "updated_at": now,
        "metadata": {}
    },
    {
        "task_id": "tsk_port_1",
        "title": "Review VetPulse GTM support plan",
        "description": "VetPulse needs strategic GTM introductions.",
        "source_module": "portfolio_intelligence",
        "source_entity_type": "portfolio_company",
        "source_entity_id": "comp-vetpulse",
        "owner": "Operating Partner",
        "priority": "high",
        "status": "not_started",
        "due_date": next_week,
        "task_type": "portfolio_support",
        "blocking_ic": False,
        "blocking_follow_on": False,
        "blocking_lp_report": False,
        "dependencies": [],
        "recommended_action": "Schedule 30-min sync with VetPulse CEO to review GTM.",
        "evidence_reference": "Vague founder update flagged by Agent.",
        "created_at": now,
        "updated_at": now,
        "metadata": {}
    },
    {
        "task_id": "tsk_fund_1",
        "title": "Follow up with Meridian Family Office",
        "description": "Meridian LP requested additional portfolio concentration data.",
        "source_module": "fund_os",
        "source_entity_type": "lp",
        "source_entity_id": "meridian",
        "owner": "Partner",
        "priority": "critical",
        "status": "not_started",
        "due_date": tomorrow,
        "task_type": "lp_follow_up",
        "blocking_ic": False,
        "blocking_follow_on": False,
        "blocking_lp_report": False,
        "dependencies": [],
        "recommended_action": "Send updated fund construction and portfolio monitoring summary.",
        "evidence_reference": "LP Questions Interface",
        "created_at": now,
        "updated_at": now,
        "metadata": {}
    }
]

MOCK_WORKFLOWS = [
    {
        "entity_id": "bharatvector_ai",
        "entity_type": "deal",
        "current_stage": "IC Prep",
        "next_stage": "IC Review",
        "completion_percentage": 85,
        "blockers": ["Unverified ARR", "Fund Math Incompatibility"],
        "required_tasks": ["tsk_bharatvector_1"]
    },
    {
        "entity_id": "sarvam_ai",
        "entity_type": "deal",
        "current_stage": "Researching",
        "next_stage": "First Call",
        "completion_percentage": 25,
        "blockers": ["Missing private metrics"],
        "required_tasks": ["tsk_sarvam_1"]
    },
    {
        "entity_id": "neuraldesk",
        "entity_type": "deal",
        "current_stage": "IC Prep",
        "next_stage": "IC Review",
        "completion_percentage": 90,
        "blockers": ["Partner Review of Retention"],
        "required_tasks": ["tsk_neural_1"]
    },
    {
        "entity_id": "zepto",
        "entity_type": "deal",
        "current_stage": "Benchmark Complete",
        "next_stage": None,
        "completion_percentage": 100,
        "blockers": [],
        "required_tasks": []
    },
    {
        "entity_id": "meridian",
        "entity_type": "lp",
        "current_stage": "Diligence",
        "next_stage": "Soft Commit",
        "completion_percentage": 60,
        "blockers": ["Pending Concentration Data"],
        "required_tasks": ["tsk_fund_1"]
    }
]

MOCK_NEXT_ACTIONS = [
    {
        "action_id": "na_bharatvector",
        "entity_id": "bharatvector_ai",
        "entity_type": "deal",
        "action": "Resolve the $40M Valuation Cap issue which breaks fund math before moving to IC.",
        "why_now": "Without resolving fund math and ARR, IC Review will be blocked by Trust Layer.",
        "owner": "Partner",
        "due_date": tomorrow,
        "related_tasks": ["tsk_bharatvector_1"],
        "expected_impact": "Will unblock IC readiness or pass on deal.",
        "open_blockers": ["Valuation Cap", "Unverified ARR"]
    },
    {
        "action_id": "na_sarvam",
        "entity_id": "sarvam_ai",
        "entity_type": "deal",
        "action": "Request private metrics or keep as public benchmark. ARR, customer concentration, compute economics, and retention are missing.",
        "why_now": "Without private metrics, this deal cannot advance past initial research.",
        "owner": "Analyst",
        "due_date": tomorrow,
        "related_tasks": ["tsk_sarvam_1"],
        "expected_impact": "Will unblock IC readiness.",
        "open_blockers": ["Missing private metrics"]
    },
    {
        "action_id": "na_neuraldesk",
        "entity_id": "neuraldesk",
        "entity_type": "deal",
        "action": "Review retention cohort and customer references before IC.",
        "why_now": "Deal is otherwise ready for IC.",
        "owner": "Partner",
        "due_date": tomorrow,
        "related_tasks": ["tsk_neural_1"],
        "expected_impact": "IC Approval",
        "open_blockers": ["Partner Review"]
    },
    {
        "action_id": "na_zepto",
        "entity_id": "zepto",
        "entity_type": "deal",
        "action": "Keep as benchmark-only. Fund math and ownership feasibility make this unsuitable for the default fund.",
        "why_now": "Already analyzed.",
        "owner": "Principal",
        "due_date": now,
        "related_tasks": [],
        "expected_impact": "Time savings",
        "open_blockers": []
    },
    {
        "action_id": "na_meridian",
        "entity_id": "meridian",
        "entity_type": "lp",
        "action": "Send updated fund construction and portfolio monitoring summary before next LP meeting.",
        "why_now": "LP explicitly requested this to advance to Soft Commit.",
        "owner": "Partner",
        "due_date": tomorrow,
        "related_tasks": ["tsk_fund_1"],
        "expected_impact": "Advance to Soft Commit",
        "open_blockers": ["Missing Concentration Data"]
    }
]

MOCK_ALERTS = [
    {
        "alert_id": "al_0",
        "title": "BharatVector AI Fund Math Failure",
        "severity": "critical",
        "source_module": "decision_engine",
        "entity_id": "bharatvector_ai",
        "entity_type": "deal",
        "reason": "Entry valuation of $40M is structurally incompatible with fund size.",
        "recommended_action": "Renegotiate cap to $25M or log as pass.",
        "owner": "Partner",
        "due_date": now,
        "status": "active"
    },
    {
        "alert_id": "al_1",
        "title": "NeuralDesk IC Blocked",
        "severity": "high",
        "source_module": "data_room",
        "entity_id": "neuraldesk",
        "entity_type": "deal",
        "reason": "Retention cohort needs partner review.",
        "recommended_action": "Complete partner review task.",
        "owner": "Partner",
        "due_date": tomorrow,
        "status": "active"
    },
    {
        "alert_id": "al_2",
        "title": "Fund Math Failure for Zepto",
        "severity": "medium",
        "source_module": "fund_math",
        "entity_id": "zepto",
        "entity_type": "deal",
        "reason": "Valuation exceeds target ownership limits.",
        "recommended_action": "Mark as benchmark.",
        "owner": "Principal",
        "due_date": now,
        "status": "resolved"
    },
    {
        "alert_id": "al_3",
        "title": "LP Follow-Up Overdue",
        "severity": "critical",
        "source_module": "fund_os",
        "entity_id": "meridian",
        "entity_type": "lp",
        "reason": "Meridian Family Office waiting on portfolio data.",
        "recommended_action": "Send requested data.",
        "owner": "Partner",
        "due_date": tomorrow,
        "status": "active"
    }
]

MOCK_APPROVALS = [
    {
        "approval_id": "app_1",
        "action": "Move NeuralDesk to IC",
        "requester": "Analyst",
        "approver_role": "Partner",
        "risk": "medium",
        "reason": "All diligence tasks completed, except final partner retention review.",
        "related_entity_id": "neuraldesk",
        "related_entity_type": "deal",
        "evidence": "Data Room completeness: 90%",
        "status": "pending"
    }
]

MOCK_NOTIFICATIONS = [
    {
        "notification_id": "notif_1",
        "subject": "Missing Metrics for Sarvam AI",
        "message": "Hi Founder, could we please get access to the cap table and current ARR?",
        "recipient_role": "Founder",
        "urgency": "medium",
        "send_channel": "email_draft",
        "status": "draft",
        "related_entity_id": "sarvam_ai",
        "related_entity_type": "deal"
    }
]

MOCK_CADENCE = {
    "daily": {
        "cadence_type": "daily_standup",
        "title": "Daily Analyst Standup",
        "agenda": ["Top tasks for today", "Blocked Deals (NeuralDesk)", "New Sourcing Leads"],
        "required_prep": ["Update deal statuses in War Room"],
        "suggested_attendees": ["Analysts", "Principals"],
        "open_tasks": ["tsk_sarvam_1", "tsk_neural_2"],
        "meeting_notes_draft": ""
    },
    "weekly_partner": {
        "cadence_type": "weekly_partner",
        "title": "Weekly Partner Meeting",
        "agenda": ["IC Review: NeuralDesk", "Fund Construction LP Requests", "Portfolio Support: VetPulse"],
        "required_prep": ["Review NeuralDesk Retention", "Prepare Meridian LP Data"],
        "suggested_attendees": ["Partners", "Principals"],
        "open_tasks": ["tsk_neural_1", "tsk_fund_1", "tsk_port_1"],
        "meeting_notes_draft": ""
    }
}

MOCK_AUDIT_LOGS = [
    {
        "log_id": "log_1",
        "actor": "System",
        "action": "task_created",
        "entity_id": "tsk_sarvam_1",
        "entity_type": "task",
        "source_module": "data_room",
        "timestamp": now,
        "details": "Automatically generated due to missing data room metrics."
    },
    {
        "log_id": "log_2",
        "actor": "Principal",
        "action": "task_completed",
        "entity_id": "tsk_zepto_1",
        "entity_type": "task",
        "source_module": "fund_math",
        "timestamp": now,
        "details": "Zepto marked as benchmark."
    }
]
