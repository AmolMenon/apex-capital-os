from pydantic import BaseModel, Field
from typing import List, Optional

class ChangeOurMind(BaseModel):
    upgrade_triggers: List[str] = Field(default_factory=list)
    downgrade_triggers: List[str] = Field(default_factory=list)
    pass_triggers: List[str] = Field(default_factory=list)

class DecisionOutput(BaseModel):
    current_recommendation: str = ""
    calibrated_recommendation: str = ""
    confidence_level: str = ""
    recommendation_reason: str = ""
    blocking_issues: List[str] = Field(default_factory=list)
    positive_signals: List[str] = Field(default_factory=list)
    evidence_gaps: List[str] = Field(default_factory=list)
    risks_that_could_change_decision: List[str] = Field(default_factory=list)
    next_decision_milestone: str = ""
    what_would_upgrade_recommendation: List[str] = Field(default_factory=list)
    what_would_downgrade_recommendation: List[str] = Field(default_factory=list)
    change_our_mind: Optional[ChangeOurMind] = None
