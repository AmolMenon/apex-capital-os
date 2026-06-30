from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class FounderBase(BaseModel):
    pass

# Properties to receive on creation
class FounderCreate(FounderBase):
    pass

# Properties to receive on update
class FounderUpdate(FounderBase):
    pass

# Properties shared by models stored in DB
class FounderInDBBase(FounderBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class FounderResponse(FounderInDBBase):
    pass
