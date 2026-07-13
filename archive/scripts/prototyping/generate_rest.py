import os

entities = [
    {"name": "Company", "lower": "company", "plural": "companies"},
    {"name": "Deal", "lower": "deal", "plural": "deals"},
    {"name": "Founder", "lower": "founder", "plural": "founders"},
    {"name": "Document", "lower": "document", "plural": "documents"},
    {"name": "InvestmentMemo", "lower": "investment_memo", "plural": "investment_memos"},
    {"name": "PortfolioCompany", "lower": "portfolio_company", "plural": "portfolio_companies"},
    {"name": "Comment", "lower": "comment", "plural": "comments"},
    {"name": "Task", "lower": "task", "plural": "tasks"},
    {"name": "User", "lower": "user", "plural": "users"},
]

os.makedirs("backend/schemas", exist_ok=True)
os.makedirs("backend/routes", exist_ok=True)
os.makedirs("backend/repositories", exist_ok=True)

# Generate Base __init__.py files
open("backend/schemas/__init__.py", "w").close()
open("backend/repositories/__init__.py", "w").close()
open("backend/routes/__init__.py", "w").close()

for ent in entities:
    name = ent["name"]
    lower = ent["lower"]
    plural = ent["plural"]
    
    # 1. Generate Schema
    schema_content = f"""from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class {name}Base(BaseModel):
    pass

# Properties to receive on creation
class {name}Create({name}Base):
    pass

# Properties to receive on update
class {name}Update({name}Base):
    pass

# Properties shared by models stored in DB
class {name}InDBBase({name}Base):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Properties to return to client
class {name}Response({name}InDBBase):
    pass
"""
    with open(f"backend/schemas/{lower}.py", "w") as f:
        f.write(schema_content)
        
    # 2. Generate Repository
    repo_content = f"""from repositories.base import CRUDBase
from db.models import {name}
from schemas.{lower} import {name}Create, {name}Update

class CRUD{name}(CRUDBase[{name}, {name}Create, {name}Update]):
    pass

{lower}_repo = CRUD{name}({name})
"""
    with open(f"backend/repositories/{lower}_repository.py", "w") as f:
        f.write(repo_content)
        
    # 3. Generate Route
    route_content = f"""from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import RoleEnum, User
from repositories.{lower}_repository import {lower}_repo
from schemas.{lower} import {name}Create, {name}Update, {name}Response
from auth.dependencies import get_current_active_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[{name}Response])
def read_{plural}(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return {lower}_repo.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model={name}Response)
def create_{lower}(
    *,
    db: Session = Depends(get_db),
    obj_in: {name}Create,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    return {lower}_repo.create(db, obj_in=obj_in)

@router.get("/{{id}}", response_model={name}Response)
def read_{lower}(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    obj = {lower}_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="{name} not found")
    return obj

@router.put("/{{id}}", response_model={name}Response)
def update_{lower}(
    *,
    db: Session = Depends(get_db),
    id: int,
    obj_in: {name}Update,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    obj = {lower}_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="{name} not found")
    obj = {lower}_repo.update(db=db, db_obj=obj, obj_in=obj_in)
    return obj

@router.delete("/{{id}}", response_model={name}Response)
def delete_{lower}(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER]))
) -> Any:
    obj = {lower}_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="{name} not found")
    obj = {lower}_repo.remove(db=db, id=id)
    return obj
"""
    with open(f"backend/routes/{plural}.py", "w") as f:
        f.write(route_content)

print("Schemas, Repositories, and Routes generated.")
