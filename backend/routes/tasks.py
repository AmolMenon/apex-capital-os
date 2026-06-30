from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import RoleEnum, User
from repositories.task_repository import task_repo
from schemas.task import TaskCreate, TaskUpdate, TaskResponse
from auth.dependencies import get_current_active_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[TaskResponse])
def read_tasks(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return task_repo.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=TaskResponse)
def create_task(
    *,
    db: Session = Depends(get_db),
    obj_in: TaskCreate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    return task_repo.create(db, obj_in=obj_in)

@router.get("/{id}", response_model=TaskResponse)
def read_task(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    obj = task_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Task not found")
    return obj

@router.put("/{id}", response_model=TaskResponse)
def update_task(
    *,
    db: Session = Depends(get_db),
    id: int,
    obj_in: TaskUpdate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    obj = task_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Task not found")
    obj = task_repo.update(db=db, db_obj=obj, obj_in=obj_in)
    return obj

@router.delete("/{id}", response_model=TaskResponse)
def delete_task(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER]))
) -> Any:
    obj = task_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Task not found")
    obj = task_repo.remove(db=db, id=id)
    return obj
