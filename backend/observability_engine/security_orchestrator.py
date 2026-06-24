
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class RoleUpdate(BaseModel):
    role: str

MOCK_RBAC = {
    "current_role": "Partner",
    "available_roles": ["Analyst", "Associate", "Partner", "Operating Partner", "Fund Admin", "LP Viewer", "Demo Viewer"]
}

@router.get("/status")
def get_security_status():
    return {
        "rbac_mode": "mock",
        "secrets_safe": True,
        "upload_restrictions": "Enforced",
        "external_integrations": "Safe (Mock)"
    }

@router.get("/rbac")
def get_rbac():
    return MOCK_RBAC

@router.post("/role-switch")
def switch_role(payload: RoleUpdate):
    MOCK_RBAC["current_role"] = payload.role
    return {"status": "success", "new_role": payload.role}
