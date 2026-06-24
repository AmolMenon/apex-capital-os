import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from db.database import SessionLocal
from models.deal import Deal
import json

db = SessionLocal()
deal = db.query(Deal).filter(Deal.id == 999).first()
if not deal:
    deal = Deal(
        id=999,
        startup_name='BharatVector AI',
        sector='Enterprise AI',
        stage='Seed',
        status='triage',
        deal_lead='Partner A',
        description='Building regional-language enterprise AI infrastructure for Indian businesses.',
        website='https://bharatvector.ai',
        metrics=json.dumps({"ARR": "$0M", "Pilots": "3"}),
        score=92
    )
    db.add(deal)
    db.commit()
    print("BharatVector AI added to DB with ID 999.")
else:
    print("BharatVector AI already in DB with ID 999.")
