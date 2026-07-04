import json
from datetime import datetime
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from db.models import (
    GraphNode, GraphEdge, Decision, Claim, Assumption, 
    EvidenceConflict, EscalationSignal, ChallengeTask, 
    ChallengeFinding, Recommendation, Document, Chunk
)

RELATIONSHIP_CONTRACTS = {
    "CLAIM_SUPPORTS_RECOMMENDATION": {"sources": ["Claim"], "targets": ["Recommendation"], "symmetric": False},
    "CLAIM_CONTRADICTS_CLAIM": {"sources": ["Claim"], "targets": ["Claim"], "symmetric": True},
    "CLAIM_DEPENDS_ON_ASSUMPTION": {"sources": ["Claim"], "targets": ["Assumption"], "symmetric": False},
    "ASSUMPTION_INVALIDATES_RECOMMENDATION": {"sources": ["Assumption"], "targets": ["Recommendation"], "symmetric": False},
    "CONFLICT_REQUIRES_RESOLUTION": {"sources": ["EvidenceConflict"], "targets": ["ChallengeTask"], "symmetric": False},
    "SIGNAL_TRIGGERS_TASK": {"sources": ["EscalationSignal"], "targets": ["ChallengeTask"], "symmetric": False},
    "CHALLENGE_TARGETS_OBJECT": {"sources": ["ChallengeTask"], "targets": ["Claim", "Assumption", "EvidenceConflict", "EscalationSignal"], "symmetric": False},
    "CHALLENGE_REVISES_POSITION": {"sources": ["ChallengeTask"], "targets": ["Claim", "Assumption"], "symmetric": False},
    "EVIDENCE_RESOLVES_CONFLICT": {"sources": ["EvidenceDocument", "EvidenceChunk"], "targets": ["EvidenceConflict"], "symmetric": False},
    "CHALLENGE_PRODUCES_FINDING": {"sources": ["ChallengeTask"], "targets": ["ChallengeFinding"], "symmetric": False},
    "FINDING_AFFECTS_RECOMMENDATION": {"sources": ["ChallengeFinding"], "targets": ["Recommendation"], "symmetric": False},
    "EVIDENCE_CONFLICT_REQUIRES_REVIEW": {"sources": ["EvidenceConflict"], "targets": ["DecisionIntegrityEnvelope"], "symmetric": False},
    "ASSUMPTION_REQUIRES_VALIDATION": {"sources": ["Assumption"], "targets": ["DecisionIntegrityEnvelope"], "symmetric": False},
    "SIGNAL_ESCALATES_DECISION": {"sources": ["EscalationSignal"], "targets": ["DecisionIntegrityEnvelope"], "symmetric": False},
    "CHALLENGE_FINDING_INFORMS_ENVELOPE": {"sources": ["ChallengeFinding"], "targets": ["DecisionIntegrityEnvelope"], "symmetric": False},
    "INTEGRITY_ENVELOPE_GOVERNS_RECOMMENDATION": {"sources": ["DecisionIntegrityEnvelope"], "targets": ["Recommendation"], "symmetric": False},
    "RECOMMENDATION_BLOCKED_BY_CONFLICT": {"sources": ["Recommendation"], "targets": ["EvidenceConflict"], "symmetric": False}
}

