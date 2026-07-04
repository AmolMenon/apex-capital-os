from datetime import datetime
from sqlalchemy.orm import Session
from db.models import ModelTelemetry

class TelemetryService:
    @staticmethod
    def log_telemetry(
        db: Session,
        evaluation_run_id: str,
        decision_id: int,
        stage: str,
        provider: str,
        model: str,
        token_info: dict,
        structured_output_validity: bool = True,
        retry_count: int = 0
    ):
        input_tokens = token_info.get("input")
        output_tokens = token_info.get("output")
        latency_ms = token_info.get("latency_ms")
        
        # Simple mock cost calculation. In production, use provider-specific logic.
        # $0.005 per 1k input, $0.015 per 1k output
        estimated_cost = 0.0
        if input_tokens is not None and output_tokens is not None:
            estimated_cost = (input_tokens / 1000.0 * 0.005) + (output_tokens / 1000.0 * 0.015)
            
        telemetry = ModelTelemetry(
            evaluation_run_id=evaluation_run_id,
            decision_id=decision_id,
            stage=stage,
            provider=provider,
            model=model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            latency_ms=latency_ms,
            estimated_cost=estimated_cost,
            retry_count=retry_count,
            structured_output_validity=structured_output_validity,
            timestamp=datetime.utcnow()
        )
        db.add(telemetry)
        db.commit()
