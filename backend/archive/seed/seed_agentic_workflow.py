import sys
import os
import sqlite3

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agentic_workflow_engine.workflow_fixtures import MOCK_WORKFLOW_FIXTURES
from agentic_workflow_engine.agent_orchestrator import orchestrator
import asyncio

def create_tables():
    db_path = "apex_capital.db" if os.path.exists("apex_capital.db") else "backend/apex_capital.db"
    if not os.path.exists(db_path):
        db_path = "apex_capital.db"
    
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS agent_workflow_runs (
        run_id TEXT PRIMARY KEY,
        deal_id TEXT,
        company_name TEXT,
        workflow_mode TEXT,
        status TEXT,
        agents_run TEXT,
        trace TEXT,
        final_report TEXT,
        metadata_blob TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    c.execute("""
    CREATE TABLE IF NOT EXISTS agent_traces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT,
        agent_name TEXT,
        status TEXT,
        output TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()
    conn.close()

async def seed():
    print("Creating tables via sqlite3 directly...")
    create_tables()
    
    print("Seeding workflow fixtures...")
    
    deal_mapping = {
        "Sarvam AI": "1",
        "Zepto": "2",
        "Mistral AI": "3"
    }
    
    for company, deal_id in deal_mapping.items():
        print(f"Running mock orchestrator for {company}...")
        await orchestrator.run_full_workflow(deal_id, company)
        
    print("Agentic Workflow seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed())
