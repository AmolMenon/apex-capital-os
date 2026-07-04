import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db.database import SessionLocal
from db.models import Deal
from main import generate_research

def run():
    db = SessionLocal()
    deals = db.query(Deal).all()
    
    for deal in deals:
        print(f"Generating research for {deal.startup_name} (ID: {deal.id})...")
        try:
            generate_research(str(deal.id), db)
            print(f"Success for {deal.startup_name}")
        except Exception as e:
            print(f"Failed for {deal.startup_name}: {e}")

if __name__ == "__main__":
    run()
