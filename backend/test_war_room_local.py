import sys
sys.path.append('.')
from db.database import SessionLocal
from deal_war_room_engine.war_room_orchestrator import run_deal_war_room
db = SessionLocal()
try:
    run_deal_war_room(1, db)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
