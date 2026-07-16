import json
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Evidence, Recommendation
from core.events import event_bus

async def handle_intelligence_event(payload: dict):
    """
    Acts as the autonomous intelligence agent.
    When a domain event arrives, it updates Evidence and potentially bumps Recommendation versions.
    """
    db: Session = SessionLocal()
    try:
        # Assuming entity_id corresponds to a decision_id (deal ID) for this context
        decision_id = payload.get("entity_id")
        
        # 1. Always create Evidence
        metadata = payload.get("metadata", {})
        evidence = Evidence(
            decision_id=decision_id,
            title=metadata.get("headline", payload.get("event_type", "New Intelligence")),
            content=metadata.get("summary", ""),
            source_url=metadata.get("source", ""),
            evidence_type=payload.get("event_type", "UNKNOWN"),
            metadata_json=json.dumps(metadata)
        )
        db.add(evidence)
        
        # 2. Update Recommendation if it's a material signal
        impact = metadata.get("impact_assessment", "NEUTRAL")
        if impact in ["MATERIAL_UPDATE", "NEGATIVE_SIGNAL", "POSITIVE_SIGNAL"]:
            latest_rec = db.query(Recommendation).filter_by(decision_id=decision_id).order_by(Recommendation.version.desc()).first()
            if latest_rec:
                new_version = latest_rec.version + 1
                
                increased_reasons = latest_rec.reasons_confidence_increased_json
                decreased_reasons = latest_rec.reasons_confidence_decreased_json
                
                if impact == "POSITIVE_SIGNAL":
                    reasons = json.loads(increased_reasons) if increased_reasons else []
                    reasons.append(metadata.get("headline", "Positive signal detected"))
                    increased_reasons = json.dumps(reasons)
                elif impact == "NEGATIVE_SIGNAL":
                    reasons = json.loads(decreased_reasons) if decreased_reasons else []
                    reasons.append(metadata.get("headline", "Negative signal detected"))
                    decreased_reasons = json.dumps(reasons)

                new_rec = Recommendation(
                    decision_id=decision_id,
                    recommendation_value=latest_rec.recommendation_value,
                    recommendation_type=latest_rec.recommendation_type,
                    model_confidence=latest_rec.model_confidence,
                    status=latest_rec.status,
                    version=new_version,
                    triggering_event_id=payload["id"],
                    reasons_confidence_increased_json=increased_reasons,
                    reasons_confidence_decreased_json=decreased_reasons
                )
                db.add(new_rec)
                
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error handling intelligence event: {e}")
    finally:
        db.close()

def setup_intelligence_engine():
    """Register the intelligence handler for all relevant domain events."""
    event_types = [
        "NEWS_UPDATE", 
        "ENGINEERING_VELOCITY_UPDATE", 
        "TALENT_SIGNAL", 
        "REGULATORY_FILING", 
        "DOCUMENT_ANALYZED",
        "MARKET_SIGNAL",
        "PORTFOLIO_SIGNAL"
    ]
    for etype in event_types:
        event_bus.register_handler(etype, handle_intelligence_event)
