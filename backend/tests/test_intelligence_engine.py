import pytest
import json
from unittest.mock import MagicMock
from services.investor_review_service import InvestorReviewService
from services.extraction_service import ExtractionService
from services.confidence_service import ReadinessService
from db.models import ProvenanceType, Claim, EvidenceConflict, EscalationSignal, Decision
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.database import Base

# STATIC BENCHMARK DATA
MOCK_EXCELLENT_DECK = {
    "deck.pdf": "We reached $5M ARR growing 120% YoY. CAC is $500, LTV is $5000. Team includes 3 ex-Stripe engineers. Market size is $10B based on Gartner report.",
    "financials.xlsx": "Q1 Rev: $1.2M, Q2 Rev: $1.3M. ARR confirms $5M. Customer count is 100."
}

MOCK_CONTRADICTORY_DECK = {
    "deck.pdf": "We are growing 300% YoY with $2M ARR.",
    "financials.xlsx": "Total revenue for 2023 was $1.1M, representing 50% YoY growth."
}

MOCK_WEAK_DECK = {
    "deck.pdf": "We will be the biggest AI company. We have lots of interest. We think revenue will be $100M next year. We don't have customers yet but the product is almost done."
}

@pytest.fixture(scope="module")
def test_db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    yield db
    db.close()

def test_confidence_formula():
    """Phase 2: Test deterministic confidence calculation without LLM."""
    res = ReadinessService.calculate_readiness(
        evidence_count=10,
        hard_evidence_count=6,
        unresolved_contradictions_count=0,
        missing_information_count=0,
        staleness_penalty_count=0,
        resolved_assumptions_count=2
    )
    assert res["readiness_index"] > 50
    assert "Quality" in res["explanation"]

    res_contradictory = ReadinessService.calculate_readiness(
        evidence_count=10,
        hard_evidence_count=6,
        unresolved_contradictions_count=2,
        missing_information_count=0,
        staleness_penalty_count=0,
        resolved_assumptions_count=0
    )
    assert res_contradictory["readiness_index"] < res["readiness_index"]
    assert "Penalty" in res_contradictory["explanation"]
    
def test_extraction_calibration(test_db):
    """Phase 1: Test that extraction classifies Hard vs Soft evidence and doesn't infer metrics."""
    # Since we can't run a real LLM easily in a fast unit test, we mock the LLM output 
    # to simulate a disciplined extraction based on the new Phase 1 system prompt.
    mock_chunk = MagicMock()
    mock_chunk.id = 1
    mock_chunk.content = MOCK_EXCELLENT_DECK["deck.pdf"]
    mock_chunk.canonical_content = mock_chunk.content

    # Mock the LLMProvider to return a controlled response matching the prompt rules
    import services.llm_provider
    original_generate = services.llm_provider.LLMProvider.generate_structured
    
    services.llm_provider.LLMProvider.generate_structured = MagicMock(return_value=({
        "items": [
            {
                "statement": "$5M ARR growing 120% YoY",
                "category": "Revenue",
                "provenance_type": "Hard Evidence",
                "quoted_evidence_span": "We reached $5M ARR growing 120% YoY.",
                "confidence_score": 100,
                "extraction_rationale": "Verifiable financial metric"
            },
            {
                "statement": "Team includes 3 ex-Stripe engineers",
                "category": "Team Credentials",
                "provenance_type": "Hard Evidence",
                "quoted_evidence_span": "Team includes 3 ex-Stripe engineers.",
                "confidence_score": 100,
                "extraction_rationale": "Verifiable credential"
            }
        ]
    }, {"input": 100, "output": 100}))

    claims = ExtractionService.extract_claims_from_chunk(test_db, 1, mock_chunk)
    
    assert len(claims) == 2
    assert claims[0].provenance_type == ProvenanceType.HARD_EVIDENCE.value
    metadata = json.loads(claims[0].related_assertions_json)
    assert metadata["category"] == "Revenue"
    assert claims[0].verification_status == "Verified"
    
    # Restore mock
    services.llm_provider.LLMProvider.generate_structured = original_generate

def test_hallucination_prevention_on_weak_deck(test_db):
    """Phase 6: Ensure system prefers 'Insufficient Evidence' for weak decks."""
    decision = Decision(id=99, title="Weak Startup")
    test_db.add(decision)
    test_db.commit()

    service = InvestorReviewService(test_db)
    
    # Mock LLM to simulate Phase 6 prompt behavior (returning Insufficient Evidence)
    import services.llm_provider
    original_generate = services.llm_provider.LLMProvider.generate_structured
    try:
        services.llm_provider.LLMProvider.generate_structured = MagicMock(return_value=({
            "memo": {
                "executive_summary": "Not enough verifiable data.",
                "recommendation": "Do not proceed."
            },
            "perspectives": {},
            "investor_questions": [],
            "decision": {
                "outcome": "Insufficient Evidence",
                "rationale": "There are no verifiable metrics or hard evidence to support the product claims."
            },
            "action_plan": []
        }, {"input": 100, "output": 100}))
        
        res = service.generate_review(99)
        assert res["decision"]["outcome"] == "Insufficient Evidence"
        assert res["decision"]["readiness"]["readiness_index"] < 25 # Low readiness
    finally:
        services.llm_provider.LLMProvider.generate_structured = original_generate

def test_recommendation_traceability(test_db):
    """Phase 3 & 5: Ensure action plan outputs trace IDs and structured reasoning."""
    decision = Decision(id=100, title="Traceable Startup")
    claim1 = Claim(id=101, decision_id=100, statement="ARR is $1M", provenance_type=ProvenanceType.HARD_EVIDENCE.value)
    test_db.add(decision)
    test_db.add(claim1)
    test_db.commit()

    service = InvestorReviewService(test_db)
    
    import services.llm_provider
    original_generate = services.llm_provider.LLMProvider.generate_structured
    try:
        services.llm_provider.LLMProvider.generate_structured = MagicMock(return_value=({
            "memo": {"executive_summary": "Good"},
            "perspectives": {},
            "investor_questions": [],
            "decision": {"outcome": "Strong Meeting", "rationale": "High traction"},
            "action_plan": [
                {
                    "problem": "High Burn Rate",
                    "investor_concern": "Runway is less than 6 months",
                    "suggested_action": "Raise additional bridge capital immediately",
                    "expected_investor_impact": "Will alleviate short-term insolvency risk",
                    "supporting_evidence_ids": [101]
                }
            ]
        }, {"input": 100, "output": 100}))
        
        res = service.generate_review(100)
        assert len(res["action_plan"]) == 1
        assert res["action_plan"][0]["supporting_evidence_ids"] == [101]
        assert "investor_concern" in res["action_plan"][0]
    finally:
        services.llm_provider.LLMProvider.generate_structured = original_generate
