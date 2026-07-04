import os
import sys
import json
from datetime import datetime, timedelta

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db.database import SessionLocal, Base, engine
from db.models import (
    DomainPack, ReasoningAgent, DecisionFramework, DecisionSubject, Decision,
    PlatformSourceModel, GraphNode, GraphEdge, Assumption, Prediction, Postmortem, Pattern
)

def seed_demo_data():
    print("Recreating database tables for Phase 4...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding Domain Packs...")
        vc_pack = DomainPack(id="venture_capital", name="Venture Capital", description="Evaluate startup investments.", config_json="{}")
        ma_pack = DomainPack(id="mergers_acquisitions", name="Mergers & Acquisitions", description="Evaluate corporate acquisitions.", config_json="{}")
        db.add_all([vc_pack, ma_pack])
        db.commit()

        print("Seeding Reasoning Agents...")
        agents = [
            ReasoningAgent(id="vc_financial_analyst", domain_pack_id="venture_capital", name="Financial Analyst", system_prompt="You are a VC financial analyst...", capabilities_json="[]"),
            ReasoningAgent(id="vc_market_expert", domain_pack_id="venture_capital", name="Market Expert", system_prompt="You are a VC market expert...", capabilities_json="[]"),
            ReasoningAgent(id="vc_devils_advocate", domain_pack_id="venture_capital", name="Devil's Advocate", system_prompt="Find reasons to pass...", capabilities_json="[]"),
            ReasoningAgent(id="ma_synergy_expert", domain_pack_id="mergers_acquisitions", name="Synergy Expert", system_prompt="Find synergies...", capabilities_json="[]")
        ]
        db.add_all(agents)
        db.commit()

        print("Seeding Decision Frameworks...")
        frameworks = [
            DecisionFramework(id="vc_standard_workflow", domain_pack_id="venture_capital", name="Standard VC Deal Flow", stages_json=json.dumps(["Framing", "Evidence", "Analysis", "Debate", "Execution"])),
            DecisionFramework(id="ma_standard_workflow", domain_pack_id="mergers_acquisitions", name="Standard M&A Flow", stages_json=json.dumps(["Target ID", "Diligence", "Valuation", "Integration Planning"]))
        ]
        db.add_all(frameworks)
        db.commit()

        print("Seeding Decision Subjects & Decisions...")
        # A historical completed decision (for similarity)
        subj_hist = DecisionSubject(id=999, name="OpenRetail", description="SaaS for retail.", metadata_json="{}")
        dec_hist = Decision(id=999, subject_id=999, domain_pack_id="venture_capital", title="Series A in OpenRetail", status="Completed")
        
        # A new decision currently in progress
        subj_curr = DecisionSubject(id=1000, name="BharatVector AI", description="Foundational AI infra.", metadata_json="{}")
        dec_curr = Decision(id=1000, subject_id=1000, domain_pack_id="venture_capital", title="Seed Investment in BharatVector", status="Debate")
        
        db.add_all([subj_hist, subj_curr, dec_hist, dec_curr])
        db.commit()

        print("Seeding Institutional Memory (Assumptions, Predictions, Postmortems, Patterns)...")
        # Historical Postmortem
        postmortem = Postmortem(
            decision_id=999,
            expected_outcome="3x ARR growth in 12 months.",
            actual_outcome="1.5x ARR growth, missed target.",
            decision_quality_score=85, # Good decision process
            outcome_quality_score=40,  # Bad outcome
            went_right="Technical diligence correctly identified strong engineering team.",
            went_wrong="Market expansion assumption failed due to competitor pricing.",
            lessons_json=json.dumps(["Always stress test competitor retaliation in B2B SaaS."])
        )
        db.add(postmortem)

        # Assumptions
        assumptions = [
            Assumption(decision_id=999, category="Market", statement="Competitor will not lower prices.", confidence=60, status="Invalidated", accuracy_score=0.1),
            Assumption(decision_id=1000, category="Technology", statement="LLM inference costs will decrease by 50% YoY.", confidence=80, status="Unverified")
        ]
        db.add_all(assumptions)

        # Predictions
        predictions = [
            Prediction(decision_id=999, agent_id="vc_financial_analyst", target_metric="ARR 12m", expected_value="$10M", confidence=75, actual_result="$6M", error_magnitude=0.4),
            Prediction(decision_id=1000, agent_id="vc_market_expert", target_metric="Market Share", expected_value="15%", confidence=60)
        ]
        db.add_all(predictions)

        # Patterns
        patterns = [
            Pattern(domain_pack_id="venture_capital", pattern_type="Blind Spot", statement="Overestimating B2B SaaS adoption speed in retail.", confidence=92, supporting_decisions_json=json.dumps([999]))
        ]
        db.add_all(patterns)
        db.commit()

        print("Seeding Knowledge Graph...")
        nodes = [
            GraphNode(id="n1", node_type="Decision", decision_id=1000, content="Seed Investment in BharatVector"),
            GraphNode(id="n2", node_type="Assumption", decision_id=1000, content="LLM inference costs decrease 50% YoY"),
            GraphNode(id="n3", node_type="Evidence", decision_id=1000, content="NVIDIA Earnings Call Q3"),
            GraphNode(id="n4", node_type="Pattern", decision_id=None, content="Overestimating SaaS adoption speed")
        ]
        edges = [
            GraphEdge(source_node_id="n3", target_node_id="n2", relationship="SUPPORTS", weight=0.9),
            GraphEdge(source_node_id="n2", target_node_id="n1", relationship="INFLUENCES", weight=1.0),
            GraphEdge(source_node_id="n4", target_node_id="n1", relationship="WARNING_FOR", weight=0.8)
        ]
        db.add_all(nodes)
        db.add_all(edges)
        db.commit()

        print("Phase 4 Demo data seeded successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding demo data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
