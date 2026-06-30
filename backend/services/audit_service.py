from sqlalchemy.orm import Session
from db.models import AuditLog
import json
from typing import Optional, Dict, Any

class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        action: str,
        entity_type: str,
        user_id: Optional[int] = None,
        entity_id: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> AuditLog:
        """
        Logs a business event to the database audit trail.
        """
        details_json = json.dumps(details) if details else None
        
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            details_json=details_json,
            ip_address=ip_address
        )
        db.add(audit_log)
        db.commit()
        db.refresh(audit_log)
        return audit_log

audit_service = AuditService()
