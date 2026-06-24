
from pydantic import BaseModel
from typing import List, Optional

class SystemHealth(BaseModel):
    api_health: str
    database_health: str
    llm_health: str
    scraper_health: str

class ErrorLog(BaseModel):
    error_id: str
    route: str
    message: str
    timestamp: str
