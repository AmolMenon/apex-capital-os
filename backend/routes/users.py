from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import RoleEnum, User
from repositories.user_repository import user_repo
from schemas.user import UserCreate, UserUpdate, UserResponse
from auth.dependencies import get_current_active_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return user_repo.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=UserResponse)
def create_user(
    *,
    db: Session = Depends(get_db),
    obj_in: UserCreate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    return user_repo.create(db, obj_in=obj_in)

@router.get("/{id}", response_model=UserResponse)
def read_user(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    obj = user_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="User not found")
    return obj

@router.put("/{id}", response_model=UserResponse)
def update_user(
    *,
    db: Session = Depends(get_db),
    id: int,
    obj_in: UserUpdate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    obj = user_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="User not found")
    obj = user_repo.update(db=db, db_obj=obj, obj_in=obj_in)
    return obj

@router.delete("/{id}", response_model=UserResponse)
def delete_user(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER]))
) -> Any:
    obj = user_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="User not found")
    obj = user_repo.remove(db=db, id=id)
    return obj
