
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
        entity_id="deal_bharatvector_ai",
        entity_type="deal",
        overall_trust_score=55,
        trust_level="needs_review",
        evidence_quality_score=40,
        grounding_score=80,
        source_confidence_score=50,
        assumption_risk_score=70,
        unknowns_risk_score=60,
        hallucination_risk="low",
        deterministic_gates_passed=False,
        review_required=True,
        safe_to_share="with_review",
        reasons=["Unverified ARR", "Compute Inference Assumptions High Risk"],
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
        output_id="memo_bharatvector",
        module="Memo",
        context="BharatVector AI Deal",
        source_inputs_used=["Evidence Center", "Web Research (News)", "War Room Debate"],
        evidence_items_used=["EVID-201", "EVID-202"],
        model_provider_used="Mock",
        prompt_version="v2.5_demo",
        generated_timestamp=datetime.now(timezone.utc),
        fallback_status=True,
        deterministic_rules_applied=["Missing financials triggers 'Needs Review' status", "High Valuation forces 'Fund Math Gate' failure"],
        reviewer_status="Needs Analyst Review",
        last_modified_timestamp=datetime.now(timezone.utc)
    ),
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
        claim_text="BharatVector has 3 enterprise pilots.",
        claim_type="Founders Claim",
        source="Pitch Deck",
        confidence="Medium",
        verification_status="Unverified - Needs Review",
        decision_relevance="Critical",
        risk_if_wrong="High",
        reviewer_required=True
    ),
    ClaimAuditRecord(
        claim_text="India's enterprise AI market is growing at 45% CAGR.",
        claim_type="Market Stat",
        source="Web Research (McKinsey)",
        confidence="High",
        verification_status="Verified",
        decision_relevance="Low",
        risk_if_wrong="Low",
        reviewer_required=False
    ),
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
        gate_name="Fund Math Viability Gate",
        applied=True,
        result="Failed",
        reason="Entry valuation of $40M makes 10% target ownership impossible at current fund size.",
        affected_output="Decision Engine Recommendation",
        severity="Critical"
    ),
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
        "output_id": "memo_bharatvector",
        "entity": "BharatVector AI",
        "trust_score": 55,
        "review_status": "Needs Analyst Review",
        "risk_flags": ["Missing ARR Verification", "High Valuation Gap"],
        "reviewer": "Unassigned",
        "last_updated": datetime.now(timezone.utc).isoformat()
    },
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
