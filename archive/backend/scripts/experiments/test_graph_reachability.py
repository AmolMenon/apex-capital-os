import sys
import os
import json

os.environ["DATABASE_URL"] = "sqlite:///./test_apex_capital.db"
sys.path.insert(0, os.path.abspath('.'))

from db.database import SessionLocal
from db.models import GraphNode, GraphEdge
from services.graph_service import GraphService

def check_graph_reachability():
    db = SessionLocal()
    decision_id = 9999 # From deterministic e2e test
    
    nodes = db.query(GraphNode).filter(GraphNode.decision_id == decision_id).all()
    edges = db.query(GraphEdge).all()
    
    node_ids = {n.id for n in nodes}
    print(f"Total Nodes: {len(nodes)}")
    print(f"Total Edges: {len(edges)}")
    
    orphans = []
    dangling_edges = []
    
    for n in nodes:
        # A node is an orphan if it has no incoming or outgoing edges, UNLESS it's the root Decision node
        if n.node_type == "Decision":
            continue
        has_edge = any(e.source_node_id == n.id or e.target_node_id == n.id for e in edges)
        if not has_edge:
            orphans.append(n.id)
            
    decision_edges = [e for e in edges if e.source_node_id in node_ids or e.target_node_id in node_ids]
    
    for e in decision_edges:
        if e.source_node_id not in node_ids or e.target_node_id not in node_ids:
            dangling_edges.append((e.source_node_id, e.target_node_id))
            
    print(f"Orphans: {orphans}")
    print(f"Dangling Edges: {dangling_edges}")
    
    # Reachability from DecisionIntegrityEnvelope node
    # Find the envelope node for this decision
    env_node = next((n for n in nodes if n.node_type == "DecisionIntegrityEnvelope"), None)
    if not env_node:
        print("DecisionIntegrityEnvelope node not found in graph!")
        db.close()
        return
        
    decision_node_id = env_node.id
    visited = set()
    
    def dfs(node_id):
        if node_id in visited:
            return
        visited.add(node_id)
        neighbors = [e.target_node_id for e in decision_edges if e.source_node_id == node_id] + \
                    [e.source_node_id for e in decision_edges if e.target_node_id == node_id]
        for neighbor in neighbors:
            dfs(neighbor)
            
    dfs(decision_node_id)
    unreachable = node_ids - visited
    print(f"Unreachable from {decision_node_id}: {unreachable}")
        
    db.close()

if __name__ == "__main__":
    check_graph_reachability()
