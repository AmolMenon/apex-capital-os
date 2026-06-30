from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class CommentBase(BaseModel):
    pass

# Properties to receive on creation
class CommentCreate(CommentBase):
    pass

# Properties to receive on update
class CommentUpdate(CommentBase):
    pass

# Properties shared by models stored in DB
class CommentInDBBase(CommentBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class CommentResponse(CommentInDBBase):
    pass
