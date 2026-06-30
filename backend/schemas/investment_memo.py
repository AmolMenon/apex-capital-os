from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class InvestmentMemoBase(BaseModel):
    pass

# Properties to receive on creation
class InvestmentMemoCreate(InvestmentMemoBase):
    pass

# Properties to receive on update
class InvestmentMemoUpdate(InvestmentMemoBase):
    pass

# Properties shared by models stored in DB
class InvestmentMemoInDBBase(InvestmentMemoBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class InvestmentMemoResponse(InvestmentMemoInDBBase):
    pass
