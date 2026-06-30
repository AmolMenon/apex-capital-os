from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import RoleEnum, User
from repositories.portfolio_company_repository import portfolio_company_repo
from schemas.portfolio_company import PortfolioCompanyCreate, PortfolioCompanyUpdate, PortfolioCompanyResponse
from auth.dependencies import get_current_active_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[PortfolioCompanyResponse])
def read_portfolio_companies(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return portfolio_company_repo.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=PortfolioCompanyResponse)
def create_portfolio_company(
    *,
    db: Session = Depends(get_db),
    obj_in: PortfolioCompanyCreate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    return portfolio_company_repo.create(db, obj_in=obj_in)

@router.get("/{id}", response_model=PortfolioCompanyResponse)
def read_portfolio_company(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    obj = portfolio_company_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="PortfolioCompany not found")
    return obj

@router.put("/{id}", response_model=PortfolioCompanyResponse)
def update_portfolio_company(
    *,
    db: Session = Depends(get_db),
    id: int,
    obj_in: PortfolioCompanyUpdate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    obj = portfolio_company_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="PortfolioCompany not found")
    obj = portfolio_company_repo.update(db=db, db_obj=obj, obj_in=obj_in)
    return obj

@router.delete("/{id}", response_model=PortfolioCompanyResponse)
def delete_portfolio_company(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER]))
) -> Any:
    obj = portfolio_company_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="PortfolioCompany not found")
    obj = portfolio_company_repo.remove(db=db, id=id)
    return obj
