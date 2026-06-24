from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from db.database import get_db
from db.models import User, Workspace
from core.config import settings
from auth.jwt import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    if not settings.ENABLE_AUTH:
        # Mock user for local/demo mode
        demo_user = db.query(User).filter(User.email == "demo@apexcapital.com").first()
        if not demo_user:
            demo_user = User(email="demo@apexcapital.com", name="Demo Admin", role="admin")
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
        return demo_user

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_workspace(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> Workspace:
    if not settings.ENABLE_AUTH:
        # Fallback to demo workspace when auth is disabled
        workspace = db.query(Workspace).filter(Workspace.name == "Demo Workspace").first()
        if not workspace:
            workspace = Workspace(name="Demo Workspace")
            db.add(workspace)
            db.commit()
            db.refresh(workspace)
        return workspace

    from db.models import WorkspaceMember
    member = db.query(WorkspaceMember).filter(WorkspaceMember.user_id == current_user.id).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="User does not belong to any workspace")
        
    workspace = db.query(Workspace).filter(Workspace.id == member.workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    return workspace
