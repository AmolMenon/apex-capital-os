from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import RoleEnum, User
from repositories.company_repository import company_repo
from schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse
from auth.dependencies import get_current_active_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[CompanyResponse])
def read_companies(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return company_repo.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=CompanyResponse)
def create_company(
    *,
    db: Session = Depends(get_db),
    obj_in: CompanyCreate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    return company_repo.create(db, obj_in=obj_in)

@router.get("/{id}", response_model=CompanyResponse)
def read_company(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    obj = company_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Company not found")
    return obj

@router.put("/{id}", response_model=CompanyResponse)
def update_company(
    *,
    db: Session = Depends(get_db),
    id: int,
    obj_in: CompanyUpdate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    obj = company_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Company not found")
    obj = company_repo.update(db=db, db_obj=obj, obj_in=obj_in)
    return obj

@router.delete("/{id}", response_model=CompanyResponse)
def delete_company(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER]))
) -> Any:
    obj = company_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Company not found")
    obj = company_repo.remove(db=db, id=id)
    return obj
