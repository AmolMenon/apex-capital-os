import json
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from db.models import Claim, ProvenanceType
from .llm_provider import LLMProvider
from .telemetry_service import TelemetryService

class ExtractionService:
    @staticmethod
    def extract_claims_from_chunk(db: Session, decision_id: int, chunk: Any, run_record_id: int = None) -> List[Claim]:
        """
        Uses the LLM Provider to extract structured claims, assumptions, and facts
        from a raw evidence chunk.
        """
        from services.ingestion_service import IngestionService
        
        system_prompt = """
        You are a disciplined institutional investment analyst.
        Extract the most important discrete statements from the provided text.
        Focus specifically on detecting:
        Revenue, Growth, Margins, Customers, Retention, Pricing, Market Size, Competition, Business Model, Fundraising Ask, Cap Table references, and Team Credentials.

        CRITICAL: Never infer missing metrics. Only extract what is explicitly stated.

        For each item, classify its provenance type strictly into one of the following:
        - "Hard Evidence": Hard numbers, historical financials, verifiable metrics.
        - "Soft Evidence": Qualitative points, customer quotes, unverified historical claims.
        - "Marketing Claim": Vision statements, buzzwords, subjective product descriptions.
        - "Forward Looking Statement": Projections, future goals, "will be" statements.
        - "Assumption": Underlying belief required for the text to be true.
        - "Unknown": Stated ambiguously or with missing units/timeframes.

        CRITICAL: For every item you MUST provide the exact `quoted_evidence_span`. This must be a verbatim, word-for-word substring from the source text. Do not hallucinate or paraphrase the span.
        
        Output MUST be in the following JSON schema:
        {
            "items": [
                {
                    "statement": "The normalized, clean text of the claim",
                    "category": "One of the specific categories above (e.g. Revenue, Growth, etc.) or 'Other'",
                    "provenance_type": "One of the strict classification types above",
                    "quoted_evidence_span": "The verbatim text from the chunk that proves this",
                    "confidence_score": 100,
                    "extraction_rationale": "Why this was extracted"
                }
            ]
        }
        """
        import time
        t0 = time.time()
        try:
            from core.config import settings
            schema = {
                    "type": "object",
                    "properties": {
                        "items": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "statement": {"type": "string"},
                                    "category": {"type": "string"},
                                    "provenance_type": {"type": "string", "enum": ["Hard Evidence", "Soft Evidence", "Marketing Claim", "Forward Looking Statement", "Assumption", "Unknown"]},
                                    "quoted_evidence_span": {"type": "string"},
                                    "confidence_score": {"type": "integer"},
                                    "extraction_rationale": {"type": "string"}
                                },
                                "required": ["statement", "category", "provenance_type", "confidence_score"]
                            }
                        }
                    },
                    "required": ["items"]
                }
            
            response_json, tokens = LLMProvider.generate_structured(
                system_prompt=system_prompt,
                user_prompt=f"Text to analyze:\n\n{chunk.content}",
                model_name=settings.APEX_EXTRACTION_MODEL,
                schema=schema
            )
            
            latency_ms = int((time.time() - t0) * 1000)
            
            # Persist usage immediately if we have a run record
            if run_record_id:
                from db.models import ReasoningRun
                run = db.query(ReasoningRun).filter_by(id=run_record_id).first()
                if run:
                    token_tracker = json.loads(run.token_usage_json) if run.token_usage_json else {"input": 0, "output": 0}
                    latency_tracker = json.loads(run.latency_ms_json) if run.latency_ms_json else {}
                    cost_tracker = json.loads(run.cost_json) if run.cost_json else {}
                    
                    # Placeholder tokens (aligned with mocked usage strategy until LLMProvider returns real tokens)
                    input_t = 1200
                    output_t = 300
                    cost = (input_t / 1000.0 * 0.005) + (output_t / 1000.0 * 0.015)
                    
                    token_tracker["input"] += input_t
                    token_tracker["output"] += output_t
                    latency_tracker["extraction"] = latency_ms
                    cost_tracker["extraction"] = cost
                    
                    run.token_usage_json = json.dumps(token_tracker)
                    run.latency_ms_json = json.dumps(latency_tracker)
                    run.cost_json = json.dumps(cost_tracker)
                    run.accumulated_cost = (run.accumulated_cost or 0.0) + cost
                    db.commit()

            extracted_items = response_json.get("items", [])
            claims = []
            
            for item in extracted_items:
                prov_type_str = item.get("provenance_type", "Extracted Claim")
                
                try:
                    prov_type = ProvenanceType(prov_type_str)
                except ValueError:
                    prov_type = ProvenanceType.EXTRACTED_CLAIM
                    
                quoted_span = item.get("quoted_evidence_span", "")
                
                # Deterministic Backend Verification using canonical text
                verification_status = "Verified"
                if prov_type != ProvenanceType.AI_INFERENCE:
                    if not quoted_span:
                        verification_status = "EVIDENCE_SPAN_NOT_FOUND"
                    else:
                        normalized_span = IngestionService.normalize_text(quoted_span)
                        if not chunk.canonical_content:
                            chunk.canonical_content = IngestionService.normalize_text(chunk.content)
                        if normalized_span not in chunk.canonical_content:
                            verification_status = "EVIDENCE_SPAN_WRONG_CHUNK"
                
                # Add category to metadata_json
                import json
                category = item.get("category", "Other")
                metadata = json.dumps({"category": category})
                    
                claim = Claim(
                    decision_id=decision_id,
                    statement=item.get("statement"),
                    provenance_type=prov_type.value,
                    source_chunk_id=chunk.id,
                    quoted_evidence_span=quoted_span,
                    confidence=item.get("confidence_score", 50),
                    extraction_rationale=item.get("extraction_rationale"),
                    verification_status=verification_status,
                    related_assertions_json=metadata
                )
                db.add(claim)
                claims.append(claim)
                
            db.commit()
            return claims
            
        except Exception as e:
            db.rollback()
            raise e
