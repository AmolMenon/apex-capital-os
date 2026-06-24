import json
import os
import uuid
import logging
from typing import Dict, Any, Optional
from datetime import datetime

from agentic_workflow_engine.agent_schemas import AgentWorkflowRun, AgentTraceStep, AgenticResearchReport, AgentWorkflowMetadata
from agentic_workflow_engine.workflow_fixtures import MOCK_WORKFLOW_FIXTURES
from agentic_workflow_engine.agent_state import AgentWorkflowState
from agentic_workflow_engine.live_agent_executor import live_agent_executor

logger = logging.getLogger(__name__)

class AgentOrchestrator:
    def __init__(self):
        self.agents = [
            {"name": "Research Planner", "task": "research_planner_agent"},
            {"name": "Search Agent", "task": "search_agent"},
            {"name": "Source Quality", "task": "source_quality_agent"},
            {"name": "Claim Extraction", "task": "claim_extraction_agent"},
            {"name": "Evidence Verification", "task": "evidence_verification_agent"},
            {"name": "Market Mapping", "task": "market_mapping_agent"},
            {"name": "Competitor Analysis", "task": "competitor_analysis_agent"},
            {"name": "Diligence Gap", "task": "diligence_gap_agent"},
            {"name": "Fund Fit", "task": "fund_fit_agent"},
            {"name": "Red Team", "task": "red_team_agent"},
            {"name": "Memo Writer", "task": "memo_writer_agent"},
            {"name": "IC Readiness", "task": "ic_readiness_agent"}
        ]
        
    def _is_real_mode_enabled(self) -> bool:
        app_mode = os.getenv("APP_MODE", "mock").lower()
        enable_llm = os.getenv("ENABLE_REAL_LLM", "false").lower() == "true"
        return app_mode == "real" and enable_llm

    def _get_mock_fallback_for_agent(self, company_name: str, agent_name: str) -> dict:
        fixture = MOCK_WORKFLOW_FIXTURES.get(company_name)
        if not fixture:
            template_str = json.dumps(MOCK_WORKFLOW_FIXTURES["Sarvam AI"])
            fixture = json.loads(template_str.replace("Sarvam AI", company_name))
            
        for step in fixture.get("trace", []):
            if step["agent_name"] == agent_name:
                return step
        return {}

    async def run_full_workflow(self, deal_id: str, company_name: str) -> AgentWorkflowRun:
        run_id = f"run_{uuid.uuid4().hex[:8]}"
        
        if not self._is_real_mode_enabled():
            logger.info(f"Running MOCK deterministic workflow for {company_name}")
            
            # Fetch deal to build dynamic mock
            from database.crud import get_deal
            from database.database import SessionLocal
            db = SessionLocal()
            deal = get_deal(db, int(deal_id.replace("deal-", "")) if str(deal_id).replace("deal-", "").isdigit() else 0)
            db.close()
            
            fixture = MOCK_WORKFLOW_FIXTURES.get(company_name)
            if not fixture:
                from agentic_workflow_engine.workflow_fixtures import build_dynamic_workflow
                fixture = build_dynamic_workflow(company_name, deal.public_profile_json if deal else None)
                
            self._save_run_to_db(deal_id, company_name, fixture, "mock")
            return AgentWorkflowRun(**fixture)

        logger.info(f"Running LIVE LLM workflow for {company_name} ({run_id})")
        
        # Initialize State
        state = AgentWorkflowState()
        
        # Load Deal & Web Research (mock loading for now since we don't have direct access to deal DB here easily, 
        # but in a real app we'd fetch it. We will simulate fetching by seeding some basic data)
        state.deal_profile = {"name": company_name, "id": deal_id}
        state.public_web_research = {"status": "Loaded mock fallback for web research"}
        
        trace = []
        agents_run = []
        has_fallback = False
        
        for agent_config in self.agents:
            agent_name = agent_config["name"]
            task_type = agent_config["task"]
            
            logger.info(f"Executing Agent: {agent_name}")
            
            # Get fallback data in case of failure
            fallback_step = self._get_mock_fallback_for_agent(company_name, agent_name)
            
            # Execute Live
            result = live_agent_executor.execute_agent(
                agent_name=agent_name,
                task_type=task_type,
                state_json=json.dumps(state.to_json_dict(), default=str),
                sources=json.dumps(state.source_registry),
                fallback_output=fallback_step,
                deal_id=deal_id,
                run_id=run_id
            )
            
            if result.get("fallback_used"):
                has_fallback = True
            
            # Update Blackboard State
            output_data = result.get("output", {})
            if agent_name == "Research Planner":
                state.unknown_metrics.extend(output_data.get("expected_missing_private_metrics", []))
            elif agent_name == "Source Quality":
                state.source_registry.extend(output_data.get("high_quality_sources", []))
            elif agent_name == "Claim Extraction":
                state.extracted_claims.extend(output_data.get("extracted_claims", []))
            elif agent_name == "Evidence Verification":
                state.verified_facts.extend(output_data.get("verified_public_facts", []))
                state.assumptions.extend(output_data.get("assumptions", []))
            elif agent_name == "Red Team":
                state.red_team_output = output_data
            elif agent_name == "IC Readiness":
                state.ic_readiness_output = output_data
            elif agent_name == "Memo Writer":
                state.memo_output = output_data
                
            # Build Trace Step
            step = AgentTraceStep(
                step_id=f"step_{uuid.uuid4().hex[:8]}",
                started_at=datetime.utcnow().isoformat(),
                agent_name=agent_name,
                status=result["status"],
                output=output_data,
                provider_metadata=result.get("provider_metadata", {})
            )
            trace.append(step.dict())
            agents_run.append(agent_name)
            state.agent_trace = trace
            
            # We could save incrementally here


        # Finalize Report
        final_report = AgenticResearchReport(
            public_benchmark_conclusion=state.memo_output.get("recommendation", "Unknown"),
            ic_readiness_status=state.ic_readiness_output.get("ic_readiness_status", "Unknown"),
            private_diligence_required=state.diligence_gaps.get("critical_missing_metrics", []),
            fund_fit_summary=state.fund_fit_output.get("fit_summary", "Unknown"),
            recommended_next_step=state.ic_readiness_output.get("next_steps", ["Unknown"])[0] if state.ic_readiness_output.get("next_steps") else "Unknown",
            key_findings=[]
        )
        
        workflow_status = "completed_with_fallback" if has_fallback else "completed"
        
        run_data = {
            "run_id": run_id,
            "deal_id": deal_id,
            "company_name": company_name,
            "workflow_mode": "real_with_fallback" if has_fallback else "real",
            "status": workflow_status,
            "agents_run": agents_run,
            "trace": trace,
            "final_report": final_report.dict(),

            "metadata": {
                "provider_used": "Mixed",
                "fallback_used": has_fallback,
                "sources_reviewed": len(state.source_registry),
                "claims_verified": len(state.verified_facts),
                "assumptions_created": len(state.assumptions),
                "unknown_metrics": len(state.unknown_metrics),
                "created_at": datetime.utcnow().isoformat(),
                "completed_at": datetime.utcnow().isoformat()
            }

        }
        
        self._save_run_to_db(deal_id, company_name, run_data, run_data["workflow_mode"])
        return AgentWorkflowRun(**run_data)
        
    def _save_run_to_db(self, deal_id: str, company_name: str, run_data: dict, mode: str):
        from db.database import SessionLocal
        from db.models import AgentWorkflowRunModel
        
        db = SessionLocal()
        try:
            existing = db.query(AgentWorkflowRunModel).filter_by(deal_id=deal_id).first()
            if existing:
                existing.status = run_data["status"]
                existing.workflow_mode = mode
                existing.agents_run = json.dumps(run_data["agents_run"])
                existing.trace = json.dumps(run_data["trace"])
                existing.final_report = json.dumps(run_data["final_report"])
                existing.metadata_blob = json.dumps(run_data["metadata"])
            else:
                new_run = AgentWorkflowRunModel(
                    run_id=run_data["run_id"],
                    deal_id=deal_id,
                    company_name=company_name,
                    workflow_mode=mode,
                    status=run_data["status"],
                    agents_run=json.dumps(run_data["agents_run"]),
                    trace=json.dumps(run_data["trace"]),
                    final_report=json.dumps(run_data["final_report"]),
                    metadata_blob=json.dumps(run_data["metadata"])
                )
                db.add(new_run)
            db.commit()
        except Exception as e:
            logger.error(f"Error saving workflow: {e}")
            db.rollback()
        finally:
            db.close()

    async def get_latest_workflow(self, deal_id: str) -> Optional[AgentWorkflowRun]:
        from db.database import SessionLocal
        from db.models import AgentWorkflowRunModel
        
        db = SessionLocal()
        try:
            existing = db.query(AgentWorkflowRunModel).filter_by(deal_id=deal_id).first()
            if existing:
                return AgentWorkflowRun(
                    run_id=existing.run_id,
                    deal_id=existing.deal_id,
                    company_name=existing.company_name,
                    workflow_mode=existing.workflow_mode,
                    status=existing.status,
                    agents_run=json.loads(existing.agents_run) if existing.agents_run else [],
                    trace=json.loads(existing.trace) if existing.trace else [],
                    final_report=json.loads(existing.final_report) if existing.final_report else {},
                    metadata=json.loads(existing.metadata_blob) if existing.metadata_blob else {}
                )
        except Exception as e:
            logger.error(f"Error reading workflow: {e}")
        finally:
            db.close()
        return None

orchestrator = AgentOrchestrator()
