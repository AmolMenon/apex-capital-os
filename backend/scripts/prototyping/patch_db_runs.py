import sqlite3

conn = sqlite3.connect('backend/apex_capital.db')
c = conn.cursor()

columns = [
    "experiment_batch_id TEXT",
    "grading_status TEXT DEFAULT 'PENDING'",
    "grader_failure_reason TEXT",
    "evaluation_run_id TEXT",
    "case_id TEXT",
    "domain_pack_id TEXT",
    "evaluation_path TEXT",
    "prompt_version TEXT",
    "stage_status TEXT DEFAULT 'STARTED'",
    "accumulated_cost REAL DEFAULT 0.0"
]

for col in columns:
    try:
        c.execute(f"ALTER TABLE reasoning_runs ADD COLUMN {col}")
    except Exception as e:
        print(f"Error adding {col}: {e}")
    
conn.commit()
conn.close()
print("DB runs patched.")
