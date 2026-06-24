from sqlalchemy.orm import Session
from db.models import Deal, DiligenceRunModel
import datetime
import uuid
import json

class DiligenceRunFixtures:
    @staticmethod
    def seed_runs(db: Session):
        deals = db.query(Deal).all()
        for deal in deals:
            name = getattr(deal, "name", "").lower()
            if not name and hasattr(deal, "company_name"):
                name = deal.company_name.lower()
                
            if "bharatvector" in name:
                DiligenceRunFixtures._create_mock_run(
                    db, deal.id, "BharatVector AI", "completed_with_warnings", "Diligence Required",
                    54, "Not Ready", ["Missing ARR", "Missing Retention", "Missing Cap Table", "Missing Customer References"]
                )
            elif "neuraldesk" in name:
                DiligenceRunFixtures._create_mock_run(
                    db, deal.id, "NeuralDesk", "completed", "Partner Review Ready",
                    78, "Draft Ready", ["Cap table needs manual review"]
                )
            elif "sarvam" in name:
                DiligenceRunFixtures._create_mock_run(
                    db, deal.id, "Sarvam AI", "completed_with_warnings", "Benchmark Only",
                    62, "Not Ready", ["Public data only, no private deal access"]
                )

    @staticmethod
    def _create_mock_run(db: Session, deal_id: int, company_name: str, status: str, rec: str, trust: int, ic: str, blockers: list):
        existing = db.query(DiligenceRunModel).filter(DiligenceRunModel.deal_id == deal_id).first()
        if existing:
            return
            
        run_id = f"run_mock_{uuid.uuid4().hex[:6]}"
        run = DiligenceRunModel(
            id=run_id,
            deal_id=deal_id,
            company_name=company_name,
            started_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2),
            completed_at=datetime.datetime.utcnow() - datetime.timedelta(hours=1),
            status=status,
            mode="mock",
            final_recommendation=rec,
            evidence_confidence="Medium",
            trust_score=trust,
            ic_readiness=ic,
            critical_blockers_json=json.dumps(blockers),
            missing_information_json=json.dumps(blockers),
            next_actions_json=json.dumps(["Review Blockers"]),
            report_json=json.dumps({"company_name": company_name, "decision_state": rec})
        )
        db.add(run)
        db.commit()
