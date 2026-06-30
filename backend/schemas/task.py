from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class TaskBase(BaseModel):
    pass

# Properties to receive on creation
class TaskCreate(TaskBase):
    pass

# Properties to receive on update
class TaskUpdate(TaskBase):
    pass

# Properties shared by models stored in DB
class TaskInDBBase(TaskBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class TaskResponse(TaskInDBBase):
    pass
