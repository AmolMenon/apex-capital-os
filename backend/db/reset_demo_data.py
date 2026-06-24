import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db.database import SessionLocal
from db.models import Deal, DemoSeedStatus

def reset_demo_data():
    db = SessionLocal()
    try:
        print("Resetting demo data...")
        
        # Delete all deals marked as demo
        demo_deals = db.query(Deal).filter(Deal.is_demo == True).all()
        for deal in demo_deals:
            db.delete(deal)
            
        # Reset seed status
        status = db.query(DemoSeedStatus).first()
        if status:
            db.delete(status)
            
        db.commit()
        print(f"Deleted {len(demo_deals)} demo deals and reset seed status.")
        
    except Exception as e:
        db.rollback()
        print(f"Error resetting demo data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_demo_data()
