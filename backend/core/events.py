import asyncio
import json
from typing import Callable, List, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import DomainEvent, PlatformSignalModel, Recommendation, Evidence, Claim

class DomainEventBus:
    """
    Central bus for all intelligence events in the system.
    Follows the Apex 3.0 autonomous architecture.
    """
    def __init__(self):
        self.subscribers: List[asyncio.Queue] = []
        self.event_handlers: Dict[str, List[Callable]] = {}

    def subscribe(self, queue: asyncio.Queue):
        self.subscribers.append(queue)

    def unsubscribe(self, queue: asyncio.Queue):
        if queue in self.subscribers:
            self.subscribers.remove(queue)

    def register_handler(self, event_type: str, handler: Callable):
        if event_type not in self.event_handlers:
            self.event_handlers[event_type] = []
        self.event_handlers[event_type].append(handler)

    async def publish(self, event_type: str, entity_type: str, entity_id: int, actor: str, metadata: dict):
        """
        Publish an event to all streaming subscribers and persist to DB.
        """
        # 1. Persist to DB
        db: Session = SessionLocal()
        try:
            domain_event = DomainEvent(
                event_type=event_type,
                entity_type=entity_type,
                entity_id=entity_id,
                actor=actor,
                metadata_json=json.dumps(metadata)
            )
            db.add(domain_event)
            db.commit()
            db.refresh(domain_event)
            event_id = domain_event.id
            created_at = domain_event.created_at.isoformat()
        except Exception as e:
            db.rollback()
            print(f"Failed to persist event: {e}")
            return
        finally:
            db.close()

        # 2. Construct Payload
        payload = {
            "id": event_id,
            "event_type": event_type,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "actor": actor,
            "metadata": metadata,
            "created_at": created_at
        }

        # 3. Stream to frontend subscribers
        for queue in self.subscribers:
            await queue.put(payload)

        # 4. Trigger backend handlers (e.g., updating recommendations, generating claims)
        handlers = self.event_handlers.get(event_type, [])
        for handler in handlers:
            # Dispatch handler as background task or simply await if fast
            try:
                await handler(payload)
            except Exception as e:
                print(f"Event handler failed for {event_type}: {e}")

# Global singleton
event_bus = DomainEventBus()
