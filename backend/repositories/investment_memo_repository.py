from repositories.base import CRUDBase
from db.models import InvestmentMemo
from schemas.investment_memo import InvestmentMemoCreate, InvestmentMemoUpdate

class CRUDInvestmentMemo(CRUDBase[InvestmentMemo, InvestmentMemoCreate, InvestmentMemoUpdate]):
    pass

investment_memo_repo = CRUDInvestmentMemo(InvestmentMemo)
