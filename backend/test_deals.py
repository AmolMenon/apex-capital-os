from db.database import SessionLocal
from main import read_deals
db = SessionLocal()
try:
    deals = read_deals(0, 100, db)
    print("SUCCESS: ", len(deals))
except Exception as e:
    print("ERROR: ", e)
