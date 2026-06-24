from fastapi import APIRouter, Depends, HTTPException
import os
from typing import Dict, Any, List
from agentic_workflow_engine.agent_orchestrator import orchestrator
from agentic_workflow_engine.agent_schemas import AgentWorkflowRun

router = APIRouter()

@router.post("/deals/{deal_id}/run", response_model=AgentWorkflowRun)
async def run_workflow(deal_id: str, company_name: str = "Unknown"):
    try:
        run = await orchestrator.run_full_workflow(deal_id, company_name)
        return run
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/deals/{deal_id}", response_model=AgentWorkflowRun)
async def get_workflow(deal_id: str):
    run = await orchestrator.get_latest_workflow(deal_id)
    if not run:
        from agentic_workflow_engine.agent_schemas import AgentWorkflowRun, AgentWorkflowMetadata
        return AgentWorkflowRun(
            run_id="mock-run-123",
            deal_id=deal_id,
            company_name="Mock Deal",
            workflow_mode="mock",
            status="completed",
            agents_run=["Researcher", "Reviewer"],
            trace=[],
            final_report=None,
            metadata=AgentWorkflowMetadata(
                provider_used="mock",
                fallback_used=True,
                sources_reviewed=10,
                claims_verified=5,
                assumptions_created=2,
                unknown_metrics=1,
                created_at="2026-06-11T00:00:00Z"
            )
        )
    return run

@router.get("/status")
async def get_status():
    app_mode = os.getenv("APP_MODE", "mock").lower()
    enable_llm = os.getenv("ENABLE_REAL_LLM", "false").lower() == "true"
    
    current_mode = "Mock Workflow"
    if app_mode == "real" and enable_llm:
        current_mode = "Live LLM Workflow"
        
    return {
        "agentic_workflow_enabled": True,
        "workflow_mode": current_mode,
        "agents_available": orchestrator.agents,
        "fallback_status": "Active"
    }
