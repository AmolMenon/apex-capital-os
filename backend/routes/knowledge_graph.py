from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from db.database import get_db

from investment_knowledge_graph.graph_orchestrator import GraphOrchestrator
from investment_knowledge_graph.graph_query_engine import GraphQueryEngine

router = APIRouter()

@router.get("/status")
def get_graph_status() -> Dict[str, Any]:
    return GraphOrchestrator.get_status()

@router.post("/rebuild")
def rebuild_graph() -> Dict[str, Any]:
    success = GraphOrchestrator.rebuild_full_graph()
    return {"success": success, "status": "Graph rebuilt successfully."}

@router.post("/deals/{deal_id}/rebuild")
def rebuild_deal_graph(deal_id: str) -> Dict[str, Any]:
    success = GraphOrchestrator.rebuild_deal_graph(deal_id)
    return {"success": success, "status": f"Graph for deal {deal_id} rebuilt."}

@router.get("/deals/{deal_id}")
def get_company_graph(deal_id: str) -> Dict[str, Any]:
    return GraphQueryEngine.get_company_graph(deal_id)

@router.get("/deals/{deal_id}/similar")
def get_similar_deals(deal_id: str) -> List[Dict[str, Any]]:
    return GraphQueryEngine.get_similar_deals(deal_id)

@router.get("/insights")
def get_cross_deal_insights() -> Dict[str, Any]:
    return GraphQueryEngine.get_cross_deal_insights()
