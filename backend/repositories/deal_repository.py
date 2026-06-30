from repositories.base import CRUDBase
from db.models import Deal
from schemas.deal import DealCreate, DealUpdate

class CRUDDeal(CRUDBase[Deal, DealCreate, DealUpdate]):
    pass

deal_repo = CRUDDeal(Deal)
