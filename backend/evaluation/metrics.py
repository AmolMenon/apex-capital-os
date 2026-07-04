from typing import List, Dict, Any

class EvaluationMetrics:
    
    @staticmethod
    def calculate_precision_recall(expected: List[str], actual_extracted: List[Dict[str, Any]]) -> Dict[str, float]:
        """
        Deterministic precision/recall based on exact quoted strings mapped back to chunk texts (approximated here).
        In a real scenario, this would use semantic embedding distance or an LLM judge.
        For deterministic baseline, we check if expected substring is in any extracted string.
        """
        if not expected and not actual_extracted:
            return {"precision": 1.0, "recall": 1.0, "unsupported_assertion_rate": 0.0}
            
        extracted_texts = [c.get("statement", "").lower() for c in actual_extracted]
        
        matches = 0
        for exp in expected:
            if any(exp.lower() in ext for ext in extracted_texts):
                matches += 1
                
        precision = matches / max(len(actual_extracted), 1)
        recall = matches / max(len(expected), 1)
        
        return {
            "precision": min(precision, 1.0),
            "recall": min(recall, 1.0),
            "unsupported_assertion_rate": max(0.0, 1.0 - precision)
        }

    @staticmethod
    def validate_traceability(db_session, recommendation_output: Dict[str, Any]) -> Dict[str, Any]:
        """
        Deterministic Validation:
        Recommendation -> Supporting Claim IDs -> Source Chunk IDs -> Document IDs -> Exact Quoted Spans
        Fails if any link is broken, categorizes failure.
        """
        from db.models import Claim, Chunk, Document
        from services.ingestion_service import IngestionService
        
        result = {
            "is_valid": True,
            "errors": [],
            "claims_checked": 0,
            "chunks_found": 0,
            "documents_found": 0,
            "spans_verified": 0
        }
        
        claim_ids = recommendation_output.get("supporting_claim_ids", []) + recommendation_output.get("contradicting_claim_ids", [])
        
        if not claim_ids:
            result["is_valid"] = False
            result["errors"].append({"type": "RECOMMENDATION_WITHOUT_SUPPORT", "message": "No claims cited in recommendation."})
            return result
            
        for claim_id in set(claim_ids):
            result["claims_checked"] += 1
            claim = db_session.query(Claim).filter(Claim.id == claim_id).first()
            if not claim:
                result["is_valid"] = False
                result["errors"].append({"type": "INVALID_CLAIM_ID", "message": f"Claim ID {claim_id} does not exist."})
                continue
                
            chunk_id = claim.source_chunk_id
            if not chunk_id:
                result["is_valid"] = False
                result["errors"].append({"type": "INVALID_CHUNK_ID", "message": f"Claim ID {claim_id} has no source chunk."})
                continue
                
            chunk = db_session.query(Chunk).filter(Chunk.id == chunk_id).first()
            if not chunk:
                result["is_valid"] = False
                result["errors"].append({"type": "INVALID_CHUNK_ID", "message": f"Source chunk ID {chunk_id} for claim {claim_id} does not exist."})
                continue
                
            result["chunks_found"] += 1
            
            document_id = chunk.document_id
            document = db_session.query(Document).filter(Document.id == document_id).first()
            if not document:
                result["is_valid"] = False
                result["errors"].append({"type": "INVALID_DOCUMENT_ID", "message": f"Document ID {document_id} for chunk {chunk_id} does not exist."})
                continue
                
            result["documents_found"] += 1
            
            # Verify span using canonical text
            if not claim.quoted_evidence_span:
                result["is_valid"] = False
                result["errors"].append({"type": "EVIDENCE_SPAN_NOT_FOUND", "message": f"No quoted span provided for claim {claim_id}."})
            else:
                normalized_span = IngestionService.normalize_text(claim.quoted_evidence_span)
                canonical_content = chunk.canonical_content or IngestionService.normalize_text(chunk.content)
                if normalized_span in canonical_content:
                    result["spans_verified"] += 1
                else:
                    result["is_valid"] = False
                    result["errors"].append({"type": "EVIDENCE_SPAN_WRONG_CHUNK", "message": f"Quoted span for claim {claim_id} not found in chunk {chunk_id}."})
            
        return result
