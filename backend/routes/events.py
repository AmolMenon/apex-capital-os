import asyncio
from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
from core.events import event_bus

router = APIRouter()

@router.get("/stream")
async def event_stream(request: Request):
    """
    SSE endpoint for streaming real-time domain events to the frontend.
    """
    async def event_generator():
        # Create a queue specifically for this client connection
        queue = asyncio.Queue()
        event_bus.subscribe(queue)
        try:
            while True:
                # If client closes connection, stop sending events
                if await request.is_disconnected():
                    break

                # Wait for a new event from the bus
                payload = await queue.get()
                
                # Yield the event formatted for SSE
                yield {
                    "event": "message",
                    "data": payload
                }
        except asyncio.CancelledError:
            pass
        finally:
            event_bus.unsubscribe(queue)

    return EventSourceResponse(event_generator())