class GraphService:
    @staticmethod
    def generate_node_id(node_type: str, object_id: int) -> str:
        type_prefix_map = {
            "Decision": "decision",
            "Claim": "claim",
            "Assumption": "assumption",
            "EvidenceConflict": "evidence_conflict",
            "EscalationSignal": "escalation_signal",
            "ChallengeTask": "challenge_task",
            "ChallengeFinding": "challenge_finding",
            "Recommendation": "recommendation",
            "EvidenceDocument": "evidence_document",
            "EvidenceChunk": "evidence_chunk",
            "DecisionIntegrityEnvelope": "decision_integrity_envelope",
            "HumanDecisionRecord": "human_decision_record"
        }
        prefix = type_prefix_map.get(node_type, node_type.lower())
        return f"{prefix}:{object_id}"

    @staticmethod
    def upsert_node(db: Session, decision_id: int, node_type: str, object_id: int, content: str, metadata: dict = None) -> str:
        node_id = GraphService.generate_node_id(node_type, object_id)
        node = db.query(GraphNode).filter(GraphNode.id == node_id).first()
        if not node:
            node = GraphNode(
                id=node_id,
                node_type=node_type,
                decision_id=decision_id,
                content=content,
                metadata_json=json.dumps(metadata) if metadata else None
            )
            db.add(node)
        else:
            node.content = content
            if metadata:
                node.metadata_json = json.dumps(metadata)
        db.flush()
        return node_id

    @staticmethod
    def _validate_edge(db: Session, source_id: str, target_id: str, relationship: str, decision_id: int) -> tuple[bool, str]:
        if relationship not in RELATIONSHIP_CONTRACTS:
            return False, "RELATIONSHIP_REJECTED_INVALID_TYPE"
        
        contract = RELATIONSHIP_CONTRACTS[relationship]
        source_node = db.query(GraphNode).filter(GraphNode.id == source_id).first()
        target_node = db.query(GraphNode).filter(GraphNode.id == target_id).first()
        
        if not source_node:
            return False, "RELATIONSHIP_REJECTED_INVALID_SOURCE"
        if not target_node:
            return False, "RELATIONSHIP_REJECTED_INVALID_TARGET"
            
        if source_node.decision_id != decision_id or target_node.decision_id != decision_id:
            return False, "RELATIONSHIP_REJECTED_CROSS_DECISION"
            
        if source_node.node_type not in contract["sources"]:
            return False, "RELATIONSHIP_REJECTED_INVALID_SOURCE_TYPE"
        if target_node.node_type not in contract["targets"]:
            return False, "RELATIONSHIP_REJECTED_INVALID_TARGET_TYPE"
            
        existing = db.query(GraphEdge).filter(
            GraphEdge.source_node_id == source_id,
            GraphEdge.target_node_id == target_id,
            GraphEdge.relationship == relationship
        ).first()
        
        if existing:
            return False, "RELATIONSHIP_REJECTED_DUPLICATE"
            
        return True, "RELATIONSHIP_ACCEPTED"

    @staticmethod
    def add_validated_edge(db: Session, decision_id: int, source_id: str, target_id: str, relationship: str, weight: float = 1.0) -> dict:
        valid, status = GraphService._validate_edge(db, source_id, target_id, relationship, decision_id)
        if not valid:
            return {"status": status, "source": source_id, "target": target_id, "type": relationship}
            
        edge = GraphEdge(
            source_node_id=source_id,
            target_node_id=target_id,
            relationship=relationship,
            weight=weight
        )
        db.add(edge)
        db.flush()
        return {"status": "RELATIONSHIP_ACCEPTED", "source": source_id, "target": target_id, "type": relationship}

    @staticmethod
    def ensure_decision_graph_objects(db: Session, decision_id: int) -> dict:
        nodes_created = 0
        claims = db.query(Claim).filter(Claim.decision_id == decision_id).all()
        for c in claims:
            if c.source_chunk_id:
                chunk = db.query(Chunk).filter(Chunk.id == c.source_chunk_id).first()
                if chunk:
                    doc = db.query(Document).filter(Document.id == chunk.document_id).first()
                    if doc:
                        doc_id = GraphService.upsert_node(db, decision_id, "EvidenceDocument", doc.id, doc.filename or f"Doc {doc.id}")
                        chunk_id = GraphService.upsert_node(db, decision_id, "EvidenceChunk", chunk.id, chunk.content)
            GraphService.upsert_node(db, decision_id, "Claim", c.id, c.statement)
            nodes_created += 1
            
        assumptions = db.query(Assumption).filter(Assumption.decision_id == decision_id).all()
        for a in assumptions:
            GraphService.upsert_node(db, decision_id, "Assumption", a.id, a.statement)
            nodes_created += 1
            
        conflicts = db.query(EvidenceConflict).filter(EvidenceConflict.decision_id == decision_id).all()
        for c in conflicts:
            GraphService.upsert_node(db, decision_id, "EvidenceConflict", c.id, f"Conflict: {c.relationship_type}")
            claim_a_node = GraphService.generate_node_id("Claim", c.claim_a_id)
            claim_b_node = GraphService.generate_node_id("Claim", c.claim_b_id)
            GraphService.add_validated_edge(db, decision_id, claim_a_node, claim_b_node, "CLAIM_CONTRADICTS_CLAIM")
            
            # also link the conflict to the claims
            conflict_node = GraphService.generate_node_id("EvidenceConflict", c.id)
            GraphService.add_validated_edge(db, decision_id, claim_a_node, conflict_node, "CLAIM_CONTRADICTS_CLAIM") # Not in allowlist, maybe skip
            
            nodes_created += 1
            
        return {"nodes_created": nodes_created}

    @staticmethod
    def link_escalation_to_challenge(db: Session, decision_id: int, signal: EscalationSignal, task: ChallengeTask):
        try:
            signal_id = GraphService.upsert_node(db, decision_id, "EscalationSignal", signal.id, signal.reason)
            task_node_id = GraphService.upsert_node(db, decision_id, "ChallengeTask", task.id, task.challenge_question)
            
            GraphService.add_validated_edge(db, decision_id, signal_id, task_node_id, "SIGNAL_TRIGGERS_TASK")
            
            if task.target_type and task.target_id:
                target_node_id = GraphService.generate_node_id(task.target_type, int(task.target_id))
                GraphService.add_validated_edge(db, decision_id, task_node_id, target_node_id, "CHALLENGE_TARGETS_OBJECT")
                
            db.commit()
            return {"status": "SUCCESS"}
        except Exception as e:
            db.rollback()
            return {"status": "GRAPH_SYNC_FAILED", "error": str(e)}

    @staticmethod
    def persist_challenge_finding_chain(db: Session, decision_id: int, challenge_task: ChallengeTask, finding: ChallengeFinding, recommendation: Recommendation = None) -> list:
        results = []
        try:
            task_id = GraphService.upsert_node(db, decision_id, "ChallengeTask", challenge_task.id, challenge_task.challenge_question)
            finding_id = GraphService.upsert_node(db, decision_id, "ChallengeFinding", finding.id, finding.position_after or "No change")
            results.append(GraphService.add_validated_edge(db, decision_id, task_id, finding_id, "CHALLENGE_PRODUCES_FINDING"))
            
            if recommendation:
                rec_id = GraphService.upsert_node(db, decision_id, "Recommendation", recommendation.id, recommendation.recommendation_value)
                results.append(GraphService.add_validated_edge(db, decision_id, finding_id, rec_id, "FINDING_AFFECTS_RECOMMENDATION"))
            
            db.commit()
            return results
        except Exception as e:
            db.rollback()
            return [{"status": "GRAPH_SYNC_FAILED", "error": str(e)}]

    @staticmethod
    def persist_validated_relationships(db: Session, decision_id: int, relationships: list) -> list:
        results = []
        for rel in relationships:
            source = rel.get("source_node")
            target = rel.get("target_node")
            rel_type = rel.get("type")
            if source and target and rel_type:
                res = GraphService.add_validated_edge(db, decision_id, source, target, rel_type)
                results.append(res)
        return results
        
    @staticmethod
    def trace_provenance(db: Session, decision_id: int, start_node_id: str, max_depth: int = 5, max_nodes: int = 100) -> dict:
        visited_nodes = {}
        visited_edges = []
        
        start_node = db.query(GraphNode).filter(GraphNode.id == start_node_id, GraphNode.decision_id == decision_id).first()
        if not start_node:
            return {"error": "Node not found or cross-decision"}
            
        queue = [(start_node_id, 0)]
        truncation_reason = None
        
        while queue and len(visited_nodes) < max_nodes:
            current_id, depth = queue.pop(0)
            if current_id in visited_nodes:
                continue
                
            node = db.query(GraphNode).filter(GraphNode.id == current_id).first()
            if not node:
                continue
                
            visited_nodes[current_id] = {
                "id": node.id,
                "type": node.node_type,
                "content": node.content
            }
            
            if depth >= max_depth:
                truncation_reason = "max_depth_reached"
                continue
                
            # Incoming edges
            incoming = db.query(GraphEdge).filter(GraphEdge.target_node_id == current_id).all()
            for e in incoming:
                if e.id not in [edge["id"] for edge in visited_edges]:
                    visited_edges.append({"id": e.id, "source": e.source_node_id, "target": e.target_node_id, "relationship": e.relationship})
                if e.source_node_id not in visited_nodes:
                    queue.append((e.source_node_id, depth + 1))
                    
            # Outgoing edges
            outgoing = db.query(GraphEdge).filter(GraphEdge.source_node_id == current_id).all()
            for e in outgoing:
                if e.id not in [edge["id"] for edge in visited_edges]:
                    visited_edges.append({"id": e.id, "source": e.source_node_id, "target": e.target_node_id, "relationship": e.relationship})
                if e.target_node_id not in visited_nodes:
                    queue.append((e.target_node_id, depth + 1))
                    
        if len(visited_nodes) >= max_nodes and not truncation_reason:
            truncation_reason = "max_nodes_reached"
            
        return {
            "trace_complete": truncation_reason is None,
            "truncation_reason": truncation_reason,
            "nodes_returned": len(visited_nodes),
            "edges_returned": len(visited_edges),
            "nodes": list(visited_nodes.values()),
            "edges": visited_edges
        }

    @staticmethod
    def get_decision_graph(db: Session, decision_id: int) -> Dict[str, Any]:
        nodes = db.query(GraphNode).filter(GraphNode.decision_id == decision_id).all()
        node_ids = [n.id for n in nodes]
        edges = db.query(GraphEdge).filter(
            GraphEdge.source_node_id.in_(node_ids),
            GraphEdge.target_node_id.in_(node_ids)
        ).all()
        
        return {
            "nodes": [{"id": n.id, "type": n.node_type, "content": n.content, "metadata": n.metadata_json} for n in nodes],
            "edges": [{"id": e.id, "source": e.source_node_id, "target": e.target_node_id, "relationship": e.relationship, "weight": e.weight} for e in edges]
        }
