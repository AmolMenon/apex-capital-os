GOLDEN_CASES = [
    {
        "id": "VC_01",
        "domain": "Venture Capital",
        "decision_context": "Series A Investment in AI Startup X",
        "evidence_documents": [
            "Company X generated $1.5M in ARR last year. (Source Fact)\nWe believe we are the only company doing this. (Extracted Claim)\nAssuming 20% MoM growth, we will hit $10M ARR next year. (Assumption)\nOur CTO left last week due to disagreements. (Risk)\nWe actually only made $1.2M last year. (Contradiction)"
        ],
        "known_facts": ["Generated $1.5M ARR last year (or $1.2M)", "CTO left last week"],
        "known_assumptions": ["20% MoM growth to hit $10M ARR"],
        "known_contradictions": ["Revenue was stated as $1.5M but later stated as $1.2M"],
        "known_risks": ["CTO left due to disagreements"],
        "expected_reasoning": ["Must question the growth assumption", "Must flag the CTO departure as a red flag", "Must point out the revenue discrepancy"],
        "expected_concerns": ["Leadership instability", "Unreliable financial reporting", "Overly aggressive growth assumptions"],
        "acceptable_recommendation": ["Do not invest", "Hold until leadership and financials are clarified"],
        "unacceptable_recommendations": ["Invest immediately", "Strong buy"]
    },
    {
        "id": "VC_02",
        "domain": "Venture Capital",
        "decision_context": "Seed Investment in Hardware Startup Y",
        "evidence_documents": [
            "We have secured patents for our battery tech. (Source Fact)\nWe project manufacturing costs will drop by 50% at scale. (Assumption)\nSupply chain for lithium is highly volatile right now. (Risk)"
        ],
        "known_facts": ["Secured patents for battery tech"],
        "known_assumptions": ["Manufacturing costs will drop by 50% at scale"],
        "known_contradictions": [],
        "known_risks": ["Supply chain for lithium is volatile"],
        "expected_reasoning": ["Acknowledge patent moat", "Question the 50% cost drop assumption", "Evaluate lithium supply chain risk"],
        "expected_concerns": ["Hardware scaling risks", "Lithium supply chain dependencies"],
        "acceptable_recommendation": ["Invest with milestones tied to manufacturing cost", "Invest due to strong IP moat"],
        "unacceptable_recommendations": ["Reject solely based on software multiples"]
    },
    {
        "id": "VC_03",
        "domain": "Venture Capital",
        "decision_context": "Series B Investment in B2B SaaS Z",
        "evidence_documents": [
            "Net Dollar Retention is 135%. (Source Fact)\nWe will capture 10% of the total addressable market in 3 years. (Assumption)\nOur main competitor just raised $100M. (Risk)"
        ],
        "known_facts": ["Net Dollar Retention is 135%", "Competitor raised $100M"],
        "known_assumptions": ["Will capture 10% TAM in 3 years"],
        "known_contradictions": [],
        "known_risks": ["Competitor has massive funding advantage"],
        "expected_reasoning": ["Strong NDR is a massive positive", "10% TAM assumption is highly speculative", "Competitor war chest is a major threat"],
        "expected_concerns": ["Competitor pricing out the startup", "TAM assumption unrealistic"],
        "acceptable_recommendation": ["Invest but reserve capital for aggressive marketing", "Hold pending competitive analysis"],
        "unacceptable_recommendations": ["Invest blindly without addressing competition"]
    },
    {
        "id": "VC_04",
        "domain": "Venture Capital",
        "decision_context": "Pre-Seed Investment in Crypto Protocol",
        "evidence_documents": [
            "Smart contract is fully audited. (Source Fact)\nWe will launch our token in Q4. (Source Fact)\nThe SEC will likely not regulate our specific utility token. (Assumption)\nWait, actually the audit found a critical vulnerability that is unpatched. (Contradiction)"
        ],
        "known_facts": ["Token launch in Q4", "Critical unpatched vulnerability"],
        "known_assumptions": ["SEC will not regulate the token"],
        "known_contradictions": ["Smart contract claimed fully audited but has critical unpatched vulnerability"],
        "known_risks": ["Unpatched critical vulnerability", "SEC regulation"],
        "expected_reasoning": ["Flag the critical vulnerability immediately", "Flag the SEC assumption as high risk", "Highlight the audit contradiction"],
        "expected_concerns": ["Security", "Regulatory compliance"],
        "acceptable_recommendation": ["Do not invest", "Hold until vulnerability is patched and legal counsel reviews SEC risk"],
        "unacceptable_recommendations": ["Invest"]
    },
    {
        "id": "CS_01",
        "domain": "Corporate Strategy",
        "decision_context": "Acquisition of Rival Company",
        "evidence_documents": [
            "Rival company has 500 enterprise clients. (Source Fact)\nTheir tech stack is fully compatible with ours. (Extracted Claim)\nWe assume 80% customer retention post-acquisition. (Assumption)\nTheir lead architect says the tech stacks are fundamentally incompatible. (Contradiction)\nAntitrust regulators are reviewing the sector heavily. (Risk)"
        ],
        "known_facts": ["Rival has 500 enterprise clients", "Antitrust regulators reviewing sector"],
        "known_assumptions": ["80% customer retention post-acquisition"],
        "known_contradictions": ["Tech stack claimed compatible, but lead architect says incompatible"],
        "known_risks": ["Tech integration failure", "Antitrust block", "Customer churn > 20%"],
        "expected_reasoning": ["Must flag the tech stack contradiction", "Must evaluate the antitrust risk", "Must question the 80% retention assumption"],
        "expected_concerns": ["Integration nightmare", "Regulatory block"],
        "acceptable_recommendation": ["Pause acquisition pending technical due diligence and legal review"],
        "unacceptable_recommendations": ["Proceed with acquisition immediately"]
    },
    {
        "id": "CS_02",
        "domain": "Corporate Strategy",
        "decision_context": "Market Expansion to EU",
        "evidence_documents": [
            "EU market size is $5B for our product. (Source Fact)\nGDPR compliance will take 6 months. (Assumption)\nWe can reuse our US marketing materials in the EU. (Assumption)\nOur US marketing materials violate EU comparative advertising laws. (Contradiction)"
        ],
        "known_facts": ["EU market size is $5B"],
        "known_assumptions": ["GDPR compliance takes 6 months", "Can reuse US marketing materials"],
        "known_contradictions": ["Assumption to reuse US materials vs violation of EU laws"],
        "known_risks": ["GDPR compliance delays", "Marketing strategy needs total rewrite"],
        "expected_reasoning": ["Flag the marketing materials contradiction", "Question the 6-month GDPR timeline"],
        "expected_concerns": ["Underestimating localization costs", "Legal risks"],
        "acceptable_recommendation": ["Approve expansion but allocate budget for EU-specific marketing and legal counsel"],
        "unacceptable_recommendations": ["Approve expansion with existing US strategy"]
    },
    {
        "id": "CS_03",
        "domain": "Corporate Strategy",
        "decision_context": "Pivot to Enterprise Sales",
        "evidence_documents": [
            "Enterprise deals take 9 months to close. (Source Fact)\nOur current runway is 12 months. (Source Fact)\nWe assume we can close 5 enterprise deals in the next 6 months. (Assumption)\nOur sales team has zero enterprise experience. (Risk)"
        ],
        "known_facts": ["Enterprise deals take 9 months", "Runway is 12 months", "Sales team has no enterprise experience"],
        "known_assumptions": ["Can close 5 deals in 6 months"],
        "known_contradictions": ["Deals take 9 months but assuming 5 deals close in 6 months"],
        "known_risks": ["Runway runs out before deals close", "Inexperienced sales team"],
        "expected_reasoning": ["Highlight the mathematical impossibility/contradiction of closing 9-month deals in 6 months", "Flag the runway risk"],
        "expected_concerns": ["Bankruptcy", "Execution failure"],
        "acceptable_recommendation": ["Do not pivot without raising more capital", "Hire enterprise sales leaders first before pivoting"],
        "unacceptable_recommendations": ["Execute the pivot immediately"]
    },
    {
        "id": "OPS_08",
        "domain": "Operations",
        "decision_context": "Relocate Manufacturing to Vietnam",
        "evidence_documents": [
            "Labor costs in Vietnam are 30% lower. (Source Fact)\nShipping times to the US will increase by 2 weeks. (Source Fact)\nWe assume tariffs will remain at current levels for the next 5 years. (Assumption)\nLocal managers warn of severe power grid instability in the target region. (Risk)"
        ],
        "known_facts": ["Labor costs 30% lower", "Shipping times increase 2 weeks"],
        "known_assumptions": ["Tariffs remain stable for 5 years"],
        "known_contradictions": [],
        "known_risks": ["Power grid instability", "Tariff changes", "Increased shipping time impacting inventory"],
        "expected_reasoning": ["Weigh labor savings against shipping delays", "Flag the power grid instability as a critical operational risk", "Question the tariff stability assumption"],
        "expected_concerns": ["Supply chain disruptions due to power outages", "Inventory management issues"],
        "acceptable_recommendation": ["Conduct a pilot run or secure backup power agreements before full relocation"],
        "unacceptable_recommendations": ["Relocate entirely immediately based solely on labor costs"]
    },
    {
        "id": "OP_02",
        "domain": "Operations",
        "decision_context": "Migrate Cloud Provider from AWS to GCP",
        "evidence_documents": [
            "GCP offers a 20% discount on compute. (Source Fact)\nMigration will take 3 months. (Assumption)\nOur core database relies on AWS Aurora proprietary features. (Risk)\nThe engineering team claims the migration will be seamless. (Extracted Claim)\nThe database reliance on Aurora means migration requires a full rewrite. (Contradiction)"
        ],
        "known_facts": ["GCP offers 20% discount", "Core DB relies on AWS Aurora"],
        "known_assumptions": ["Migration will take 3 months"],
        "known_contradictions": ["Engineering claims seamless migration vs Aurora requiring full rewrite"],
        "known_risks": ["Migration taking much longer than 3 months", "Database rewrite failure"],
        "expected_reasoning": ["Highlight the Aurora dependency contradiction", "Question the 3-month timeline given the database rewrite"],
        "expected_concerns": ["Massive engineering cost overruns", "Service downtime"],
        "acceptable_recommendation": ["Do not migrate", "Delay migration until database is decoupled from Aurora"],
        "unacceptable_recommendations": ["Migrate immediately to save 20%"]
    },
    {
        "id": "OP_03",
        "domain": "Operations",
        "decision_context": "Implement 4-Day Work Week",
        "evidence_documents": [
            "Employee surveys show 90% support for a 4-day work week. (Source Fact)\nWe assume productivity will remain exactly the same. (Assumption)\nCustomer support SLA requires 24/5 coverage. (Source Fact)\nWe will not hire additional staff to cover the missing day. (Assumption)\nIt is mathematically impossible to maintain 24/5 coverage without adding staff or increasing hours on the 4 days. (Contradiction)"
        ],
        "known_facts": ["90% support", "Support SLA requires 24/5 coverage"],
        "known_assumptions": ["Productivity remains the same", "Will not hire additional staff"],
        "known_contradictions": ["Maintaining 24/5 coverage without hiring while cutting a day"],
        "known_risks": ["SLA breaches", "Customer churn"],
        "expected_reasoning": ["Identify the mathematical impossibility of 24/5 coverage with a 4-day week and no new hires"],
        "expected_concerns": ["SLA violations", "Customer dissatisfaction"],
        "acceptable_recommendation": ["Implement 4-day week only with staggered shifts or new hires", "Reject the proposal for customer support teams"],
        "unacceptable_recommendations": ["Approve for all staff without changing hiring or SLAs"]
    }
]
