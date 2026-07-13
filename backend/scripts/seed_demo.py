import os
import json
import sys
from datetime import datetime, timedelta

# Add parent dir to path so we can import from db
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.database import SessionLocal
from db.models import (
    Workspace, DecisionSubject, Decision, Evidence, Claim, Assumption, 
    ReviewRun, DomainEvent, Recommendation, EvidenceConflict
)

def seed_demo():
    db = SessionLocal()
    
    # 1. Create Workspace
    workspace = Workspace(name="Demo Workspace")
    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    # 2. Create DecisionSubject (Company)
    company = DecisionSubject(
        name="Acme AI",
        description="A B2B SaaS platform utilizing generative AI for automated sales outreach.",
        metadata_json=json.dumps({"sector": "Enterprise AI", "stage": "Seed", "website": "https://acme.ai"})
    )
    db.add(company)
    db.commit()
    db.refresh(company)

    # 3. Create Decision (Investment Case)
    case = Decision(
        workspace_id=workspace.id,
        subject_id=company.id,
        title="Seed Round Investment Case",
        status="Review",
        description="Evaluating $2M Seed round at $10M post-money."
    )
    db.add(case)
    db.commit()
    db.refresh(case)

    # 4. Create Evidence
    ev1 = Evidence(
        decision_id=case.id,
        title="Acme AI Pitch Deck v3.pdf",
        content="Slide 1: Acme AI... Slide 5: We have reached $10k MRR with zero marketing spend... Slide 7: Our CAC is $50 and LTV is $200...",
        evidence_type="pitch_deck",
        metadata_json='{"slides": 12}',
        deck_version=1
    )
    
    ev2 = Evidence(
        decision_id=case.id,
        title="Acme Financials 2026.xlsx",
        content="Row 1: Gross Margin 45%... Row 10: Cash runway 4 months...",
        evidence_type="financials",
        metadata_json='{"tabs": 3}',
        deck_version=1
    )
    
    db.add(ev1)
    db.add(ev2)
    db.commit()

    ev_id1 = ev1.id
    ev_id2 = ev2.id

    # 4. Create Claims (Extracted from Evidence)
    c1 = Claim(decision_id=case.id, statement="Company has reached $10k MRR with zero marketing spend.", source_chunk_id=None)
    c2 = Claim(decision_id=case.id, statement="CAC is $50 and LTV is $200.", source_chunk_id=None)
    c3 = Claim(decision_id=case.id, statement="Gross margin is 45%.", source_chunk_id=None)
    c4 = Claim(decision_id=case.id, statement="Cash runway is 4 months.", source_chunk_id=None)
    
    for c in [c1, c2, c3, c4]:
        db.add(c)
    db.commit()

    # 5. Create Assumptions (Synthesized)
    a1 = Assumption(decision_id=case.id, category="Growth", statement="Zero marketing spend MRR growth is sustainable.")
    a2 = Assumption(decision_id=case.id, category="Financial", statement="4 months runway is sufficient to raise the next round.")
    a3 = Assumption(decision_id=case.id, category="Product", statement="Gross margin of 45% will improve at scale.")
    
    for a in [a1, a2, a3]:
        db.add(a)
    db.commit()

    # 6. Create Evidence Conflicts
    conflict1 = EvidenceConflict(
        decision_id=case.id,
        claim_a_id=c1.id,
        claim_b_id=c3.id,
        relationship_type="CONTRADICTS",
        status="OPEN",
        resolution_rationale="High LTV/CAC ratio is unusual with only 45% gross margins. Need to verify variable costs."
    )
    db.add(conflict1)
    db.commit()

    # 7. Create ReviewRun
    review = ReviewRun(
        decision_id=case.id,
        deck_version=1,
        status="Completed",
        provider="anthropic",
        model="claude-3-5-sonnet",
        duration_ms=15000,
        token_usage_json='{"input": 15000, "output": 2500}'
    )
    db.add(review)
    db.commit()
    
    # 8. Create Recommendation (Investor Review output)
    rec = Recommendation(
        decision_id=case.id,
        reasoning_run_id=1,  # Mock
        recommendation_value="Not ready for investment yet.",
        recommendation_type="Readiness Assessment",
        model_confidence=85,
        status="FINALIZED",
        key_risks_json=json.dumps(["CAC scalability is highly questionable.", "High churn due to integration friction."]),
        missing_information_json=json.dumps(["Proof of integration fixes.", "Paid marketing CAC tests."])
    )
    db.add(rec)
    db.commit()

    # 9. Create Domain Events for metrics
    events = [
        DomainEvent(decision_id=case.id, event_type="UserSignedUp", entity_type="User", created_at=datetime.utcnow() - timedelta(days=2)),
        DomainEvent(decision_id=case.id, event_type="CompanyCreated", entity_type="DecisionSubject", created_at=datetime.utcnow() - timedelta(days=2)),
        DomainEvent(decision_id=case.id, event_type="DeckUploaded", entity_type="Evidence", created_at=datetime.utcnow() - timedelta(days=1)),
        DomainEvent(decision_id=case.id, event_type="ReviewStarted", entity_type="ReviewRun", created_at=datetime.utcnow() - timedelta(hours=1)),
        DomainEvent(decision_id=case.id, event_type="ReviewCompleted", entity_type="ReviewRun", created_at=datetime.utcnow() - timedelta(hours=1)),
    ]
    db.add_all(events)
    db.commit()
    
    print("Demo company Acme AI seeded successfully.")
    db.close()

if __name__ == "__main__":
    seed_demo()
