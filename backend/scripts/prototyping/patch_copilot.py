with open("backend/partner_copilot_engine/copilot_fixtures.py", "r") as f:
    content = f.read()

import re

new_answer = """    "What is our most critical risk right now?": {
        "answer": "Looking across both active diligence and the portfolio: NeuralDesk has significant retention risk in the mid-market segment (82% NDR), and PayNest has a critical runway issue (< 8 months left) with high burn. You should prioritize a burn reduction plan with PayNest.",
        "citations": ["Portfolio Risk Engine: comp-paynest", "War Room: deal-1"],
        "suggested_actions": [
            "View Portfolio Risks",
            "Open PayNest Portfolio Page"
        ]
    },
    "Which portfolio company needs attention first?": {
        "answer": "PayNest needs immediate attention. Their runway has dropped below 8 months and their burn rate is still high, placing them in the 'Watchlist' category. VetPulse AI also needs GTM support, as clinic rollouts are stalled due to integration issues.",
        "citations": ["Portfolio Risk Engine: comp-paynest", "Founder Update: comp-vetpulse"],
        "suggested_actions": [
            "View PayNest Profile",
            "Open Value Creation Queue"
        ]
    },
    "Where should we allocate reserves?": {
        "answer": "CarbonLoop is currently our strongest follow-on candidate (ARR tripled QoQ, strong regulatory tailwinds). The Reserve Allocation Engine suggests increasing their allocation from $5M to $8M ahead of their Series A. Conversely, PayNest is over-reserved given their poor margin trajectory; consider releasing their $5M allocation.",
        "citations": ["Reserve Allocation Engine", "Follow-On Engine: comp-carbonloop"],
        "suggested_actions": [
            "View Reserve Allocation",
            "View CarbonLoop Follow-On Recommendation"
        ]
    },
    "What should we report to LPs?": {
        "answer": "The Q2 2024 LP Report is ready. Key highlights: Portfolio ARR grew 45% YoY driven by Enterprise AI and Climate Tech. CarbonLoop and NeuralDesk are the top performers. However, we are actively managing runway risks in the fintech segment (PayNest).",
        "citations": ["LP Reporting Engine", "Portfolio Summary"],
        "suggested_actions": [
            "View LP Report"
        ]
    },"""

content = re.sub(r'    "What is our most critical risk right now\?": \{.*?"View Red Team Critique"\n        \]\n    \},', new_answer, content, flags=re.DOTALL)

with open("backend/partner_copilot_engine/copilot_fixtures.py", "w") as f:
    f.write(content)
