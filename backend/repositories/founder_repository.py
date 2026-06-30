from repositories.base import CRUDBase
from db.models import Founder
from schemas.founder import FounderCreate, FounderUpdate

class CRUDFounder(CRUDBase[Founder, FounderCreate, FounderUpdate]):
    pass

founder_repo = CRUDFounder(Founder)
