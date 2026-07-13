import asyncio
from db.database import SessionLocal
from database import crud
from analysis_engine.analyst_orchestrator import AnalystOrchestrator
import schemas
import json

async def main():
    db = SessionLocal()
    deal_id = 1004
    deal = crud.get_deal(db, deal_id=deal_id)
    try:
        if deal.analysis:
            data = json.loads(deal.analysis.full_analysis_json)
            analysis = schemas.FullAnalysisOutput(**data)
            print("Schema mapped successfully!")
        else:
            print("No analysis found in DB")
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(main())
