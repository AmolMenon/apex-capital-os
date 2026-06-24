import asyncio
from db.database import SessionLocal
from database import crud
from analysis_engine.analyst_orchestrator import AnalystOrchestrator
import json

async def main():
    db = SessionLocal()
    deal_id = 1004
    deal = crud.get_deal(db, deal_id=deal_id)
    print("Deal:", deal.startup_name)
    deal_dict = {
        "id": deal.id,
        "startup_name": deal.startup_name,
        "sector": deal.sector,
        "description": deal.description,
        "revenue": deal.revenue,
        "metrics": deal.description
    }
    orchestrator = AnalystOrchestrator()
    try:
        res = await orchestrator.run_full_analysis(deal_id, deal_dict)
        print("Generated keys:", list(res.keys()))
        crud.create_deal_analysis(db, full_analysis_json=json.dumps(res), deal_id=deal_id)
        crud.update_deal_status(db, deal_id, "Screening")
        print("Saved successfully!")
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(main())
