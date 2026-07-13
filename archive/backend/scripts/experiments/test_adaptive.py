import sys, os, json
os.environ["DATABASE_URL"] = "sqlite:///backend/test_apex_capital.db"
os.environ["APEX_REASONING_PROVIDER"] = "mock"
sys.path.insert(0, os.path.abspath('backend'))
from db.database import SessionLocal, engine
from db.models import Decision, Base
Base.metadata.create_all(bind=engine)

from reasoning_engine.adaptive_controller import AdaptiveReasoningController

db = SessionLocal()
# Pick decision 1
decision = db.query(Decision).filter(Decision.id == 1).first()
if decision:
    print(f"Testing Decision {decision.id}...")
    try:
        controller = AdaptiveReasoningController(db)
        out = controller.evaluate_decision_adaptive(decision.id)
        print("Success! Output:", out[:500])
    except Exception as e:
        import traceback
        traceback.print_exc()
else:
    print("No decisions found in DB.")
