from repositories.base import CRUDBase
from db.models import Company
from schemas.company import CompanyCreate, CompanyUpdate

class CRUDCompany(CRUDBase[Company, CompanyCreate, CompanyUpdate]):
    pass

company_repo = CRUDCompany(Company)
