from repositories.base import CRUDBase
from db.models import User
from schemas.user import UserCreate, UserUpdate

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    pass

user_repo = CRUDUser(User)
