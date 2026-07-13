
from fastapi import APIRouter
from trust_layer_engine.trust_fixtures import MOCK_TRUST_SCORES, MOCK_PROVENANCE, MOCK_CLAIMS, MOCK_GATES, MOCK_REVIEW_QUEUE
from trust_layer_engine.trust_schemas import ReviewerStatusUpdate

router = APIRouter()

@router.get("/status")
def get_trust_status():
    return {
        "enabled": True,
        "trust_audit_status": "Passed",
        "claims_audited": 142,
        "gate_failures": 1,
        "review_queue_count": len(MOCK_REVIEW_QUEUE)
    }

@router.post("/audit")
def run_trust_audit():
    return {"status": "Audit completed", "issues_found": 1}

@router.get("/scores")
def get_trust_scores():
    return {"scores": MOCK_TRUST_SCORES}

@router.get("/provenance")
def get_provenance():
    return {"provenance": MOCK_PROVENANCE}

@router.get("/claims")
def get_claims():
    return {"claims": MOCK_CLAIMS}

@router.get("/gates")
def get_gates():
    return {"gates": MOCK_GATES}

@router.get("/review-queue")
def get_review_queue():
    return {"queue": MOCK_REVIEW_QUEUE}

@router.post("/review/{output_id}/update")
def update_review_status(output_id: str, payload: ReviewerStatusUpdate):
    for item in MOCK_REVIEW_QUEUE:
        if item["output_id"] == output_id:
            item["review_status"] = payload.reviewer_status
            return {"status": "success", "updated_item": item}
    return {"status": "error", "message": "Not found"}
