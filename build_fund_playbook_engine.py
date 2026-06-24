import os

base_dir = "/Users/AmolMenon/.gemini/antigravity/scratch/apex-capital/backend/fund_playbook_engine"
os.makedirs(base_dir, exist_ok=True)

files = {
    "__init__.py": "",
    "playbook_schemas.py": """from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class PartnerPreference(BaseModel):
    role_name: str
    focus_areas: List[str]
    preferred_evidence: List[str]
    common_objections: List[str]
    decision_style: str

class MemoTemplateConfig(BaseModel):
    required_sections: List[str]
    optional_sections: List[str]
    custom_instructions: str

class ICProcessConfig(BaseModel):
    review_stages: int
    partner_review_required: bool
    red_team_required: bool
    war_room_required: bool
    ic_simulation_required: bool
    minimum_safe_to_share_status: str

class DecisionGateConfig(BaseModel):
    min_evidence_score_for_ic: int
    min_data_room_completeness: int
    required_cap_table_presence: bool
    required_customer_references: bool
    required_retention_data: bool
    required_gross_margin_data: bool
    maximum_unresolved_critical_blockers: int
    ownership_feasibility_threshold: float

class ScoringProfile(BaseModel):
    market_weight: float
    founder_weight: float
    product_weight: float
    traction_weight: float
    financial_quality_weight: float
    evidence_quality_weight: float

class SectorPlaybook(BaseModel):
    sector_name: str
    focus_areas: List[str]
    required_diligence_questions: List[str]
    key_risks: List[str]
    scoring_weight_adjustments: Dict[str, float]

class StageStrategy(BaseModel):
    stage_name: str
    focus_metrics: List[str]
    acceptable_evidence_uncertainty: str
    ownership_target: str
    required_data_room_items: List[str]

class InvestmentPhilosophy(BaseModel):
    founder_market_fit_importance: str
    market_size_threshold: str
    capital_efficiency_preference: str
    technical_risk_tolerance: str
    regulatory_risk_tolerance: str
    valuation_sensitivity: str

class FundPlaybook(BaseModel):
    playbook_id: str
    playbook_name: str
    playbook_type: str  # demo/custom/default
    fund_archetype: str
    investment_philosophy: InvestmentPhilosophy
    stage_strategies: List[StageStrategy]
    sector_playbooks: List[SectorPlaybook]
    decision_gates: DecisionGateConfig
    memo_template: MemoTemplateConfig
    ic_process: ICProcessConfig
    partner_preferences: List[PartnerPreference]
    scoring_profile: ScoringProfile
    metadata: Dict[str, Any]

class PlaybookSimulationResult(BaseModel):
    company_name: str
    playbook_id: str
    playbook_name: str
    base_score: int
    playbook_adjusted_score: int
    recommendation: str
    gates_triggered: List[str]
    biggest_blocker: str
    required_next_action: str
""",
    "playbook_fixtures.py": """from .playbook_schemas import *

DEFAULT_PLAYBOOKS = [
    FundPlaybook(
        playbook_id="apex_default",
        playbook_name="Apex Default Early-Stage Playbook",
        playbook_type="demo",
        fund_archetype="early_stage",
        investment_philosophy=InvestmentPhilosophy(
            founder_market_fit_importance="High",
            market_size_threshold="$1B+",
            capital_efficiency_preference="Medium",
            technical_risk_tolerance="Medium",
            regulatory_risk_tolerance="Low",
            valuation_sensitivity="Medium"
        ),
        stage_strategies=[
            StageStrategy(
                stage_name="Seed",
                focus_metrics=["early traction", "product wedge"],
                acceptable_evidence_uncertainty="High",
                ownership_target="15-20%",
                required_data_room_items=["Deck", "Cap Table"]
            )
        ],
        sector_playbooks=[
            SectorPlaybook(
                sector_name="AI Applications",
                focus_areas=["workflow depth", "retention"],
                required_diligence_questions=["What is the data moat?"],
                key_risks=["Model commoditization", "Distribution wedge"],
                scoring_weight_adjustments={"product_weight": 1.5}
            )
        ],
        decision_gates=DecisionGateConfig(
            min_evidence_score_for_ic=60,
            min_data_room_completeness=50,
            required_cap_table_presence=False,
            required_customer_references=False,
            required_retention_data=False,
            required_gross_margin_data=False,
            maximum_unresolved_critical_blockers=2,
            ownership_feasibility_threshold=10.0
        ),
        memo_template=MemoTemplateConfig(
            required_sections=["Company Snapshot", "Thesis", "Market"],
            optional_sections=["Risks"],
            custom_instructions="Be concise."
        ),
        ic_process=ICProcessConfig(
            review_stages=2,
            partner_review_required=True,
            red_team_required=False,
            war_room_required=True,
            ic_simulation_required=False,
            minimum_safe_to_share_status="review_completed"
        ),
        partner_preferences=[
            PartnerPreference(
                role_name="Market Partner",
                focus_areas=["TAM", "Competition"],
                preferred_evidence=["Market maps", "Competitor pricing"],
                common_objections=["Market too small", "Too much competition"],
                decision_style="Analytical"
            )
        ],
        scoring_profile=ScoringProfile(
            market_weight=1.0,
            founder_weight=1.2,
            product_weight=1.0,
            traction_weight=0.8,
            financial_quality_weight=0.5,
            evidence_quality_weight=1.0
        ),
        metadata={"created_by": "System"}
    ),
    FundPlaybook(
        playbook_id="evidence_heavy",
        playbook_name="Evidence-Heavy Institutional Playbook",
        playbook_type="demo",
        fund_archetype="growth",
        investment_philosophy=InvestmentPhilosophy(
            founder_market_fit_importance="Medium",
            market_size_threshold="$5B+",
            capital_efficiency_preference="High",
            technical_risk_tolerance="Low",
            regulatory_risk_tolerance="Low",
            valuation_sensitivity="High"
        ),
        stage_strategies=[
            StageStrategy(
                stage_name="Series A",
                focus_metrics=["revenue quality", "retention", "margins"],
                acceptable_evidence_uncertainty="Low",
                ownership_target="15-20%",
                required_data_room_items=["Financial Model", "Cohort Data", "Audited Financials"]
            )
        ],
        sector_playbooks=[],
        decision_gates=DecisionGateConfig(
            min_evidence_score_for_ic=85,
            min_data_room_completeness=90,
            required_cap_table_presence=True,
            required_customer_references=True,
            required_retention_data=True,
            required_gross_margin_data=True,
            maximum_unresolved_critical_blockers=0,
            ownership_feasibility_threshold=15.0
        ),
        memo_template=MemoTemplateConfig(
            required_sections=["Company Snapshot", "Thesis", "Market", "Financials", "Unit Economics"],
            optional_sections=[],
            custom_instructions="Focus heavily on metrics and downside protection."
        ),
        ic_process=ICProcessConfig(
            review_stages=4,
            partner_review_required=True,
            red_team_required=True,
            war_room_required=True,
            ic_simulation_required=True,
            minimum_safe_to_share_status="verified"
        ),
        partner_preferences=[
            PartnerPreference(
                role_name="Risk Partner",
                focus_areas=["Downside protection", "Unit economics"],
                preferred_evidence=["Audited financials", "Customer contracts"],
                common_objections=["Unit economics don't scale", "Customer churn is hidden"],
                decision_style="Skeptical"
            )
        ],
        scoring_profile=ScoringProfile(
            market_weight=1.0,
            founder_weight=1.0,
            product_weight=1.0,
            traction_weight=1.5,
            financial_quality_weight=2.0,
            evidence_quality_weight=2.0
        ),
        metadata={"created_by": "System"}
    ),
    FundPlaybook(
        playbook_id="ai_native",
        playbook_name="AI-Native Fund Playbook",
        playbook_type="demo",
        fund_archetype="early_stage",
        investment_philosophy=InvestmentPhilosophy(
            founder_market_fit_importance="High",
            market_size_threshold="$1B+",
            capital_efficiency_preference="Low",
            technical_risk_tolerance="High",
            regulatory_risk_tolerance="Medium",
            valuation_sensitivity="Low"
        ),
        stage_strategies=[
            StageStrategy(
                stage_name="Seed",
                focus_metrics=["product velocity", "model defensibility"],
                acceptable_evidence_uncertainty="High",
                ownership_target="10-15%",
                required_data_room_items=["Architecture Diagram"]
            )
        ],
        sector_playbooks=[
            SectorPlaybook(
                sector_name="AI Infrastructure",
                focus_areas=["compute economics", "model defensibility", "open-source risk"],
                required_diligence_questions=["What happens if OpenAI drops prices by 10x?"],
                key_risks=["Model commoditization"],
                scoring_weight_adjustments={"product_weight": 2.0}
            )
        ],
        decision_gates=DecisionGateConfig(
            min_evidence_score_for_ic=50,
            min_data_room_completeness=40,
            required_cap_table_presence=False,
            required_customer_references=False,
            required_retention_data=False,
            required_gross_margin_data=False,
            maximum_unresolved_critical_blockers=1,
            ownership_feasibility_threshold=5.0
        ),
        memo_template=MemoTemplateConfig(
            required_sections=["Company Snapshot", "Thesis", "Data Moat", "AI Defensibility"],
            optional_sections=[],
            custom_instructions="Focus on workflow depth and distribution wedge."
        ),
        ic_process=ICProcessConfig(
            review_stages=2,
            partner_review_required=True,
            red_team_required=False,
            war_room_required=True,
            ic_simulation_required=False,
            minimum_safe_to_share_status="review_completed"
        ),
        partner_preferences=[
            PartnerPreference(
                role_name="Technical Partner",
                focus_areas=["Architecture", "Model efficiency"],
                preferred_evidence=["Benchmarks", "GitHub repos"],
                common_objections=["Wrapper risk", "No data moat"],
                decision_style="Technical"
            )
        ],
        scoring_profile=ScoringProfile(
            market_weight=1.0,
            founder_weight=1.5,
            product_weight=2.0,
            traction_weight=0.5,
            financial_quality_weight=0.5,
            evidence_quality_weight=0.8
        ),
        metadata={"created_by": "System"}
    )
]
""",
    "playbook_registry.py": """from .playbook_fixtures import DEFAULT_PLAYBOOKS
from .playbook_schemas import FundPlaybook
from typing import List, Dict

class PlaybookRegistry:
    def __init__(self):
        self.playbooks: Dict[str, FundPlaybook] = {p.playbook_id: p for p in DEFAULT_PLAYBOOKS}
        self.active_playbook_id = "apex_default"
        
    def get_all(self) -> List[FundPlaybook]:
        return list(self.playbooks.values())
        
    def get(self, playbook_id: str) -> FundPlaybook:
        return self.playbooks.get(playbook_id)
        
    def set_active(self, playbook_id: str):
        if playbook_id in self.playbooks:
            self.active_playbook_id = playbook_id
            
    def get_active(self) -> FundPlaybook:
        return self.playbooks.get(self.active_playbook_id)

playbook_registry = PlaybookRegistry()
""",
    "playbook_simulation_engine.py": """from .playbook_schemas import PlaybookSimulationResult, FundPlaybook

def simulate_deal(company_name: str, playbook: FundPlaybook) -> PlaybookSimulationResult:
    # Deterministic mock simulation logic based on company name
    if company_name == "Sarvam AI":
        if playbook.playbook_id == "ai_native":
            return PlaybookSimulationResult(
                company_name=company_name, playbook_id=playbook.playbook_id, playbook_name=playbook.playbook_name,
                base_score=75, playbook_adjusted_score=88, recommendation="Investigate Deeply",
                gates_triggered=[], biggest_blocker="Wrapper vs Foundation model risk", required_next_action="Technical diligence"
            )
        elif playbook.playbook_id == "evidence_heavy":
            return PlaybookSimulationResult(
                company_name=company_name, playbook_id=playbook.playbook_id, playbook_name=playbook.playbook_name,
                base_score=75, playbook_adjusted_score=45, recommendation="Pass / Monitor",
                gates_triggered=["min_data_room_completeness", "required_retention_data"],
                biggest_blocker="Missing verified financial data room", required_next_action="Request Data Room"
            )
        else:
            return PlaybookSimulationResult(
                company_name=company_name, playbook_id=playbook.playbook_id, playbook_name=playbook.playbook_name,
                base_score=75, playbook_adjusted_score=75, recommendation="Monitor",
                gates_triggered=["public_benchmark_only"],
                biggest_blocker="Cannot invest on public data alone", required_next_action="Get founder meeting"
            )
    elif company_name == "NeuralDesk":
        return PlaybookSimulationResult(
            company_name=company_name, playbook_id=playbook.playbook_id, playbook_name=playbook.playbook_name,
            base_score=80, playbook_adjusted_score=80 + (10 if playbook.playbook_id == 'evidence_heavy' else 0),
            recommendation="IC Ready" if playbook.playbook_id == 'evidence_heavy' else "Strong Buy",
            gates_triggered=[], biggest_blocker="Valuation", required_next_action="Negotiate term sheet"
        )
    else:
        return PlaybookSimulationResult(
            company_name=company_name, playbook_id=playbook.playbook_id, playbook_name=playbook.playbook_name,
            base_score=60, playbook_adjusted_score=60, recommendation="Pass",
            gates_triggered=["min_evidence_score_for_ic"], biggest_blocker="Poor traction signals", required_next_action="Archive"
        )
""",
    "playbook_orchestrator.py": """from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
from .playbook_registry import playbook_registry
from .playbook_schemas import FundPlaybook, PlaybookSimulationResult
from .playbook_simulation_engine import simulate_deal

router = APIRouter()

@router.get("/status")
async def get_status():
    active = playbook_registry.get_active()
    return {
        "status": "healthy",
        "active_playbook_id": active.playbook_id if active else None,
        "active_playbook_name": active.playbook_name if active else None,
        "playbooks_loaded": len(playbook_registry.get_all())
    }

@router.get("", response_model=List[FundPlaybook])
async def list_playbooks():
    return playbook_registry.get_all()

@router.get("/defaults", response_model=List[FundPlaybook])
async def list_default_playbooks():
    return playbook_registry.get_all()

@router.get("/{playbook_id}", response_model=FundPlaybook)
async def get_playbook(playbook_id: str):
    playbook = playbook_registry.get(playbook_id)
    if not playbook:
        raise HTTPException(status_code=404, detail="Playbook not found")
    return playbook

class ActivateRequest(BaseModel):
    playbook_id: str

@router.post("/activate")
async def activate_playbook(req: ActivateRequest):
    playbook_registry.set_active(req.playbook_id)
    return {"status": "success", "active_playbook": playbook_registry.active_playbook_id}

@router.post("/simulate/deal/{deal_id}")
async def simulate_deal_endpoint(deal_id: str):
    # Map deal_id to company name for deterministic output
    name_map = {"1": "Sarvam AI", "2": "NeuralDesk", "3": "Zepto"}
    company_name = name_map.get(deal_id, "Unknown Company")
    
    results = []
    # Simulate against a few key playbooks
    for pid in ["apex_default", "ai_native", "evidence_heavy"]:
        pb = playbook_registry.get(pid)
        if pb:
            results.append(simulate_deal(company_name, pb))
            
    return {"results": results}

@router.post("/compare")
async def compare_playbooks(req: Dict[str, str]):
    pb_a = playbook_registry.get(req.get("playbookA"))
    pb_b = playbook_registry.get(req.get("playbookB"))
    if not pb_a or not pb_b:
        raise HTTPException(status_code=404, detail="Playbooks not found")
        
    return {
        "differences": [
            {"dimension": "Market Size Threshold", "a": pb_a.investment_philosophy.market_size_threshold, "b": pb_b.investment_philosophy.market_size_threshold},
            {"dimension": "Evidence Strictness", "a": pb_a.investment_philosophy.capital_efficiency_preference, "b": pb_b.investment_philosophy.capital_efficiency_preference},
            {"dimension": "Min Evidence Score", "a": pb_a.decision_gates.min_evidence_score_for_ic, "b": pb_b.decision_gates.min_evidence_score_for_ic}
        ]
    }
"""
}

# The remaining mock engines that don't need real logic yet
dummy_engines = [
    "methodology_builder.py",
    "investment_criteria_engine.py",
    "stage_strategy_engine.py",
    "sector_playbook_engine.py",
    "decision_gate_config_engine.py",
    "scoring_profile_engine.py",
    "memo_template_engine.py",
    "ic_process_engine.py",
    "partner_preference_engine.py",
    "diligence_checklist_engine.py",
    "playbook_diff_engine.py",
    "playbook_report_builder.py"
]

for dummy in dummy_engines:
    if dummy not in files:
        files[dummy] = "# " + dummy + "\\n# Placeholder for future logic expansion\\n"

for name, content in files.items():
    with open(os.path.join(base_dir, name), "w") as f:
        f.write(content)

print("Fund Playbook Engine backend files generated.")
