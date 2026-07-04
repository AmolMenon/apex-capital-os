import asyncio
from db.database import SessionLocal
from database import crud
from analysis_engine.analyst_orchestrator import AnalystOrchestrator

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
        print("Success!", list(res.keys()))
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(main())
