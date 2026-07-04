#!/bin/bash
set -e

# Isolated Test Database Bootstrap
# This script creates a fresh database, runs alembic migrations,
# runs the deterministic E2E test against it, and then destroys the database.

cd "$(dirname "$0")/../../"

# 1. Create a temporary fresh database path
TEMP_DB_NAME="test_bootstrap_$(date +%s).db"
export DATABASE_URL="sqlite:///./${TEMP_DB_NAME}"

echo "[Bootstrap] Using temporary database: ${DATABASE_URL}"

# Ensure it doesn't exist
rm -f ${TEMP_DB_NAME}

# 2. Set DATABASE_URL is already done via export.
# 3. Run alembic upgrade head
echo "[Bootstrap] Running database migrations..."
source venv/bin/activate
alembic upgrade head

# 4. Verify the required tables exist
echo "[Bootstrap] Verifying tables exist..."
TABLES=$(sqlite3 ${TEMP_DB_NAME} ".tables")
if [[ $TABLES != *"users"* ]]; then
    echo "[Bootstrap] ERROR: Migration Completeness Failure - 'users' table missing."
    exit 1
fi
echo "[Bootstrap] Verification passed. Tables: $TABLES"

# 5. Run the deterministic E2E test
echo "[Bootstrap] Running Deterministic E2E Test..."
python scripts/experiments/test_deterministic_e2e.py
TEST_RESULT=$?

# 6. Destroy the temporary database
echo "[Bootstrap] Cleaning up temporary database..."
rm -f ${TEMP_DB_NAME}

if [ $TEST_RESULT -eq 0 ]; then
    echo "[Bootstrap] SUCCESS."
else
    echo "[Bootstrap] FAILED."
    exit $TEST_RESULT
fi
