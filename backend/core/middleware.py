from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import time
from collections import defaultdict
from core.config import settings
from core.logging import logger

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.rate_limit_records = defaultdict(list)
        
    async def dispatch(self, request: Request, call_next):
        if not settings.RATE_LIMIT_ENABLED:
            return await call_next(request)
            
        # Get client IP
        client_ip = request.client.host if request.client else "unknown"
        
        now = time.time()
        # Clean up records older than 1 minute
        self.rate_limit_records[client_ip] = [
            ts for ts in self.rate_limit_records[client_ip] 
            if now - ts < 60
        ]
        
        if len(self.rate_limit_records[client_ip]) >= settings.RATE_LIMIT_PER_MINUTE:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."}
            )
            
        self.rate_limit_records[client_ip].append(now)
        
        response = await call_next(request)
        return response
