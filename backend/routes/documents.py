from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import RoleEnum, User
from repositories.document_repository import document_repo
from schemas.document import DocumentCreate, DocumentUpdate, DocumentResponse
from auth.dependencies import get_current_active_user, require_roles

router = APIRouter()

@router.get("/", response_model=List[DocumentResponse])
def read_documents(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return document_repo.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=DocumentResponse)
def create_document(
    *,
    db: Session = Depends(get_db),
    obj_in: DocumentCreate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    return document_repo.create(db, obj_in=obj_in)

@router.get("/{id}", response_model=DocumentResponse)
def read_document(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    obj = document_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Document not found")
    return obj

@router.put("/{id}", response_model=DocumentResponse)
def update_document(
    *,
    db: Session = Depends(get_db),
    id: int,
    obj_in: DocumentUpdate,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE]))
) -> Any:
    obj = document_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Document not found")
    obj = document_repo.update(db=db, db_obj=obj, obj_in=obj_in)
    return obj

@router.delete("/{id}", response_model=DocumentResponse)
def delete_document(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER]))
) -> Any:
    obj = document_repo.get(db=db, id=id)
    if not obj:
        raise HTTPException(status_code=404, detail="Document not found")
    obj = document_repo.remove(db=db, id=id)
    return obj
