import json
from db.database import SessionLocal, engine
from db.models import Deal, WebResearchBriefModel, WebSourceModel, Base
from web_research_engine.mock_fixtures import MOCK_RESEARCH_BRIEFS

def seed_web_research():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        deals = db.query(Deal).all()
        for deal in deals:
            if deal.startup_name in MOCK_RESEARCH_BRIEFS:
                mock_data = MOCK_RESEARCH_BRIEFS[deal.startup_name]
                
                # Check if it exists
                existing = db.query(WebResearchBriefModel).filter_by(deal_id=deal.id).first()
                if not existing:
                    brief = WebResearchBriefModel(
                        deal_id=deal.id,
                        company_name=mock_data["company_name"],
                        research_mode=mock_data["research_mode"],
                        source_quality_score=mock_data.get("source_quality_score", 0),
                        public_data_confidence=mock_data.get("public_data_confidence", "Unknown"),
                        queries_json=json.dumps(mock_data.get("queries_used", [])),
                        sources_json=json.dumps(mock_data.get("sources_reviewed", [])),
                        claims_json=json.dumps(mock_data.get("claims_extracted", [])),
                        evidence_graph_json=json.dumps(mock_data.get("evidence_graph", [])),
                        conflicts_json=json.dumps(mock_data.get("source_conflicts", [])),
                        unknown_metrics_json=json.dumps(mock_data.get("unknown_private_metrics", [])),
                        synthesis_json=json.dumps(mock_data.get("vc_synthesis", {})),
                        citations_json=json.dumps(mock_data.get("citations", []))
                    )
                    db.add(brief)
        db.commit()
        print("Seeded web research briefs.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_web_research()
