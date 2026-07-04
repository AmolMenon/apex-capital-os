import sqlite3

conn = sqlite3.connect('backend/apex_capital.db')
c = conn.cursor()

try:
    c.execute("ALTER TABLE decisions ADD COLUMN base_analysis_calls INTEGER DEFAULT 0")
    c.execute("ALTER TABLE decisions ADD COLUMN challenge_calls INTEGER DEFAULT 0")
    c.execute("ALTER TABLE decisions ADD COLUMN synthesis_calls INTEGER DEFAULT 0")
    c.execute("ALTER TABLE decisions ADD COLUMN grader_calls INTEGER DEFAULT 0")
    c.execute("ALTER TABLE decisions ADD COLUMN input_tokens INTEGER DEFAULT 0")
    c.execute("ALTER TABLE decisions ADD COLUMN output_tokens INTEGER DEFAULT 0")
    c.execute("ALTER TABLE decisions ADD COLUMN latency_ms INTEGER DEFAULT 0")
    c.execute("ALTER TABLE decisions ADD COLUMN escalation_reason TEXT")
    c.execute("ALTER TABLE decisions ADD COLUMN avoided_full_deliberation_estimate INTEGER DEFAULT 0")
except Exception as e:
    print(e)
    
conn.commit()
conn.close()
print("DB patched.")
