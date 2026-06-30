from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class CompanyBase(BaseModel):
    name: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    sector: Optional[str] = None
    geography: Optional[str] = None

# Properties to receive on creation
class CompanyCreate(CompanyBase):
    name: str

# Properties to receive on update
class CompanyUpdate(CompanyBase):
    pass

# Properties shared by models stored in DB
class CompanyInDBBase(CompanyBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class CompanyResponse(CompanyInDBBase):
    pass
