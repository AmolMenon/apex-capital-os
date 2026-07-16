import { useEffect, useState } from "react";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_BASE_URL = RAW_API_URL.replace(/\/$/, "");

export interface DomainEvent {
  id: number;
  event_type: string;
  entity_type: string;
  entity_id: number;
  actor: string;
  metadata: any;
  created_at: string;
}

export function useEventStream() {
  const [events, setEvents] = useState<DomainEvent[]>([]);

  useEffect(() => {
    let url = `${API_BASE_URL}/api/v1/events/stream`;
    // Add auth token if needed, though SSE auth via headers is tricky in EventSource.
    // For demo purposes, we will use it directly.
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const parsed: DomainEvent = JSON.parse(event.data);
        setEvents((prev) => [parsed, ...prev]);
      } catch (err) {
        console.error("Failed to parse SSE message", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      // EventSource automatically reconnects, but we can close it if we want.
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return events;
}
