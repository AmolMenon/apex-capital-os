from .fund_os_schemas import GPCockpitSummary

def get_gp_cockpit() -> GPCockpitSummary:
    return GPCockpitSummary(
        top_gp_priorities=[
            {"action": "Finalize Q3 Capital Call Notice", "owner": "CFO", "urgency": "High", "reason": "Upcoming NeuralDesk follow-on requirement"},
            {"action": "Send Operations Deck to Asteria", "owner": "Managing Partner", "urgency": "High", "reason": "Institutional LP momentum"}
        ],
        urgent_alerts=[
            {"alert": "Reserve Over-Allocation Warning", "reason": "Current follow-on targets exceed allocated reserve pool by $2M."}
        ],
        lp_actions=[
            {"lp": "Meridian Family Office", "action": "Share track record memo", "status": "Diligence"}
        ],
        portfolio_actions=[
            {"company": "NeuralDesk", "action": "Board deck flagged an unspoken risk regarding churn.", "status": "Needs Support"}
        ],
        deal_actions=[
            {"deal": "VerveAI", "action": "Partner Meeting scheduled", "status": "Active"}
        ],
        fund_operations_actions=[
            {"action": "Update Team Bios in Data Room", "owner": "HR", "status": "Overdue"}
        ]
    )
