from repositories.base import CRUDBase
from db.models import PortfolioCompany
from schemas.portfolio_company import PortfolioCompanyCreate, PortfolioCompanyUpdate

class CRUDPortfolioCompany(CRUDBase[PortfolioCompany, PortfolioCompanyCreate, PortfolioCompanyUpdate]):
    pass

portfolio_company_repo = CRUDPortfolioCompany(PortfolioCompany)
