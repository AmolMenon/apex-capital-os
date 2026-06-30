import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from auth.jwt_handler import decode_access_token
from jose import JWTError

logger = logging.getLogger("apex_audit")

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Try to identify the user making the request
        user_id = "anonymous"
        role = "none"
        
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                token_data = decode_access_token(token)
                user_id = token_data.user_id
                role = token_data.role
            except JWTError:
                pass
                
        response = await call_next(request)
        
        process_time = (time.time() - start_time) * 1000
        
        log_dict = {
            "method": request.method,
            "url": str(request.url.path),
            "status_code": response.status_code,
            "latency_ms": round(process_time, 2),
            "user_id": user_id,
            "role": role,
            "client_ip": request.client.host if request.client else "unknown"
        }
        
        logger.info(f"API_REQUEST: {log_dict}")
        
        return response
