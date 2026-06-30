from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import RoleEnum, User
from repositories.comment_repository import comment_repo
from schemas.comment import CommentCreate, CommentUpdate, CommentResponse
from auth.dependencies import get_current_active_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[CommentResponse])
def read_comments(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return comment_repo.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=CommentResponse)
def create_comment(
    *,
    db: Session = Depends(get_db),
    obj_in: CommentCreate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    return comment_repo.create(db, obj_in=obj_in)

@router.get("/{id}", response_model=CommentResponse)
def read_comment(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    obj = comment_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Comment not found")
    return obj

@router.put("/{id}", response_model=CommentResponse)
def update_comment(
    *,
    db: Session = Depends(get_db),
    id: int,
    obj_in: CommentUpdate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    obj = comment_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Comment not found")
    obj = comment_repo.update(db=db, db_obj=obj, obj_in=obj_in)
    return obj

@router.delete("/{id}", response_model=CommentResponse)
def delete_comment(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER]))
) -> Any:
    obj = comment_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Comment not found")
    obj = comment_repo.remove(db=db, id=id)
    return obj
