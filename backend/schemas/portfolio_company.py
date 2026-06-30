from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class PortfolioCompanyBase(BaseModel):
    pass

# Properties to receive on creation
class PortfolioCompanyCreate(PortfolioCompanyBase):
    pass

# Properties to receive on update
class PortfolioCompanyUpdate(PortfolioCompanyBase):
    pass

# Properties shared by models stored in DB
class PortfolioCompanyInDBBase(PortfolioCompanyBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class PortfolioCompanyResponse(PortfolioCompanyInDBBase):
    pass
