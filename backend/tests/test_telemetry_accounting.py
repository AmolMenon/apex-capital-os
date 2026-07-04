import pytest
from db.models import ModelTelemetry

def test_telemetry_aggregation():
    t1 = ModelTelemetry(input_tokens=100, output_tokens=50, latency_ms=1000)
    t2 = ModelTelemetry(input_tokens=200, output_tokens=100, latency_ms=1500)
    records = [t1, t2]
    
    input_tokens = sum(t.input_tokens for t in records if t.input_tokens)
    output_tokens = sum(t.output_tokens for t in records if t.output_tokens)
    latency = sum(t.latency_ms for t in records if t.latency_ms)
    
    assert input_tokens == 300
    assert output_tokens == 150
    assert latency == 2500
