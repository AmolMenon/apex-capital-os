#!/bin/bash
set -e

cd /Users/AmolMenon/.gemini/antigravity/scratch/apex-capital/backend
source venv/bin/activate
export DATABASE_URL="sqlite:///test_mig_forward.db"
export APEX_LLM_MODE="test"
export APEX_REASONING_PROVIDER="mock"
export MOCK_LLM_PROVIDER="1"

# 1. Clean up old DB if any
rm -f test_mig_forward.db

# 2. Upgrade to pre-phase-2
echo "==> Downgrading schema to 7397de62b953 (Pre-Phase-2)..."
alembic upgrade 7397de62b953

# 3. Seed data
echo "==> Seeding pre-Phase-2 data..."
python scripts/experiments/seed_pre_phase2.py

# 4. Upgrade to head
echo "==> Upgrading to HEAD (Phase 2)..."
alembic upgrade head

# 5. Verify records intact and columns exist via Python
echo "==> Verifying columns and data..."
python -c "
from db.database import SessionLocal; 
from db.models import EscalationSignal, DecisionIntegrityEnvelope;
db = SessionLocal();
sig = db.query(EscalationSignal).filter_by(id=1001).first();
assert sig is not None, 'Signal lost!';
assert sig.reason == 'Missing financials', 'Data corrupted!';
assert hasattr(sig, 'evidence_conflict_id'), 'Phase 2 column evidence_conflict_id missing!';
assert hasattr(sig, 'assumption_id'), 'Phase 2 column assumption_id missing!';
print('Pre-existing records are intact and Phase 2 columns exist!')
"

# 6. Evaluate Deterministic e2e on the upgraded DB
echo "==> Running deterministic evaluation..."
python scripts/experiments/test_deterministic_e2e.py
