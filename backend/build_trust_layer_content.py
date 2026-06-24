import os

trust_schemas_content = """
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ClaimAuditRecord(BaseModel):
    claim_text: str
    claim_type: str # e.g., verified public fact, assumption, unknown
    source: str
    confidence: str
    verification_status: str
    decision_relevance: str
    risk_if_wrong: str
    reviewer_required: bool

class TrustScore(BaseModel):
    entity_id: str
    entity_type: str
    overall_trust_score: int
    trust_level: str
    evidence_quality_score: int
    grounding_score: int
    source_confidence_score: int
    assumption_risk_score: int
    unknowns_risk_score: int
    hallucination_risk: str
    deterministic_gates_passed: bool
    review_required: bool
    safe_to_share: str
    reasons: List[str]
    metadata: Dict[str, Any]

class ProvenanceRecord(BaseModel):
    output_id: str
    module: str
    context: str
    source_inputs_used: List[str]
    evidence_items_used: List[str]
    model_provider_used: str
    prompt_version: str
    generated_timestamp: datetime
    fallback_status: bool
    deterministic_rules_applied: List[str]
    reviewer_status: str
    last_modified_timestamp: datetime

class DeterministicGateAudit(BaseModel):
    gate_name: str
    applied: bool
    result: str
    reason: str
    affected_output: str
    severity: str

class ReviewerStatusUpdate(BaseModel):
    reviewer_status: str
    comments: Optional[str] = None
"""
with open("backend/trust_layer_engine/trust_schemas.py", "w") as f:
    f.write(trust_schemas_content)

trust_fixtures_content = """
from datetime import datetime, timezone
from trust_layer_engine.trust_schemas import TrustScore, ProvenanceRecord, ClaimAuditRecord, DeterministicGateAudit

MOCK_TRUST_SCORES = [
    TrustScore(
        entity_id="deal_sarvam_ai",
        entity_type="deal",
        overall_trust_score=85,
        trust_level="high",
        evidence_quality_score=90,
        grounding_score=95,
        source_confidence_score=80,
        assumption_risk_score=10,
        unknowns_risk_score=5,
        hallucination_risk="low",
        deterministic_gates_passed=True,
        review_required=False,
        safe_to_share="yes",
        reasons=["Grounded in 4 evidence items", "2 public sources", "No private data required yet"],
        metadata={"model": "MockGPT-4"}
    ),
    TrustScore(
        entity_id="memo_neuraldesk",
        entity_type="memo",
        overall_trust_score=60,
        trust_level="needs_review",
        evidence_quality_score=50,
        grounding_score=70,
        source_confidence_score=60,
        assumption_risk_score=40,
        unknowns_risk_score=20,
        hallucination_risk="medium",
        deterministic_gates_passed=False,
        review_required=True,
        safe_to_share="with_review",
        reasons=["Missing cap table blocks fund math", "Assumption heavy on retention"],
        metadata={"model": "MockGPT-4"}
    )
]

MOCK_PROVENANCE = [
    ProvenanceRecord(
        output_id="memo_neuraldesk",
        module="Memo",
        context="NeuralDesk Deal",
        source_inputs_used=["data_room_q1_deck.pdf"],
        evidence_items_used=["EVID-104", "EVID-105"],
        model_provider_used="Mock",
        prompt_version="v2.1",
        generated_timestamp=datetime.now(timezone.utc),
        fallback_status=True,
        deterministic_rules_applied=["Low evidence score caps recommendation"],
        reviewer_status="Needs Analyst Review",
        last_modified_timestamp=datetime.now(timezone.utc)
    )
]

MOCK_CLAIMS = [
    ClaimAuditRecord(
        claim_text="NeuralDesk has $2M ARR.",
        claim_type="Uploaded private metric",
        source="data_room_q1_deck.pdf",
        confidence="High",
        verification_status="Verified via deck",
        decision_relevance="Critical",
        risk_if_wrong="High",
        reviewer_required=False
    ),
    ClaimAuditRecord(
        claim_text="Competitors are struggling with retention.",
        claim_type="Analyst assumption",
        source="Analyst Input",
        confidence="Low",
        verification_status="Unverified",
        decision_relevance="Moderate",
        risk_if_wrong="Medium",
        reviewer_required=True
    )
]

MOCK_GATES = [
    DeterministicGateAudit(
        gate_name="Missing private metrics caps IC readiness",
        applied=True,
        result="Passed",
        reason="No private metrics available, IC packet generation blocked",
        affected_output="ic_packet_sarvam",
        severity="High"
    )
]

MOCK_REVIEW_QUEUE = [
    {
        "output_id": "memo_neuraldesk",
        "entity": "NeuralDesk",
        "trust_score": 60,
        "review_status": "Needs Analyst Review",
        "risk_flags": ["Missing cap table"],
        "reviewer": "Unassigned",
        "last_updated": datetime.now(timezone.utc).isoformat()
    }
]
"""
with open("backend/trust_layer_engine/trust_fixtures.py", "w") as f:
    f.write(trust_fixtures_content)

trust_orchestrator_content = """
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
"""
with open("backend/trust_layer_engine/trust_orchestrator.py", "w") as f:
    f.write(trust_orchestrator_content)

print("Trust Layer content built.")
