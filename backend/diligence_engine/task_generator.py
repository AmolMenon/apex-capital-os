import uuid
from typing import List, Dict, Any
from .diligence_schemas import DiligenceTaskOutput

def generate_tasks(deal: Any, analysis_output: Dict[str, Any], research_brief: Dict[str, Any], deck_analysis: Dict[str, Any]) -> List[DiligenceTaskOutput]:
    """Generates a structured list of diligence tasks based on the deal profile and identified gaps."""
    tasks = []
    
    # 1. Technical Diligence
    tasks.append(DiligenceTaskOutput(
        id=str(uuid.uuid4()),
        task="Conduct Massive Technical Audit and Moat Validation",
        category="Deep Tech Diligence",
        objective="We must thoroughly validate their core technical architecture and infrastructure scalability. A superficial review is entirely insufficient; we need extreme diligence on their backend database scalability, cloud compute efficiency, and potential technical debt. Are they a thin wrapper, or do they possess proprietary, defensible IP?",
        owner="Lead Technical Partner",
        priority="Critical",
        status="Not Started",
        evidence_required="Full read-only access to GitHub repositories, AWS/GCP architecture diagrams, historical latency and uptime reports, and direct 1-on-1 interviews with their VP of Engineering.",
        expected_output="A highly detailed 15-page technical memo outlining code quality, scalability bottlenecks, and an assessment of the engineering team's talent density.",
        deadline_suggestion="Before final IC presentation",
        ic_relevance="Dealbreaker"
    ))
    
    # 2. Financial Diligence
    tasks.append(DiligenceTaskOutput(
        id=str(uuid.uuid4()),
        task="Bottom-Up Unit Economics and Cohort Retention Analysis",
        category="Financial Diligence",
        objective="Determine the absolute truth behind their claimed Gross Margins and LTV/CAC ratios. We need to normalize their CAC by removing organic, non-repeatable growth channels, and we must deeply analyze the Month-12 to Month-24 revenue retention cohorts to verify if net-negative churn is actually occurring.",
        owner="Financial Associate",
        priority="Critical",
        status="Not Started",
        evidence_required="Raw transaction-level data exports, customer-level billing cohorts, and a complete breakdown of sales & marketing expenditures over the trailing 24 months.",
        expected_output="A comprehensive cohort analysis spreadsheet with fully sensitized downside models.",
        deadline_suggestion="Within 1 week",
        ic_relevance="Dealbreaker"
    ))
    
    # 3. Go-To-Market Diligence
    tasks.append(DiligenceTaskOutput(
        id=str(uuid.uuid4()),
        task="Validate Enterprise Sales Motion and Pipeline Conversion",
        category="Go-To-Market Diligence",
        objective="Verify if the current revenue growth is scalable or solely driven by founder-led sales. We need to map out their exact sales cycle length, win/loss ratios against primary incumbents, and the ramp time for newly hired Account Executives.",
        owner="GTM Specialist",
        priority="High",
        status="Not Started",
        evidence_required="Salesforce/HubSpot CRM dump, pipeline progression metrics, and recorded Gong/Chorus sales calls.",
        expected_output="A GTM maturity assessment detailing the repeatability of their revenue engine.",
        deadline_suggestion="Next 5 days",
        ic_relevance="High"
    ))
    
    # 4. Competitor & Incumbent Diligence
    tasks.append(DiligenceTaskOutput(
        id=str(uuid.uuid4()),
        task="Analyze Catastrophic Incumbent Encroachment Risk",
        category="Strategic Diligence",
        objective="Evaluate the existential threat of massive tech incumbents (Google, Microsoft, Amazon, Salesforce) simply cloning this functionality and bundling it into their existing enterprise suites. We need to prove that their moat is technical and workflow-integrated, not just distributional.",
        owner="Venture Partner",
        priority="High",
        status="Not Started",
        evidence_required="Third-party expert network calls (GLG, AlphaSights) with ex-executives from incumbent competitors, and a deep feature-parity matrix.",
        expected_output="A strategic threat report outlining the defensive moat.",
        deadline_suggestion="Within 2 weeks",
        ic_relevance="Critical"
    ))
    
    # Check if deck has unsupported claims
    claims = deck_analysis.get("key_claims", [])
    if any(c.get("evidence_level") == "Unsupported" for c in claims):
        tasks.append(DiligenceTaskOutput(
            id=str(uuid.uuid4()),
            task="Verify Unsupported Deck Claims",
            category="General Diligence",
            objective="The founder made several claims without evidence in the deck. We need to verify these.",
            owner="Analyst",
            priority="High",
            status="Not Started",
            evidence_required="Data room access to underlying data for the claims.",
            expected_output="A claim verification report.",
            deadline_suggestion="Next 3 days",
            ic_relevance="High"
        ))

    return tasks
