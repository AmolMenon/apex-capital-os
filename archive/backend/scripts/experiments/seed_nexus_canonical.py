import sys
import os
import json
import argparse

if "DATABASE_URL" not in os.environ:
    os.environ["DATABASE_URL"] = "sqlite:///./test_apex_capital.db"

sys.path.insert(0, os.path.abspath('.'))

from db.database import SessionLocal
from db.models import Decision, DomainPack, ReasoningAgent, DecisionSubject, Claim, Assumption, User
from auth.password import get_password_hash

def seed_test_data(db, scenario="blocked"):
    print(f"Seeding test data ({scenario.upper()} scenario)...")
    
    # Idempotent cleanup of existing items
    db.query(User).filter(User.id == 1).delete()
    db.query(Claim).filter(Claim.id.in_([1, 2, 3])).delete()
    db.query(Assumption).filter(Assumption.id.in_([1, 2, 3])).delete()
    db.query(Decision).filter(Decision.id == 9999).delete()
    db.query(DecisionSubject).filter(DecisionSubject.id == 9999).delete()
    db.query(DomainPack).filter(DomainPack.id == "test_pack").delete()
    db.query(ReasoningAgent).filter(ReasoningAgent.id == "test_agent").delete()
    
    from db.models import EvidenceConflict, GraphNode, GraphEdge, ChallengeTask, EscalationSignal, ChallengeFinding
    db.query(EvidenceConflict).filter(EvidenceConflict.decision_id == 9999).delete()
    # Ensure downstream states are removed so evaluation creates them
    db.query(ChallengeFinding).filter(ChallengeFinding.decision_id == 9999).delete()
    db.query(ChallengeTask).filter(ChallengeTask.decision_id == 9999).delete()
    db.query(EscalationSignal).filter(EscalationSignal.decision_id == 9999).delete()
    
    from db.models import Recommendation, DecisionIntegrityEnvelope, HumanDecisionRecord
    db.query(HumanDecisionRecord).filter(HumanDecisionRecord.decision_id == 9999).delete()
    db.query(DecisionIntegrityEnvelope).filter(DecisionIntegrityEnvelope.decision_id == 9999).delete()
    db.query(Recommendation).filter(Recommendation.decision_id == 9999).delete()
    
    db.commit()

    test_user = User(id=1, email="test@apex.vc", hashed_password=get_password_hash("testpassword123"), name="Test User", role="admin", is_active=True)
    pack = DomainPack(id="test_pack", name="Venture Capital SaaS", description="SaaS Evaluation", config_json="{}")
    agent = ReasoningAgent(id="test_agent", domain_pack_id="test_pack", name="Apex Reasoning Engine", system_prompt="Test", capabilities_json="[]")
    
    metadata = {
        "sector": "Data Infrastructure",
        "stage": "Series A",
        "round_size": "$15M",
        "valuation": "$75M Pre-money",
        "lead_investor": "TBD"
    }
    subject = DecisionSubject(id=9999, name="Nexus Data Systems", description="The unified control plane for multi-cloud AI data pipelines.", metadata_json=json.dumps(metadata))
    decision = Decision(id=9999, subject_id=9999, domain_pack_id="test_pack", title="Nexus Data Systems - Series A Investment", status="Debate")
    
    db.add_all([test_user, pack, agent, subject, decision])
    db.commit()
    
    c1 = Claim(id=1, decision_id=9999, statement="Nexus generated $8.0M in ARR last year.", provenance_type="Extracted from Pitch Deck")
    c3 = Claim(id=3, decision_id=9999, statement="No single customer accounts for more than 15% of total revenue.", provenance_type="Extracted from Management Narrative")
    a1 = Assumption(id=1, decision_id=9999, statement="Net Dollar Retention (NDR) exceeds 120% YoY.", confidence=40, status="Unverified")
    a2 = Assumption(id=2, decision_id=9999, statement="Management asserts a robust $20M qualified sales pipeline.", confidence=50, status="Unverified")
    
    items_to_add = [c1, c3, a1, a2]
    
    if scenario == "blocked":
        c2 = Claim(id=2, decision_id=9999, statement="Audited financials support $5.4M in recognized recurring revenue.", provenance_type="Extracted from Financials Footnote")
        items_to_add.append(c2)
    else:
        # Clear scenario
        c2 = Claim(id=2, decision_id=9999, statement="Audited financials support $8.0M in recognized recurring revenue.", provenance_type="Extracted from Financials Footnote")
        items_to_add.append(c2)
        
    db.add_all(items_to_add)
    db.commit()

    if scenario == "blocked":
        conflict = EvidenceConflict(
            decision_id=9999,
            claim_a_id=c1.id,
            claim_b_id=c2.id,
            relationship_type="CONTRADICTS",
            resolution_status="Unresolved"
        )
        db.add(conflict)
        db.commit()

    from services.graph_service import GraphService
    for c in [c1, c2, c3]:
        GraphService.upsert_node(db, 9999, "Claim", c.id, c.statement)
    for a in [a1, a2]:
        GraphService.upsert_node(db, 9999, "Assumption", a.id, a.statement)
    db.commit()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed Canonical Nexus Data Systems Scenario")
    parser.add_argument('--scenario', choices=['blocked', 'clear'], default='blocked', help="Which scenario to seed")
    args = parser.parse_args()
    
    db = SessionLocal()
    seed_test_data(db, scenario=args.scenario)
    db.close()
