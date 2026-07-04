
from fastapi import APIRouter
from observability_engine.observability_fixtures import MOCK_SYSTEM_HEALTH, MOCK_ERRORS, MOCK_PROVIDER_HEALTH, MOCK_FEATURE_HEALTH

router = APIRouter()

@router.get("/status")
def get_obs_status():
    return {
        "api_health": "Healthy",
        "provider_health": "Mock",
        "fallback_events": 15,
        "error_count": 1
    }

@router.get("/health")
def get_health():
    return MOCK_SYSTEM_HEALTH

@router.get("/errors")
def get_errors():
    return {"errors": MOCK_ERRORS}

@router.get("/provider-health")
def get_provider_health():
    return {"providers": MOCK_PROVIDER_HEALTH}

@router.get("/feature-health")
def get_feature_health():
    return {"features": MOCK_FEATURE_HEALTH}

@router.post("/route-check")
def run_route_check():
    return {"status": "All routes healthy"}

@router.post("/demo-flow-check")
def run_demo_flow_check():
    return {"status": "Demo flow healthy"}
