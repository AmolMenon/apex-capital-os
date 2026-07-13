from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import json

class AgentWorkflowState(BaseModel):
    deal_profile: Dict[str, Any] = Field(default_factory=dict)
    public_web_research: Dict[str, Any] = Field(default_factory=dict)
    source_registry: List[Dict[str, Any]] = Field(default_factory=list)
    extracted_claims: List[Dict[str, Any]] = Field(default_factory=list)
    verified_facts: List[Dict[str, Any]] = Field(default_factory=list)
    assumptions: List[str] = Field(default_factory=list)
    unknown_metrics: List[str] = Field(default_factory=list)
    market_map: Dict[str, Any] = Field(default_factory=dict)
    competitor_map: Dict[str, Any] = Field(default_factory=dict)
    diligence_gaps: Dict[str, Any] = Field(default_factory=dict)
    fund_fit_output: Dict[str, Any] = Field(default_factory=dict)
    red_team_output: Dict[str, Any] = Field(default_factory=dict)
    memo_output: Dict[str, Any] = Field(default_factory=dict)
    ic_readiness_output: Dict[str, Any] = Field(default_factory=dict)
    final_report: Dict[str, Any] = Field(default_factory=dict)
    agent_trace: List[Dict[str, Any]] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)

    def to_json_dict(self) -> Dict[str, Any]:
        return self.dict()
