from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class UserBase(BaseModel):
    pass

# Properties to receive on creation
class UserCreate(UserBase):
    pass

# Properties to receive on update
class UserUpdate(UserBase):
    pass

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class UserResponse(UserInDBBase):
    pass
