from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class DocumentBase(BaseModel):
    pass

# Properties to receive on creation
class DocumentCreate(DocumentBase):
    pass

# Properties to receive on update
class DocumentUpdate(DocumentBase):
    pass

# Properties shared by models stored in DB
class DocumentInDBBase(DocumentBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class DocumentResponse(DocumentInDBBase):
    pass
