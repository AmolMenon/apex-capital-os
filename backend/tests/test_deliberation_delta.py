import pytest
from services.delta_service import DeltaService

def test_normalize_text():
    assert DeltaService.normalize_text("The CTO Left!!") == "the cto left"
    assert DeltaService.normalize_text("  SPACES  ") == "spaces"

def test_substantive_value_added():
    r1 = {
        "position": "Hold",
        "confidence": 50,
        "key_risks": ["Revenue is down"]
    }
    r2 = {
        "revised_position": "Reject",
        "confidence_before": 50,
        "confidence_after": 20,
        "key_risks": ["Revenue is down", "CTO resigned unexpectedly"]
    }
    assert DeltaService.classify_delta(r1, r2) == "SUBSTANTIVE_VALUE_ADDED"

def test_confidence_only_change():
    r1 = {
        "position": "Hold",
        "confidence": 50,
        "key_risks": ["Revenue is down"]
    }
    r2 = {
        "revised_position": "Hold",
        "confidence_before": 50,
        "confidence_after": 40,
        "key_risks": ["revenue is down"]
    }
    assert DeltaService.classify_delta(r1, r2) == "CONFIDENCE_ONLY_CHANGE"

def test_no_meaningful_change():
    r1 = {
        "position": "Hold",
        "confidence": 50,
        "key_risks": ["Revenue is down"]
    }
    r2 = {
        "revised_position": "hold.",
        "confidence_before": 50,
        "confidence_after": 50,
        "key_risks": ["  revenue IS down!  "]
    }
    assert DeltaService.classify_delta(r1, r2) == "NO_MEANINGFUL_CHANGE"

def test_quality_degradation():
    r1 = {
        "position": "Hold",
        "confidence": 50,
        "key_risks": ["Revenue is down"]
    }
    r2 = {} # incoherent response
    assert DeltaService.classify_delta(r1, r2) == "QUALITY_DEGRADATION"
