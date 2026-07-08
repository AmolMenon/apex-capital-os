import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from db.database import SessionLocal, engine
from db.models import Decision, DecisionSubject, EscalationSignal, DomainPack

def seed():
    db = SessionLocal()
    
    from sqlalchemy import text
    # We must seed a decision and subject and domain pack using raw SQL
    db.execute(text("INSERT INTO domain_packs (id, name, description, config_json, created_at) VALUES ('mig_pack', 'Migration Pack', '', '{}', '2026-07-01 00:00:00')"))
    db.execute(text("INSERT INTO decision_subjects (id, name, description, metadata_json, created_at) VALUES (1001, 'Migration Subject', '', '{}', '2026-07-01 00:00:00')"))
    db.execute(text("INSERT INTO decisions (id, subject_id, domain_pack_id, title, status, created_at, updated_at) VALUES (1001, 1001, 'mig_pack', 'Pre-Phase-2 Decision', 'In Progress', '2026-07-01 00:00:00', '2026-07-01 00:00:00')"))
    # In pre-phase-2 schema, escalation_signals lacked evidence_conflict_id and assumption_id
    db.execute(text("INSERT INTO escalation_signals (id, decision_id, signal_type, severity, reason, status, created_at) VALUES (1001, 1001, 'MISSING_INFO', 'HIGH', 'Missing financials', 'DETECTED', '2026-07-01 00:00:00')"))
    db.commit()
    print("Pre-Phase-2 data seeded successfully.")

if __name__ == "__main__":
    seed()
