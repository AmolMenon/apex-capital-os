from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class DealBase(BaseModel):
    pass

# Properties to receive on creation
class DealCreate(DealBase):
    pass

# Properties to receive on update
class DealUpdate(DealBase):
    pass

# Properties shared by models stored in DB
class DealInDBBase(DealBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class DealResponse(DealInDBBase):
    pass
