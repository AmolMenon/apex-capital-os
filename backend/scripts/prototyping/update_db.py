import sys, os
sys.path.insert(0, os.path.abspath('.'))
from db.database import engine
from db.models import Base
Base.metadata.create_all(bind=engine)
print("Database schema updated.")
