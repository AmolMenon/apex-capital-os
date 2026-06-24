from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import User, Workspace, WorkspaceMember
from auth.schemas import UserCreate, UserLogin, Token, UserResponse, WorkspaceResponse, WorkspaceCreate
from auth.password import get_password_hash, verify_password
from auth.jwt import create_access_token
from auth.dependencies import get_current_user
from core.config import settings

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if not settings.ENABLE_AUTH:
        raise HTTPException(status_code=400, detail="Authentication is disabled in this environment.")
        
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, name=user.name, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    if not settings.ENABLE_AUTH:
        # Mock token if auth disabled
        return {"access_token": "mock-token-auth-disabled", "token_type": "bearer"}
        
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": str(db_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/workspaces", response_model=list[WorkspaceResponse])
def get_my_workspaces(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    memberships = db.query(WorkspaceMember).filter(WorkspaceMember.user_id == current_user.id).all()
    workspaces = [m.workspace for m in memberships]
    
    # If no workspaces and in demo mode, inject demo workspace
    if not workspaces and not settings.ENABLE_AUTH:
        demo_ws = db.query(Workspace).filter(Workspace.slug == "demo").first()
        if demo_ws:
            return [demo_ws]
            
    return workspaces
