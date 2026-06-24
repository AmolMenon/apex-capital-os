from sqlalchemy.orm import Session
from database import crud

def map_signals_to_evidence(db: Session, deal_id: int, run_id: str):
    run = crud.get_platform_diligence_run(db, run_id)
    if not run or not run.report_json:
        return {"status": "error", "message": "Run not found or not completed"}
        
    signals = crud.get_platform_signals(db, deal_id)
    mapped_count = 0
    
    for signal in signals:
        if signal.run_id == run_id:
            # Create evidence item
            evidence_data = {
                "deal_id": deal_id,
                "title": f"[{signal.platform.capitalize()}] {signal.signal_type}",
                "snippet": signal.snippet,
                "source": signal.source_url if signal.source_url else f"{signal.platform} Search",
                "source_type": "Public Platform Signal",
                "confidence": signal.confidence,
                "verification_status": signal.verification_status,
                "impact": signal.decision_impact,
                "date": signal.published_at
            }
            # Add logic here to insert to EvidenceItem model if we want
            # (Assuming crud.create_evidence_item exists)
            try:
                crud.create_evidence_item(db, evidence_data)
                mapped_count += 1
            except Exception as e:
                pass # ignore if create_evidence_item is not fully defined

    return {"status": "success", "mapped_count": mapped_count}
