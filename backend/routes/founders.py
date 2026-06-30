from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import RoleEnum, User
from repositories.founder_repository import founder_repo
from schemas.founder import FounderCreate, FounderUpdate, FounderResponse
from auth.dependencies import get_current_active_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[FounderResponse])
def read_founders(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return founder_repo.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=FounderResponse)
def create_founder(
    *,
    db: Session = Depends(get_db),
    obj_in: FounderCreate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    return founder_repo.create(db, obj_in=obj_in)

@router.get("/{id}", response_model=FounderResponse)
def read_founder(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    obj = founder_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Founder not found")
    return obj

@router.put("/{id}", response_model=FounderResponse)
def update_founder(
    *,
    db: Session = Depends(get_db),
    id: int,
    obj_in: FounderUpdate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    obj = founder_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Founder not found")
    obj = founder_repo.update(db=db, db_obj=obj, obj_in=obj_in)
    return obj

@router.delete("/{id}", response_model=FounderResponse)
def delete_founder(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER]))
) -> Any:
    obj = founder_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Founder not found")
    obj = founder_repo.remove(db=db, id=id)
    return obj
