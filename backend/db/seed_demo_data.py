import os
import sys
import json
from datetime import datetime, timedelta

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db.database import SessionLocal
from db.models import Deal, DemoSeedStatus, DiligenceRunModel, OperationTask, ICPacket, DealWarRoomModel

def seed_demo_data():
    db = SessionLocal()
    try:
        status = db.query(DemoSeedStatus).first()
        if status and status.is_seeded:
            print("Demo data already seeded. Skipping.")
            return

        print("Seeding demo data...")

        deals_data = [
            {
                "id": 999,
                "startup_name": "BharatVector AI",
                "sector": "AI Infrastructure",
                "stage": "Pre-Seed",
                "business_model": "B2B SaaS / API",
                "status": "Diligence",
                "is_demo": True,
                "recommendation": "Diligence Required",
                "evidence_confidence": "Medium",
                "trust_score": 54,
                "ic_readiness": "Not Ready",
                "description": "Building the foundational AI infrastructure for India's 1B+ non-English speakers."
            },
            {
                "id": 1000,
                "startup_name": "NeuralDesk",
                "sector": "Enterprise SaaS",
                "stage": "Seed",
                "business_model": "B2B SaaS",
                "status": "Diligence",
                "is_demo": True,
                "recommendation": "Partner Review Ready",
                "evidence_confidence": "High",
                "trust_score": 78,
                "ic_readiness": "Draft Ready",
                "description": "AI-first helpdesk for modern teams."
            },
            {
                "id": 1001,
                "startup_name": "Sarvam AI",
                "sector": "AI Foundation Models",
                "stage": "Series A",
                "business_model": "API",
                "status": "Screening",
                "is_demo": True,
                "recommendation": "Benchmark Only",
                "evidence_confidence": "Low",
                "trust_score": 62,
                "ic_readiness": "Not Ready",
                "description": "Developing large language models for Indian languages."
            },
            {
                "id": 1002,
                "startup_name": "Zepto",
                "sector": "Quick Commerce",
                "stage": "Growth",
                "business_model": "B2C E-commerce",
                "status": "Watchlist",
                "is_demo": True,
                "description": "10-minute grocery delivery."
            },
            {
                "id": 1003,
                "startup_name": "KlinikOS",
                "sector": "HealthTech",
                "stage": "Seed",
                "business_model": "SaaS",
                "status": "New",
                "is_demo": True,
                "description": "Operating system for independent clinics."
            }
        ]

        for data in deals_data:
            deal = db.query(Deal).filter(Deal.id == data["id"]).first()
            if not deal:
                deal = Deal(**data)
                db.add(deal)
                db.commit()
                db.refresh(deal)
                
                # Create a mock diligence run for BharatVector and NeuralDesk
                if deal.startup_name in ["BharatVector AI", "NeuralDesk"]:
                    blockers = ["Missing ARR", "Missing Cap Table"] if deal.startup_name == "BharatVector AI" else ["Cap table needs manual review"]
                    run = DiligenceRunModel(
                        id=f"run_mock_{deal.id}",
                        deal_id=deal.id,
                        company_name=deal.startup_name,
                        started_at=datetime.utcnow() - timedelta(hours=2),
                        completed_at=datetime.utcnow() - timedelta(hours=1),
                        status="completed_with_warnings" if deal.startup_name == "BharatVector AI" else "completed",
                        mode="mock",
                        final_recommendation=data.get("recommendation"),
                        evidence_confidence=data.get("evidence_confidence"),
                        trust_score=data.get("trust_score"),
                        ic_readiness=data.get("ic_readiness"),
                        critical_blockers_json=json.dumps(blockers),
                        missing_information_json=json.dumps(blockers),
                        next_actions_json=json.dumps(["Review Blockers"]),
                        report_json=json.dumps({"company_name": deal.startup_name, "decision_state": data.get("recommendation")})
                    )
                    db.add(run)

                    # Task
                    task = OperationTask(
                        id=f"task_mock_{deal.id}",
                        deal_id=deal.id,
                        source_module="DiligenceRun",
                        title=f"Verify claims for {deal.startup_name}",
                        description="IC Packet indicates critical blockers.",
                        owner="Analyst",
                        priority="High",
                        status="not_started"
                    )
                    db.add(task)
                    
                    db.commit()

        # Mark seeded
        new_status = DemoSeedStatus(is_seeded=True)
        db.add(new_status)
        db.commit()

        print("Demo data seeded successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding demo data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
