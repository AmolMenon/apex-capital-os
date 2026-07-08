from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from auth.jwt_handler import decode_access_token
from db.database import get_db
from db.models import User, RoleEnum
from core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login", auto_error=False)

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    if not settings.ENABLE_AUTH:
        return User(id=1, email="demo@apexcapital.com", name="Demo User", role="Admin", is_active=True)
        
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    token_data = decode_access_token(token)
    user = db.query(User).filter(User.id == int(token_data.user_id)).first()
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

def require_roles(allowed_roles: list[RoleEnum]):
    def role_checker(current_user: User = Depends(get_current_active_user)):
        if current_user.role not in [role.value for role in allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted for your role"
            )
        return current_user
    return role_checker

# Predefined dependencies
require_admin = require_roles([RoleEnum.ADMIN])
require_partner = require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER])
require_principal = require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL])
require_associate = require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE])
require_analyst = require_roles([RoleEnum.ADMIN, RoleEnum.PARTNER, RoleEnum.PRINCIPAL, RoleEnum.ASSOCIATE, RoleEnum.ANALYST])
