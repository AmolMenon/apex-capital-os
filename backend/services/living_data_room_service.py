import datetime
import json
from sqlalchemy.orm import Session
from db.models import Decision, Evidence, DomainEvent, ChallengeTask

class LivingDataRoomService:
    def __init__(self, db: Session):
        self.db = db

    def evaluate_staleness(self, decision_id: int):
        """
        Marks documents as stale if they exceed reasonable freshness bounds.
        E.g., financial models > 90 days.
        """
        evidence_list = self.db.query(Evidence).filter(
            Evidence.decision_id == decision_id,
            Evidence.is_stale == False
        ).all()
        
        now = datetime.datetime.utcnow()
        stale_thresholds = {
            "financial_model": datetime.timedelta(days=90),
            "cap_table": datetime.timedelta(days=60),
            "pitch_deck": datetime.timedelta(days=120)
        }
        
        for ev in evidence_list:
            threshold = stale_thresholds.get(ev.evidence_type, datetime.timedelta(days=180))
            if ev.last_modified_at and (now - ev.last_modified_at) > threshold:
                ev.is_stale = True
                
                # Create Domain Event
                event = DomainEvent(
                    decision_id=decision_id,
                    event_type="DocumentMarkedStale",
                    entity_type="Evidence",
                    entity_id=ev.id,
                    actor="System",
                    metadata_json=json.dumps({"reason": f"Exceeded {threshold.days} days freshness."})
                )
                self.db.add(event)
                
                # Create ChallengeTask to prompt founder to fix it
                task = ChallengeTask(
                    decision_id=decision_id,
                    evidence_id=ev.id,
                    task_type="Document Refresh",
                    description=f"The {ev.evidence_type} '{ev.title}' is outdated. Please upload a fresh version.",
                    status="Open"
                )
                self.db.add(task)
                
        self.db.commit()

    def add_evidence(self, decision_id: int, title: str, evidence_type: str, content: str = None, source_url: str = None, actor: str = "Founder"):
        ev = Evidence(
            decision_id=decision_id,
            title=title,
            evidence_type=evidence_type,
            content=content,
            source_url=source_url,
            is_stale=False,
            version=1
        )
        self.db.add(ev)
        self.db.flush()
        
        event = DomainEvent(
            decision_id=decision_id,
            event_type="EvidenceUploaded",
            entity_type="Evidence",
            entity_id=ev.id,
            actor=actor,
            metadata_json=json.dumps({"evidence_type": evidence_type})
        )
        self.db.add(event)
        self.db.commit()
        return ev
