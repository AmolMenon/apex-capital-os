from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import RoleEnum, User
from repositories.investment_memo_repository import investment_memo_repo
from schemas.investment_memo import InvestmentMemoCreate, InvestmentMemoUpdate, InvestmentMemoResponse
from auth.dependencies import get_current_active_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[InvestmentMemoResponse])
def read_investment_memos(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return investment_memo_repo.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=InvestmentMemoResponse)
def create_investment_memo(
    *,
    db: Session = Depends(get_db),
    obj_in: InvestmentMemoCreate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    return investment_memo_repo.create(db, obj_in=obj_in)

@router.get("/{id}", response_model=InvestmentMemoResponse)
def read_investment_memo(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    obj = investment_memo_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="InvestmentMemo not found")
    return obj

@router.put("/{id}", response_model=InvestmentMemoResponse)
def update_investment_memo(
    *,
    db: Session = Depends(get_db),
    id: int,
    obj_in: InvestmentMemoUpdate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    obj = investment_memo_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="InvestmentMemo not found")
    obj = investment_memo_repo.update(db=db, db_obj=obj, obj_in=obj_in)
    return obj

@router.delete("/{id}", response_model=InvestmentMemoResponse)
def delete_investment_memo(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER]))
) -> Any:
    obj = investment_memo_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="InvestmentMemo not found")
    obj = investment_memo_repo.remove(db=db, id=id)
    return obj
