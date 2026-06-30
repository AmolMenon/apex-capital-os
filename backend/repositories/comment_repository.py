from repositories.base import CRUDBase
from db.models import Comment
from schemas.comment import CommentCreate, CommentUpdate

class CRUDComment(CRUDBase[Comment, CommentCreate, CommentUpdate]):
    pass

comment_repo = CRUDComment(Comment)
