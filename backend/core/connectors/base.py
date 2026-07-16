from abc import ABC, abstractmethod
from typing import Dict, Any, List
from core.events import event_bus

class BaseConnector(ABC):
    """
    Base abstraction for all Intelligence Connectors.
    Every connector must normalize external intelligence into canonical DomainEvents.
    """
    
    @property
    @abstractmethod
    def connector_name(self) -> str:
        pass

    @abstractmethod
    async def fetch_intelligence(self) -> List[Dict[str, Any]]:
        """
        Fetch raw intelligence from the source.
        Returns a list of raw data dictionaries.
        """
        pass

    @abstractmethod
    def normalize_to_events(self, raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Normalize raw data into canonical event payloads.
        Returns a list of event payloads.
        """
        pass

    async def execute(self):
        """
        Standard execution flow: Fetch -> Normalize -> Publish
        """
        print(f"[{self.connector_name}] Starting execution...")
        raw_data = await self.fetch_intelligence()
        events = self.normalize_to_events(raw_data)
        
        for event in events:
            await event_bus.publish(
                event_type=event.get("event_type", "INTELLIGENCE_DISCOVERED"),
                entity_type=event.get("entity_type", "Unknown"),
                entity_id=event.get("entity_id"),
                actor=self.connector_name,
                metadata=event.get("metadata", {})
            )
            
        print(f"[{self.connector_name}] Execution complete. Dispatched {len(events)} events.")
